import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appeal, AppealStatus } from './appeal.entity';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { UpdateAppealDto } from './dto/uptade-appeal.dto';

@Injectable()
export class AppealsService {
  constructor(
    @InjectRepository(Appeal)
    private appealsRepository: Repository<Appeal>,
  ) {}

  async create(createAppealDto: CreateAppealDto): Promise<Appeal> {
    const appeal = this.appealsRepository.create(createAppealDto);
    return this.appealsRepository.save(appeal);
  }

  async findAll(query?: {
    status?: AppealStatus;
    date?: string;
  }): Promise<Appeal[]> {
    const qb = this.appealsRepository
      .createQueryBuilder('appeal')
      .leftJoinAndSelect('appeal.assignedTo', 'assignedTo')
      .orderBy('appeal.createdAt', 'DESC');

    if (query?.status) {
      qb.andWhere('appeal.status = :status', { status: query.status });
    }

    if (query?.date) {
      qb.andWhere('DATE(appeal.createdAt) = :date', { date: query.date });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Appeal> {
    const appeal = await this.appealsRepository.findOne({
      where: { id },
      relations: ['assignedTo'],
    });

    if (!appeal) throw new NotFoundException('Murojaat topilmadi');
    return appeal;
  }

  async update(id: number, updateAppealDto: UpdateAppealDto): Promise<Appeal> {
    const appeal = await this.findOne(id);

    if (updateAppealDto.assignedToId) {
      appeal.assignedTo = { id: updateAppealDto.assignedToId } as any;
    }

    if (updateAppealDto.status) {
      appeal.status = updateAppealDto.status;
    }

    return this.appealsRepository.save(appeal);
  }

  async remove(id: number): Promise<void> {
    const appeal = await this.findOne(id);
    await this.appealsRepository.remove(appeal);
  }

  async countToday(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    return this.appealsRepository
      .createQueryBuilder('appeal')
      .where('DATE(appeal.createdAt) = :today', { today })
      .getCount();
  }
}