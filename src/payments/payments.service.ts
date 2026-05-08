import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, userId: number): Promise<Payment> {
    const payment = new Payment();
    payment.student = { id: createPaymentDto.studentId } as any;
    payment.group = { id: createPaymentDto.groupId } as any;
    payment.createdBy = { id: userId } as any;
    payment.amount = createPaymentDto.amount!;
    payment.method = createPaymentDto.method!;
    payment.paymentDate = createPaymentDto.paymentDate!;
    payment.note = createPaymentDto.note ?? '';

    return this.paymentsRepository.save(payment);
  }

  async findAll(query?: {
    studentId?: number;
    groupId?: number;
    month?: string;
  }): Promise<{ data: Payment[]; total: number; sum: number }> {
    const qb = this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.student', 'student')
      .leftJoinAndSelect('payment.group', 'group')
      .leftJoinAndSelect('payment.createdBy', 'createdBy')
      .orderBy('payment.createdAt', 'DESC');

    if (query?.studentId) {
      qb.andWhere('student.id = :studentId', { studentId: query.studentId });
    }

    if (query?.groupId) {
      qb.andWhere('group.id = :groupId', { groupId: query.groupId });
    }

    if (query?.month) {
      qb.andWhere("TO_CHAR(payment.paymentDate, 'YYYY-MM') = :month", {
        month: query.month,
      });
    }

    const [data, total] = await qb.getManyAndCount();
    const sum = data.reduce((acc, p) => acc + Number(p.amount), 0);

    return { data, total, sum };
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['student', 'group', 'createdBy'],
    });

    if (!payment) throw new NotFoundException('To\'lov topilmadi');
    return payment;
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentsRepository.remove(payment);
  }

  async getTotalThisMonth(): Promise<number> {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const result = await this.findAll({ month });
    return result.sum;
  }
}