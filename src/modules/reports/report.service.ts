import { compareMoney } from '../../utils/money.js';
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
    const highest = [...rows].sort(
      (a, b) => compareMoney(b.revenue, a.revenue) || a.id - b.id,
    )[0];
    return {
      vehicles: rows,
      highest_revenue_vehicle:
        highest && compareMoney(highest.revenue, '0.00') > 0 ? highest : null,
    };
  }
}
