import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'recommendations' })
export class RecommendationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  antecedentsJson: string;

  @Column({ type: 'text' })
  consequentsJson: string;

  @Column({ type: 'float' })
  support: number;

  @Column({ type: 'float' })
  confidence: number;

  @Column({ type: 'float' })
  lift: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  leverage: number | null;

  @Column({ type: 'float', nullable: true, default: 0 })
  conviction: number | null;

  @Column({ type: 'float' })
  score: number;

  @CreateDateColumn()
  createdAt: Date;
}
