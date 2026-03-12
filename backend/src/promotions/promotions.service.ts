import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromotionActivationEntity } from './promotion-activation.entity';
import { ActivatePromotionDto } from './dto/activate-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(PromotionActivationEntity)
    private readonly promotionRepo: Repository<PromotionActivationEntity>,
  ) {}

  async activatePromotion(payload: ActivatePromotionDto) {
    const row = this.promotionRepo.create({
      promotionId: payload.id,
      description: payload.description,
    });
    await this.promotionRepo.save(row);
    return { status: 'activated' };
  }
}
