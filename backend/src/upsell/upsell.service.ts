import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpsellSelectionEntity } from './upsell-selection.entity';
import { UpsellAcceptDto } from './dto/upsell-accept.dto';

@Injectable()
export class UpsellService {
  constructor(
    @InjectRepository(UpsellSelectionEntity)
    private readonly upsellRepo: Repository<UpsellSelectionEntity>,
  ) {}

  async acceptSuggestion(payload: UpsellAcceptDto) {
    const row = this.upsellRepo.create({
      baseItem: payload.baseItem,
      suggestedItem: payload.suggestedItem,
    });
    await this.upsellRepo.save(row);
    return { status: 'accepted' };
  }
}
