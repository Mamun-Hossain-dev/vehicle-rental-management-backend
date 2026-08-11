import type { Knex } from 'knex';
import { db } from '../../config/database.js';
import type { Rental } from '../rentals/rental.types.js';
import type { ReportRow } from './report.types.js';

export class ReportRepository {
  constructor(private readonly database: Knex = db) {}

  monthly(
    monthStart: string,
    monthEnd: string,
    vehicleId?: number,
  ): Promise<ReportRow[]> {
    const rentals = this.database<Rental>('rentals')
      .select('id', 'vehicle_id', 'start_date', 'end_date')
      .whereNot('status', 'cancelled')
      .where('start_date', '<=', monthEnd)
      .where('end_date', '>=', monthStart);
    const query = this.database('vehicles as v')
      .leftJoin(rentals.as('r'), 'r.vehicle_id', 'v.id')
      .whereNull('v.deleted_at')
      .select<ReportRow[]>(
        'v.id',
        'v.name',
        'v.daily_rate',
        'r.id as rental_id',
        'r.start_date',
        'r.end_date',
      )
      .orderBy('v.id');
    if (vehicleId) query.where('v.id', vehicleId);
    return query;
  }
}
