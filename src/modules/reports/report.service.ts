import { inclusiveDays } from '../../utils/date.js';
import { addMoney, compareMoney, multiplyMoney } from '../../utils/money.js';
import { ReportRepository } from './report.repository.js';
import type { ReportQuery, VehicleReport } from './report.types.js';

export class ReportService {
  constructor(private readonly repository = new ReportRepository()) {}

  async monthly(query: ReportQuery): Promise<{
    vehicles: VehicleReport[];
    highest_revenue_vehicle: VehicleReport | null;
  }> {
    const year = Number(query.month.slice(0, 4));
    const month = Number(query.month.slice(5));
    const monthStart = `${query.month}-01`;
    const monthEnd = `${query.month}-${new Date(Date.UTC(year, month, 0)).getUTCDate()}`;
    const rows = await this.repository.monthly(
      monthStart,
      monthEnd,
      query.vehicle_id,
    );
    const reports = new Map<number, VehicleReport>();
    for (const row of rows) {
      const report = reports.get(row.id) ?? {
        id: row.id,
        name: row.name,
        total_bookings: 0,
        days_rented: 0,
        revenue: '0.00',
      };
      if (row.rental_id && row.start_date && row.end_date) {
        const days = inclusiveDays(
          row.start_date > monthStart ? row.start_date : monthStart,
          row.end_date < monthEnd ? row.end_date : monthEnd,
        );
        report.total_bookings += 1;
        report.days_rented += days;
        report.revenue = addMoney(
          report.revenue,
          multiplyMoney(row.daily_rate, days),
        );
      }
      reports.set(row.id, report);
    }
    const vehicles = [...reports.values()];
    const highest = [...vehicles].sort(
      (a, b) => compareMoney(b.revenue, a.revenue) || a.id - b.id,
    )[0];
    return {
      vehicles,
      highest_revenue_vehicle:
        highest && compareMoney(highest.revenue, '0.00') > 0 ? highest : null,
    };
  }
}
