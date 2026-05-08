
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '+998000000000' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ example: 'superadmin5555' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string | undefined;
}