import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Student } from './student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/uptade-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  // ─── STATISTIKA ─────────────────────────────────────────

  async countAll(): Promise<number> {
    return this.studentsRepository.count();
  }

  async countLeft(): Promise<number> {
    return this.studentsRepository.count({
      where: { isActive: false },
    });
  }

  async countActive(): Promise<number> {
    return this.studentsRepository.count({
      where: { isActive: true },
    });
  }

  // ─── Barcha o'quvchilarni olish ─────────────────────────

  async findAll(params: {
    search?: string;
    groupId?: number;
    isActive?: boolean;
  }): Promise<Student[]> {
    const query = this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.group', 'group');

    if (params.search) {
      query.andWhere(
        '(student.fullName ILIKE :search OR student.phone ILIKE :search)',
        { search: `%${params.search}%` },
      );
    }

    if (params.groupId) {
      query.andWhere('group.id = :groupId', {
        groupId: params.groupId,
      });
    }

    if (params.isActive !== undefined) {
      query.andWhere('student.isActive = :isActive', {
        isActive: params.isActive,
      });
    }

    return query.orderBy('student.createdAt', 'DESC').getMany();
  }

  // ─── ID bo'yicha olish ─────────────────────────────────

  async findOne(id: number): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { id },
      relations: ['group'],
    });

    if (!student) {
      throw new NotFoundException(`ID: ${id} bo'yicha o'quvchi topilmadi`);
    }

    return student;
  }

  // ─── Telefon orqali (auth uchun) ───────────────────────

  async findByPhone(phone: string): Promise<Student | null> {
    return this.studentsRepository
      .createQueryBuilder('student')
      .addSelect('student.password')
      .leftJoinAndSelect('student.group', 'group')
      .where('student.phone = :phone', { phone })
      .getOne();
  }

  // ─── Yaratish ──────────────────────────────────────────

  async create(dto: CreateStudentDto): Promise<Student> {
    const existing = await this.studentsRepository.findOne({
      where: { phone: dto.phone },
    });

    if (existing) {
      throw new BadRequestException(
        `${dto.phone} raqamli o'quvchi allaqachon mavjud`,
      );
    }

    const student = this.studentsRepository.create({
      fullName: dto.fullName,
      phone: dto.phone,
      parentPhone: dto.parentPhone,
      parentName: dto.parentName,
      address: dto.address,
      isActive: true,
      ...(dto.groupId ? { group: { id: dto.groupId } } : {}),
    });

    return this.studentsRepository.save(student);
  }

  // ─── Update ────────────────────────────────────────────

  async update(id: number, dto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);

    if (dto.phone && dto.phone !== student.phone) {
      const existing = await this.studentsRepository.findOne({
        where: { phone: dto.phone },
      });

      if (existing) {
        throw new BadRequestException(
          `${dto.phone} raqamli o'quvchi allaqachon mavjud`,
        );
      }
    }

    Object.assign(student, {
      ...(dto.fullName !== undefined && { fullName: dto.fullName }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.parentPhone !== undefined && { parentPhone: dto.parentPhone }),
      ...(dto.parentName !== undefined && { parentName: dto.parentName }),
      ...(dto.address !== undefined && { address: dto.address }),
      ...(dto.groupId !== undefined && { group: { id: dto.groupId } }),
    });

    return this.studentsRepository.save(student);
  }

  // ─── Delete ────────────────────────────────────────────

  async remove(id: number): Promise<{ message: string }> {
    const student = await this.findOne(id);
    await this.studentsRepository.remove(student);

    return {
      message: `${student.fullName} muvaffaqiyatli o'chirildi`,
    };
  }

  // ─── Parol qo‘yish ─────────────────────────────────────

  async setPassword(
    id: number,
    password: string,
  ): Promise<{ message: string }> {
    const student = await this.findOne(id);

    const hashed = await bcrypt.hash(password, 10);

    await this.studentsRepository.update(id, {
      password: hashed,
    });

    return {
      message: `${student.fullName} uchun parol o'rnatildi`,
    };
  }

  // ─── Group bo‘yicha ────────────────────────────────────

  async findByGroup(groupId: number): Promise<Student[]> {
    return this.studentsRepository.find({
      where: { group: { id: groupId } },
      relations: ['group'],
      order: { fullName: 'ASC' },
    });
  }

  // ─── Active toggle ─────────────────────────────────────

  async toggleActive(id: number): Promise<Student> {
    const student = await this.findOne(id);
    student.isActive = !student.isActive;

    return this.studentsRepository.save(student);
  }
}