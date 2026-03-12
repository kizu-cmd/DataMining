import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionEntity } from './transaction.entity';
import { MiningModule } from '../mining/mining.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), MiningModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
