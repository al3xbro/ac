import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { AcMode } from './ac-status.enum.js';

@Entity()
export class AcStatus {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  isOn!: boolean;

  @Column({ type: 'enum', enum: AcMode })
  mode!: AcMode;

  @CreateDateColumn()
  timestamp!: Date;
}
