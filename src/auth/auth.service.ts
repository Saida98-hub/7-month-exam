import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { StudentsService } from '../students/students.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private studentsService: StudentsService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: string, password: string) {
    // ─── 1. Avval oddiy foydalanuvchilarni tekshirish ─────────────────────
    const user = await this.usersService.findByPhone(phone);

    if (user) {
      if (!user.isActive) throw new UnauthorizedException('Akkaunt bloklangan');
      if (!user.password) throw new UnauthorizedException('Invalid credentials');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Telefon yoki parol noto\'g\'ri');

      return { ...user, role: user.role, type: 'user' };
    }

    // ─── 2. Keyin student tekshirish ──────────────────────────────────────
    const student = await this.studentsService.findByPhone(phone);

    if (student) {
      if (!student.isActive)
        throw new UnauthorizedException('O\'quvchi akkaunti bloklangan');
      if (!student.password)
        throw new UnauthorizedException(
          'Bu o\'quvchiga hali parol berilmagan. Adminga murojaat qiling.',
        );

      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch)
        throw new UnauthorizedException('Telefon yoki parol noto\'g\'ri');

      return { ...student, role: 'student', type: 'student' };
    }

    // ─── 3. Topilmadi ─────────────────────────────────────────────────────
    throw new UnauthorizedException('Telefon yoki parol noto\'g\'ri');
  }

  async login(user: any) {
    const payload = {
      phone: user.phone,
      sub: user.id,
      role: user.role,   // 'superadmin' | 'admin' | 'worker' | 'student'
      type: user.type,   // 'user' | 'student'
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        type: user.type,
        ...(user.type === 'student' && {
          group: user.group,
        }),
      },
    };
  }

  async getProfile(user: any) {
    if (user.type === 'student' || user.role === 'student') {
      return this.studentsService.findOne(user.id);
    }
    return this.usersService.findOne(user.id);
  }
}