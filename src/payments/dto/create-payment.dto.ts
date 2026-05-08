import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { PaymentMethod } from '../payment.entity';

export class CreatePaymentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  studentId!: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  groupId!: number;

  @ApiProperty({ example: 800000 })
  @IsNumber()
  amount!: number;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  paymentDate!: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}