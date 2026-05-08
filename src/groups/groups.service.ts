import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/uptade-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = this.groupsRepository.create(createGroupDto);

    if (createGroupDto.teacherId) {
      group.teacher = { id: createGroupDto.teacherId } as any;
    }

    return this.groupsRepository.save(group);
  }

  async findAll(query?: { search?: string }): Promise<Group[]> {
    const qb = this.groupsRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.teacher', 'teacher')
      .leftJoinAndSelect('group.students', 'students')
      .orderBy('group.createdAt', 'DESC');

    if (query?.search) {
      qb.andWhere(
        'group.name ILIKE :search OR group.subject ILIKE :search',
        { search: `%${query.search}%` },
      );
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Group> {
    const group = await this.groupsRepository.findOne({
      where: { id },
      relations: ['teacher', 'students'],
    });

    if (!group) throw new NotFoundException('Guruh topilmadi');
    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.findOne(id);

    if (updateGroupDto.teacherId) {
      group.teacher = { id: updateGroupDto.teacherId } as any;
    }

    Object.assign(group, updateGroupDto);
    return this.groupsRepository.save(group);
  }

  async remove(id: number): Promise<{ message: string }> {
    const group = await this.findOne(id);

    // O'quvchilarni guruhdan ajratish — alohida repository kerak emas
    await this.groupsRepository.manager.query(
      `UPDATE students SET "groupId" = NULL WHERE "groupId" = $1`,
      [id],
    );

    await this.groupsRepository.remove(group);
    return { message: `"${group.name}" guruhi muvaffaqiyatli o'chirildi` };
  }

  async countAll(): Promise<number> {
    return this.groupsRepository.count({ where: { isActive: true } });
  }
}