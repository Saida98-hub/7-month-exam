import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AppealsService } from './appeals.service';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { UpdateAppealDto } from './dto/uptade-appeal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { AppealStatus } from './appeal.entity';

@ApiTags('Murojaatlar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appeals')
export class AppealsController {
  constructor(private readonly appealsService: AppealsService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.WORKER)
  @ApiOperation({ summary: 'Yangi murojaat qo\'shish' })
  create(@Body() createAppealDto: CreateAppealDto) {
    return this.appealsService.create(createAppealDto);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.WORKER)
  @ApiOperation({ summary: 'Barcha murojaatlar' })
  @ApiQuery({ name: 'status', required: false, enum: AppealStatus })
  @ApiQuery({ name: 'date', required: false, example: '2024-01-01' })
  findAll(
    @Query('status') status?: AppealStatus,
    @Query('date') date?: string,
  ) {
    return this.appealsService.findAll({ status, date });
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.WORKER)
  @ApiOperation({ summary: 'Murojaatni ID bo\'yicha olish' })
  findOne(@Param('id') id: string) {
    return this.appealsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.WORKER)
  @ApiOperation({ summary: 'Murojaatni yangilash' })
  update(@Param('id') id: string, @Body() updateAppealDto: UpdateAppealDto) {
    return this.appealsService.update(+id, updateAppealDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Murojaatni o\'chirish' })
  remove(@Param('id') id: string) {
    return this.appealsService.remove(+id);
  }
}