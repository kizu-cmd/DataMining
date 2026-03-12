import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComboCreationEntity } from './combo-creation.entity';
import { CreateComboDto } from './dto/create-combo.dto';

@Injectable()
export class CombosService {
  constructor(
    @InjectRepository(ComboCreationEntity)
    private readonly comboRepo: Repository<ComboCreationEntity>,
  ) {}

  async createCombo(payload: CreateComboDto) {
    const row = this.comboRepo.create({
      itemsJson: JSON.stringify(payload.items ?? []),
      support: payload.support,
      confidence: payload.confidence,
      source: payload.source || 'trending',
    });
    await this.comboRepo.save(row);
    return { status: 'created' };
  }
}
