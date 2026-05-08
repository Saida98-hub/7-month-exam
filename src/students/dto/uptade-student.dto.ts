import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class UpdateStudentDto {
  @ApiProperty({ example: 'Muhammadaliyev Ibrohim', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: '+998901234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '+998901234567', required: false })
  @IsOptional()
  @IsString()
  parentPhone?: string;

  @ApiProperty({ example: 'Muhammadaliyev Bahodir', required: false })
  @IsOptional()
  @IsString()
  parentName?: string;

  @ApiProperty({ example: 'Toshkent, Chilonzor', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  groupId?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}