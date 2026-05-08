import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/uptade-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.createSuperAdmin();
  }

  // Superadmin avtomatik yaratish
  private async createSuperAdmin() {
    const superadmin = await this.usersRepository.findOne({
      where: { role: UserRole.SUPERADMIN },
    });

    if (!superadmin) {
      const hashedPassword = await bcrypt.hash('superadmin5555', 10);
      await this.usersRepository.save({
        fullName: 'Super Admin',
        phone: '+998000000000',
        password: hashedPassword,
        role: UserRole.SUPERADMIN,
      });
      console.log('✅ Superadmin yaratildi: +998000000000 / superadmin5555');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { phone: createUserDto.phone },
    });

    if (existing) {
      throw new ConflictException('Bu telefon raqam allaqachon mavjud');
    }

   // Keyin:
if (!createUserDto.password) throw new BadRequestException('Password required');
const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

// save() xatosi uchun:
const user = this.usersRepository.create({
  ...createUserDto,
  password: hashedPassword,
});
return this.usersRepository.save(user); // User[] emas, User qaytaradi

  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'fullName', 'phone', 'role', 'isActive', 'createdAt'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'fullName', 'phone', 'role', 'isActive', 'createdAt'],
    });

    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async findByPhone(phone: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { phone } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async assignRole(id: number, role: UserRole): Promise<User> {
    const user = await this.findOne(id);
    user.role = role;
    return this.usersRepository.save(user);
  }
}