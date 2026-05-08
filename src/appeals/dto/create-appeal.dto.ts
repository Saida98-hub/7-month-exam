import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateAppealDto {
  @ApiProperty({ example: 'Muhammadaliyev Ibrohim' })
  @IsString()
  fullName: string | undefined;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  phone: string | undefined;

  @ApiProperty({ example: 'Matematika', required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ example: 'Guruhga yozilmoqchiman' })
  @IsString()
  message: string | undefined;
}