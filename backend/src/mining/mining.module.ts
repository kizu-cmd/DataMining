import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiningService } from './mining.service';
import { TransactionEntity } from '../transactions/transaction.entity';
import { RecommendationEntity } from '../recommendations/recommendation.entity';
import { MiningStateEntity } from './mining-state.entity';
import { FrequentItemsetEntity } from './frequent-itemset.entity';
import { MiningController } from './mining.controller';
import { RecommendationsModule } from '../recommendations/recommendations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionEntity,
      RecommendationEntity,
      MiningStateEntity,
      FrequentItemsetEntity,
    ]),
    RecommendationsModule,
  ],
  controllers: [MiningController],
  providers: [MiningService],
  exports: [MiningService],
})
export class MiningModule {}
