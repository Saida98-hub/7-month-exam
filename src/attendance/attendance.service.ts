import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto, userId: number): Promise<Attendance[]> {
    const attendances = (createAttendanceDto.items || []).map((item) => {
      const attendance = new Attendance();
      attendance.student = { id: item.studentId } as any;
      attendance.group = { id: createAttendanceDto.groupId } as any;
      attendance.createdBy = { id: userId } as any;
      attendance.status = item.status!;
      attendance.date = createAttendanceDto.date!;
      attendance.note = createAttendanceDto.note ?? '';
      return attendance;
    });

    return this.attendanceRepository.save(attendances);
  }

  async findByGroup(groupId: number, date?: string): Promise<Attendance[]> {
    const qb = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('attendance.group', 'group')
      .where('group.id = :groupId', { groupId })
      .orderBy('attendance.date', 'DESC');

    if (date) {
      qb.andWhere('attendance.date = :date', { date });
    }

    return qb.getMany();
  }

  async findByStudent(studentId: number): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { student: { id: studentId } },
      relations: ['group'],
      order: { date: 'DESC' },
    });
  }

  async getAbsentToday(groupId: number): Promise<Attendance[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.attendanceRepository.find({
      where: {
        group: { id: groupId },
        date: today as any,
        status: 'absent' as any,
      },
      relations: ['student'],
    });
  }

  async remove(id: number): Promise<void> {
    const attendance = await this.attendanceRepository.findOne({ where: { id } });
    if (!attendance) throw new NotFoundException('Davomat topilmadi');
    await this.attendanceRepository.remove(attendance);
  }
}