import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsPhoneNumber, MinLength } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'Boltabekova Saida' })
  @IsString()
  fullName: string | undefined;

  @ApiProperty({ example: '+998977827398' })
  @IsString()
  phone: string | undefined;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string | undefined;

  @ApiProperty({ enum: UserRole, example: UserRole.WORKER })
  @IsEnum(UserRole)
  role: UserRole | undefined;
}