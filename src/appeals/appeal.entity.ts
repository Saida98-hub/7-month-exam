import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum AppealStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Entity('appeals')
export class Appeal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  fullName!: string;

  @Column({ type: 'varchar' })
  phone!: string;

  @Column({ type: 'varchar', nullable: true })
  subject!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({
    type: 'enum',
    enum: AppealStatus,
    default: AppealStatus.NEW,
  })
  status!: AppealStatus;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  assignedTo!: User;

  @CreateDateColumn()
  createdAt!: Date;
}