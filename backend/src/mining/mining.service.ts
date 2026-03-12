import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { spawn } from 'child_process';
import { join } from 'path';
import { TransactionEntity } from '../transactions/transaction.entity';
import { RecommendationEntity } from '../recommendations/recommendation.entity';
import { MiningStateEntity } from './mining-state.entity';

interface MiningResultRow {
  antecedents: string[];
  consequents: string[];
  support: number;
  confidence: number;
  lift: number;
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

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
    @InjectRepository(RecommendationEntity)
    private readonly recommendationRepo: Repository<RecommendationEntity>,
    @InjectRepository(MiningStateEntity)
    private readonly stateRepo: Repository<MiningStateEntity>,
  ) {}

  async maybeRunMining() {
    const state = await this.getOrCreateState();
    const newCount = await this.transactionRepo.count({
      where: { id: MoreThan(state.lastProcessedId) },
    });

    if (newCount >= 100) {
      await this.runMining('threshold');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async runDaily() {
    await this.runMining('cron');
  }

  async runMining(trigger: 'threshold' | 'cron') {
    const transactions = await this.transactionRepo.find({
      select: ['orderId', 'item'],
      order: { id: 'ASC' },
    });

    if (transactions.length === 0) {
      this.logger.warn('No transactions available for mining.');
      return;
    }

    const payload = transactions.map((t) => ({
      order_id: t.orderId,
      item: t.item,
    }));

    const output = await this.runPythonWorker(payload);
    const rules = output.rules;

    await this.recommendationRepo.clear();
    if (rules.length > 0) {
      const rows = rules.map((rule) =>
        this.recommendationRepo.create({
          antecedentsJson: JSON.stringify(rule.antecedents),
          consequentsJson: JSON.stringify(rule.consequents),
          support: rule.support,
          confidence: rule.confidence,
          lift: rule.lift,
          score: rule.score,
        }),
      );
      await this.recommendationRepo.save(rows);
    }

    const maxId = await this.transactionRepo
      .createQueryBuilder('t')
      .select('MAX(t.id)', 'max')
      .getRawOne<{ max: string | null }>();

    const state = await this.getOrCreateState();
    state.lastProcessedId = Number(maxId?.max ?? state.lastProcessedId);
    await this.stateRepo.save(state);

    this.logger.log(`Mining complete via ${trigger}. Saved ${rules.length} recommendations.`);
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
}
