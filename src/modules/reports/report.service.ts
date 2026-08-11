import { ReportRepository } from './report.repository.js';
import type { ReportQuery, VehicleReport } from './report.types.js';

export class ReportService {
  constructor(private readonly repository = new ReportRepository()) {}

  async monthly(query: ReportQuery): Promise<{
    vehicles: VehicleReport[];
    highest_revenue_vehicle: VehicleReport | null;
  }> {
    const vehicles = await this.repository.monthly(
      query.month,
      query.vehicle_id,
    );
    const highest = [...vehicles].sort(
      (a, b) => Number(b.revenue) - Number(a.revenue) || a.id - b.id,
    )[0];
    return {
      vehicles,
      highest_revenue_vehicle:
        highest && Number(highest.revenue) > 0 ? highest : null,
    };
  }
}
