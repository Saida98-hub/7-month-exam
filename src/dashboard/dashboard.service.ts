import { Injectable } from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { GroupsService } from '../groups/groups.service';
import { PaymentsService } from '../payments/payments.service';
import { AppealsService } from '../appeals/appeals.service';

@Injectable()
export class DashboardService {
  constructor(
    private studentsService: StudentsService,
    private groupsService: GroupsService,
    private paymentsService: PaymentsService,
    private appealsService: AppealsService,
  ) {}

  async getStats() {
    const [
      totalStudents,
      totalGroups,
      leftThisMonth,
      totalThisMonthPayment,
      todayAppeals,
    ] = await Promise.all([
      this.studentsService.countAll(),
      this.groupsService.countAll(),
      this.studentsService.countLeft(),
      this.paymentsService.getTotalThisMonth(),
      this.appealsService.countToday(),
    ]);

    return {
      totalStudents,
      totalGroups,
      leftThisMonth,
      totalThisMonthPayment,
      todayAppeals,
    };
  }

  async getMonthlyPayments() {
 const months: { month: string; monthName: string; total: number; count: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('uz-UZ', { month: 'long' });

      const result = await this.paymentsService.findAll({ month });
      months.push({
        month,
        monthName,
        total: result.sum,
        count: result.total,
      });
    }

    return months;
  }
}