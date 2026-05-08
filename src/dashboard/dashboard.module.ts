import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { StudentsModule } from '../students/students.module';
import { GroupsModule } from '../groups/groups.module';
import { PaymentsModule } from '../payments/payments.module';
import { AppealsModule } from '../appeals/appeals.module';

@Module({
  imports: [
    StudentsModule,
    GroupsModule,
    PaymentsModule,
    AppealsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}