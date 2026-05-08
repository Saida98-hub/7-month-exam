import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../students/student.entity';
import { Group } from '../groups/group.entity';
import { User } from '../users/user.entity';

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Student)
  @JoinColumn()
  student!: Student;

  @ManyToOne(() => Group)
  @JoinColumn()
  group!: Group;

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy!: User;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  method!: PaymentMethod;

  @Column({ type: 'varchar', nullable: true })
  note!: string;

  @Column({ type: 'date' })
  paymentDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}