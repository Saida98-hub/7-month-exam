import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Davomat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.WORKER)
  @ApiOperation({ summary: 'Davomat olish' })
  create(@Body() createAttendanceDto: CreateAttendanceDto, @Request() req) {
    return this.attendanceService.create(createAttendanceDto, req.user.id);
  }

  @Get('group/:groupId')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.WORKER)
  @ApiOperation({ summary: 'Guruh davomati' })
  @ApiQuery({ name: 'date', required: false, example: '2024-01-01' })
  findByGroup(
    @Param('groupId') groupId: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.findByGroup(+groupId, date);
  }

  @Get('student/:studentId')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.WORKER)
  @ApiOperation({ summary: 'O\'quvchi davomati' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.attendanceService.findByStudent(+studentId);
  }

  @Get('absent/:groupId')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.WORKER)
  @ApiOperation({ summary: 'Bugun kelmaganlar' })
  getAbsentToday(@Param('groupId') groupId: string) {
    return this.attendanceService.getAbsentToday(+groupId);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Davomatni o\'chirish' })
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(+id);
  }
}