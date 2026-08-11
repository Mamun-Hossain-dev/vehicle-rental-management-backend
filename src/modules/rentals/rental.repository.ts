import type { Knex } from 'knex';
import { db } from '../../config/database.js';
import type { Rental, RentalFilters } from './rental.types.js';

export class RentalRepository {
  constructor(private readonly database: Knex = db) {}

  findAll(filters: RentalFilters): Promise<Rental[]> {
    const query = this.database<Rental>('rentals')
      .select('*')
      .orderBy('start_date', 'desc')
      .orderBy('id', 'desc');
    if (filters.vehicle_id) query.where('vehicle_id', filters.vehicle_id);
    if (filters.status) query.where('status', filters.status);
    if (filters.start_date) query.where('end_date', '>=', filters.start_date);
    if (filters.end_date) query.where('start_date', '<=', filters.end_date);
    return query;
  }

  findById(
    id: number,
    executor: Knex | Knex.Transaction = this.database,
  ): Promise<Rental | undefined> {
    return executor<Rental>('rentals').where({ id }).first();
  }

  async lockVehicle(
    executor: Knex.Transaction,
    vehicleId: number,
  ): Promise<void> {
    await executor.raw('SELECT pg_advisory_xact_lock(?)', [vehicleId]);
  }

  async hasOverlap(
    executor: Knex.Transaction,
    vehicleId: number,
    start: string,
    end: string,
    excludeId?: number,
  ): Promise<boolean> {
    const result = await executor.raw<{ rows: Array<{ exists: boolean }> }>(
      `SELECT EXISTS (
         SELECT 1 FROM rentals
         WHERE vehicle_id = ?
           AND status != 'cancelled'
           AND start_date <= ?::date
           AND end_date >= ?::date
           AND (?::integer IS NULL OR id != ?::integer)
       ) AS exists`,
      [vehicleId, end, start, excludeId ?? null, excludeId ?? null],
    );
    return result.rows[0]?.exists ?? false;
  }

  async create(
    executor: Knex.Transaction,
    input: Omit<Rental, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Rental> {
    const [rental] = await executor<Rental>('rentals')
      .insert(input)
      .returning('*');
    return rental!;
  }

  async update(
    executor: Knex.Transaction,
    id: number,
    input: Partial<Rental>,
  ): Promise<Rental> {
    const [rental] = await executor<Rental>('rentals')
      .where({ id })
      .update({ ...input, updated_at: executor.fn.now() })
      .returning('*');
    return rental!;
  }

  async cancel(id: number): Promise<Rental | undefined> {
    const [rental] = await this.database<Rental>('rentals')
      .where({ id })
      .update({ status: 'cancelled', updated_at: this.database.fn.now() })
      .returning('*');
    return rental;
  }
}
