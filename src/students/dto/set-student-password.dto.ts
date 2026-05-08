import { IsString, MinLength } from 'class-validator';

export class SetStudentPasswordDto {
  @IsString()
    @MinLength(4)
    password!: string;
}