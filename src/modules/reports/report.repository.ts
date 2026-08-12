import type { Knex } from 'knex';
import { db } from '../../config/database.js';
import type { VehicleReport } from './report.types.js';

export class ReportRepository {
  constructor(private readonly database: Knex = db) {}

  async monthly(
    monthStart: string,
    monthEnd: string,
    vehicleId?: number,
  ): Promise<VehicleReport[]> {
    const result = await this.database.raw<{ rows: VehicleReport[] }>(
      `
        WITH report_params AS (
          SELECT
            ?::date AS month_start,
            ?::date AS month_end,
            ?::integer AS vehicle_id
        )
        SELECT
          v.id,
          v.name,
          COUNT(r.id)::integer AS total_bookings,
          COALESCE(
            SUM(
              LEAST(r.end_date, p.month_end)
              - GREATEST(r.start_date, p.month_start)
              + 1
            ),
            0
          )::integer AS days_rented,
          COALESCE(
            SUM(
              (
                r.total_amount
                / (r.end_date - r.start_date + 1)
              ) * (
                LEAST(r.end_date, p.month_end)
                - GREATEST(r.start_date, p.month_start)
                + 1
              )
            ),
            0
          )::numeric(12, 2)::text AS revenue
        FROM vehicles AS v
        CROSS JOIN report_params AS p
        LEFT JOIN rentals AS r
          ON r.vehicle_id = v.id
          AND r.status <> 'cancelled'
          AND r.start_date <= p.month_end
          AND r.end_date >= p.month_start
        WHERE v.deleted_at IS NULL
          AND (p.vehicle_id IS NULL OR v.id = p.vehicle_id)
        GROUP BY v.id, v.name
        ORDER BY v.id
      `,
      [monthStart, monthEnd, vehicleId ?? null],
    );

    return result.rows;
  }
}
