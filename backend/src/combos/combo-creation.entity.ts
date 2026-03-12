import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'combo_creations' })
export class ComboCreationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  itemsJson: string;

  @Column({ type: 'float' })
  support: number;

  @Column({ type: 'float' })
  confidence: number;

  @Column({ type: 'varchar', length: 32, default: 'trending' })
  source: string;

  @CreateDateColumn()
  createdAt: Date;
}
