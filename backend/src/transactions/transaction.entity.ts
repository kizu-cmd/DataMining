import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 64 })
  orderId: string;

  @Column({ type: 'varchar', length: 255 })
  item: string;

  @CreateDateColumn()
  createdAt: Date;
}
