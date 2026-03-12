import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'upsell_selections' })
export class UpsellSelectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  baseItem: string;

  @Column({ type: 'varchar', length: 255 })
  suggestedItem: string;

  @CreateDateColumn()
  createdAt: Date;
}
