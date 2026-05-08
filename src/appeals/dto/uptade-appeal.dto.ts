import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber } from 'class-validator';
import { AppealStatus } from '../appeal.entity';

export class UpdateAppealDto {
  @ApiProperty({ enum: AppealStatus, required: false })
  @IsOptional()
  @IsEnum(AppealStatus)
  status?: AppealStatus;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  assignedToId?: number;
}