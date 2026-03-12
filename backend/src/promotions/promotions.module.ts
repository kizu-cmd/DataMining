import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionActivationEntity } from './promotion-activation.entity';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';

@Module({
  imports: [TypeOrmModule.forFeature([PromotionActivationEntity])],
  controllers: [PromotionsController],
  providers: [PromotionsService],
})
export class PromotionsModule {}
