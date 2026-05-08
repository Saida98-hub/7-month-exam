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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('To\'lovlar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.WORKER)
  @ApiOperation({ summary: 'To\'lov qilish' })
  create(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
    return this.paymentsService.create(createPaymentDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.WORKER)
  @ApiOperation({ summary: 'Barcha to\'lovlar' })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'groupId', required: false })
  @ApiQuery({ name: 'month', required: false, example: '2024-01' })
  findAll(
    @Query('studentId') studentId?: number,
    @Query('groupId') groupId?: number,
    @Query('month') month?: string,
  ) {
    return this.paymentsService.findAll({ studentId, groupId, month });
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.WORKER)
  @ApiOperation({ summary: 'To\'lovni ID bo\'yicha olish' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'To\'lovni o\'chirish' })
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}