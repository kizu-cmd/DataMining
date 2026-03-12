import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { TransactionEntity } from './transaction.entity';
import { PlaceOrderDto } from './dto/place-order.dto';
import { BulkTransactionsDto } from './dto/bulk-transactions.dto';
import { MiningService } from '../mining/mining.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
    private readonly miningService: MiningService,
  ) {}

  async placeOrder(payload: PlaceOrderDto) {
    const orderId = randomUUID();
    const uniqueItems = new Set<string>();

    for (const item of payload.items ?? []) {
      if (item?.name) {
        uniqueItems.add(item.name.trim());
      }
    }

    const rows = Array.from(uniqueItems).map((name) =>
      this.transactionRepo.create({ orderId, item: name }),
    );

    if (rows.length > 0) {
      await this.transactionRepo.save(rows);
      await this.miningService.maybeRunMining();
    }

    return { orderId, status: 'placed' };
  }

  async ingestTransactions(payload: BulkTransactionsDto) {
    const mode = payload?.mode === 'append' ? 'append' : 'replace';
    if (mode === 'replace') {
      await this.transactionRepo.clear();
      await this.miningService.resetState();
    }

    const rows = (payload?.rows ?? [])
      .filter((r) => r?.order_id && r?.item)
      .map((r) =>
        this.transactionRepo.create({
          orderId: String(r.order_id),
          item: String(r.item).trim(),
        }),
      );

    if (rows.length > 0) {
      await this.transactionRepo.save(rows);
      await this.miningService.maybeRunMining();
    }

    return { inserted: rows.length, mode };
  }
}
