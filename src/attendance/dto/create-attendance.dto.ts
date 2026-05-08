import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsDateString, IsOptional, IsString, IsArray } from 'class-validator';
import { AttendanceStatus } from '../attendance.entity';

export class AttendanceItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  studentId!: number;

  @ApiProperty({ enum: AttendanceStatus, example: AttendanceStatus.PRESENT })
  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;
}

export class CreateAttendanceDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  groupId!: number;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  date!: Date;

  @ApiProperty({ type: [AttendanceItemDto] })
  @IsArray()
  items!: AttendanceItemDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}