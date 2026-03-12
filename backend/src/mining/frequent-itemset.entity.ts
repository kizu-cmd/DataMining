import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'frequent_itemsets' })
export class FrequentItemsetEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  itemsJson: string;

  @Column({ type: 'float' })
  support: number;

  @Column({ type: 'int' })
  count: number;

  @CreateDateColumn()
  createdAt: Date;
}
