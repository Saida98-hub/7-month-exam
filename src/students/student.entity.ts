import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Group } from '../groups/group.entity';
import * as bcrypt from 'bcrypt';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  fullName!: string;

  @Column({ type: 'varchar' })
  phone!: string;

  @Column({ type: 'varchar', nullable: true })
  parentPhone!: string;

  @Column({ type: 'varchar', nullable: true })
  parentName!: string;

  @Column({ type: 'varchar', nullable: true })
  address!: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  password!: string;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToOne(() => Group, (group) => group.students, { nullable: true })
  @JoinColumn()
  group!: Group;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}