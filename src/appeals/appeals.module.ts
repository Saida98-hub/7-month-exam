import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppealsService } from './appeals.service';
import { AppealsController } from './appeals.controller';
import { Appeal } from './appeal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appeal])],
  controllers: [AppealsController],
  providers: [AppealsService],
  exports: [AppealsService],
})
export class AppealsModule {}