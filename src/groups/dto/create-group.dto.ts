import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Matematika 1-guruh' })
  @IsString()
  name: string | undefined;

  @ApiProperty({ example: 'Matematika' })
  @IsString()
  subject: string | undefined;

  @ApiProperty({ example: '09:00' })
  @IsString()
  startTime: string | undefined;

  @ApiProperty({ example: '11:00' })
  @IsString()
  endTime: string | undefined;

  @ApiProperty({ example: 'Du-Chor-Ju' })
  @IsString()
  days: string | undefined;

  @ApiProperty({ example: 800000 })
  @IsNumber()
  price: number | undefined;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  teacherId?: number;
}