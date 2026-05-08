import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Muhammadaliyev Ibrohim' })
  @IsString()
  fullName: string | undefined;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  phone: string | undefined;

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
}