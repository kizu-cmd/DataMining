import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { spawn } from 'child_process';
import { join } from 'path';
import { TransactionEntity } from '../transactions/transaction.entity';
import { RecommendationEntity } from '../recommendations/recommendation.entity';
import { MiningStateEntity } from './mining-state.entity';
import { FrequentItemsetEntity } from './frequent-itemset.entity';

interface MiningResultRow {
  antecedents: string[];
  consequents: string[];
  support: number;
  confidence: number;
  lift: number;
  leverage: number;
  conviction: number;
  score: number;
}

interface MiningItemsetRow {
  items: string[];
  support: number;
  count: number;
}

export interface MiningWorkerOutput {
  frequent_itemsets: MiningItemsetRow[];
  rules: MiningResultRow[];
}

@Injectable()
export class MiningService {
  private readonly logger = new Logger(MiningService.name);
  private miningInProgress = false;
  private pendingRun = false;
  private readonly minNewOrders = Math.max(
    1,
    Number(process.env.MIN_NEW_ORDERS_FOR_MINING ?? 1),
  );

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
    @InjectRepository(RecommendationEntity)
    private readonly recommendationRepo: Repository<RecommendationEntity>,
    @InjectRepository(FrequentItemsetEntity)
    private readonly itemsetRepo: Repository<FrequentItemsetEntity>,
    @InjectRepository(MiningStateEntity)
    private readonly stateRepo: Repository<MiningStateEntity>,
  ) {}

  async maybeRunMining() {
    const newCount = await this.countNewOrders();
    if (newCount < this.minNewOrders) {
      return;
    }

    if (this.miningInProgress) {
      this.pendingRun = true;
      return;
    }

    this.miningInProgress = true;
    try {
      do {
        this.pendingRun = false;
        const count = await this.countNewOrders();
        if (count < this.minNewOrders) {
          break;
        }
        await this.runMining('threshold');
      } while (this.pendingRun);
    } finally {
      this.miningInProgress = false;
      this.pendingRun = false;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async runDaily() {
    await this.runMining('cron');
  }

  async runMining(trigger: 'threshold' | 'cron') {
    const transactions = await this.transactionRepo.find({
      select: ['id', 'orderId', 'item'],
      order: { id: 'ASC' },
    });

    if (transactions.length === 0) {
      this.logger.warn('No transactions available for mining.');
      return;
    }

    const maxIncludedId = transactions[transactions.length - 1]?.id ?? 0;

    const payload = transactions.map((t) => ({
      order_id: t.orderId,
      item: t.item,
    }));

    const output = await this.runPythonWorker(payload);
    const rules = output.rules;
    const itemsets = output.frequent_itemsets;

    await this.recommendationRepo.clear();
    await this.itemsetRepo.clear();

    if (itemsets.length > 0) {
      const itemsetRows = itemsets.map((itemset) =>
        this.itemsetRepo.create({
          itemsJson: JSON.stringify(itemset.items),
          support: itemset.support,
          count: itemset.count,
        }),
      );
      await this.itemsetRepo.save(itemsetRows);
    }

    if (rules.length > 0) {
      const rows = rules.map((rule) =>
        this.recommendationRepo.create({
          antecedentsJson: JSON.stringify(rule.antecedents),
          consequentsJson: JSON.stringify(rule.consequents),
          support: rule.support,
          confidence: rule.confidence,
          lift: rule.lift,
          leverage: rule.leverage,
          conviction: rule.conviction,
          score: rule.score,
        }),
      );
      await this.recommendationRepo.save(rows);
    }

    const state = await this.getOrCreateState();
    state.lastProcessedId = maxIncludedId;
    await this.stateRepo.save(state);

    this.logger.log(`Mining complete via ${trigger}. Saved ${rules.length} recommendations.`);
  }

  async getLatestAnalysis() {
    const [rules, itemsets, totalTransactions, state] = await Promise.all([
      this.recommendationRepo.find({ order: { score: 'DESC' } }),
      this.itemsetRepo.find({ order: { support: 'DESC' } }),
      this.countDistinctOrders(),
      this.getOrCreateState(),
    ]);

    const lastUpdated = state.updatedAt ? new Date(state.updatedAt).toISOString() : null;

    return {
      totalTransactions,
      lastUpdated,
      frequentItemsets: itemsets.map((row) => ({
        items: JSON.parse(row.itemsJson),
        support: row.support,
        count: row.count,
      })),
      rules: rules.map((row) => ({
        antecedent: JSON.parse(row.antecedentsJson).join(' + '),
        consequent: JSON.parse(row.consequentsJson).join(' + '),
        support: row.support,
        confidence: row.confidence,
        lift: row.lift,
        leverage: row.leverage ?? 0,
        conviction: row.conviction ?? 0,
      })),
    };
  }

  async resetState() {
    await this.recommendationRepo.clear();
    await this.itemsetRepo.clear();
    await this.stateRepo.clear();
  }

  runPythonWorker(payload: unknown): Promise<MiningWorkerOutput> {
    return new Promise((resolve, reject) => {
      const python = process.env.PYTHON_PATH || 'python';
      const scriptPath = join(process.cwd(), 'src', 'scripts', 'mining_worker.py');

      const child = spawn(python, [scriptPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
      });

      child.on('error', (err) => reject(err));

      child.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`mining_worker.py exited with ${code}: ${stderr}`));
        }
        try {
          const parsed = JSON.parse(stdout || '{}') as MiningWorkerOutput;
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      });

      child.stdin.write(JSON.stringify(payload));
      child.stdin.end();
    });
  }

  private async getOrCreateState() {
    let state = await this.stateRepo.findOne({ where: { id: 1 } });
    if (!state) {
      state = this.stateRepo.create({ id: 1, lastProcessedId: 0 });
      state = await this.stateRepo.save(state);
    }
    return state;
  }

  private async countDistinctOrders() {
    const raw = await this.transactionRepo
      .createQueryBuilder('t')
      .select('COUNT(DISTINCT t.orderId)', 'count')
      .getRawOne<{ count: string }>();
    return Number(raw?.count ?? 0);
  }

  private async countNewOrders() {
    const state = await this.getOrCreateState();
    const raw = await this.transactionRepo
      .createQueryBuilder('t')
      .select('COUNT(DISTINCT t.orderId)', 'count')
      .where('t.id > :lastId', { lastId: state.lastProcessedId })
      .getRawOne<{ count: string }>();
    return Number(raw?.count ?? 0);
  }
}
