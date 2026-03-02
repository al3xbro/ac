import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class PushSubscription {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  endpoint!: string;

  @Column()
  p256dh!: string;

  @Column()
  auth!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
