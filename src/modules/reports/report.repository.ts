import type { Knex } from 'knex';
import { db } from '../../config/database.js';
import type { VehicleReport } from './report.types.js';

export class ReportRepository {
  constructor(private readonly database: Knex = db) {}

  async monthly(month: string, vehicleId?: number): Promise<VehicleReport[]> {
    const result = await this.database.raw<{ rows: VehicleReport[] }>(
      `WITH bounds AS (
         SELECT ?::date AS month_start, (?::date + INTERVAL '1 month - 1 day')::date AS month_end
       )
       SELECT v.id, v.name,
         COUNT(r.id)::integer AS total_bookings,
         COALESCE(SUM(LEAST(r.end_date, b.month_end) - GREATEST(r.start_date, b.month_start) + 1), 0)::integer AS days_rented,
         COALESCE(SUM((LEAST(r.end_date, b.month_end) - GREATEST(r.start_date, b.month_start) + 1) * v.daily_rate), 0)::numeric(14,2)::text AS revenue
       FROM vehicles v
       CROSS JOIN bounds b
       LEFT JOIN rentals r ON r.vehicle_id = v.id
         AND r.status != 'cancelled'
         AND r.start_date <= b.month_end
         AND r.end_date >= b.month_start
       WHERE v.deleted_at IS NULL AND (?::integer IS NULL OR v.id = ?::integer)
       GROUP BY v.id, v.name
       ORDER BY v.id`,
      [`${month}-01`, `${month}-01`, vehicleId ?? null, vehicleId ?? null],
    );
    return result.rows;
  }
}
