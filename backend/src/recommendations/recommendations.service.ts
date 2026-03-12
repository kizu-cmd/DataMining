import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendationEntity } from './recommendation.entity';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(RecommendationEntity)
    private readonly recommendationRepo: Repository<RecommendationEntity>,
  ) {}

  async getRecommendations() {
    const rows = await this.recommendationRepo.find({ order: { score: 'DESC' } });
    return rows.map((row) => ({
      antecedents: JSON.parse(row.antecedentsJson),
      consequents: JSON.parse(row.consequentsJson),
      support: row.support,
      confidence: row.confidence,
      lift: row.lift,
      score: row.score,
    }));
  }
}
