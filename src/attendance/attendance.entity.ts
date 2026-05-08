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

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
}

@Entity('attendance')
export class Attendance {
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

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status!: AttendanceStatus;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'varchar', nullable: true })
  note!: string;

  @CreateDateColumn()
  createdAt!: Date;
}