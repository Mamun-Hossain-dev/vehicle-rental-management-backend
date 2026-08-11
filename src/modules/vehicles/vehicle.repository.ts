import type { Knex } from 'knex';
import { db } from '../../config/database.js';
import type {
  Vehicle,
  VehicleFilters,
  VehicleInput,
  VehicleUpdate,
} from './vehicle.types.js';

export class VehicleRepository {
  constructor(private readonly database: Knex = db) {}

  private filtered(
    filters: VehicleFilters,
  ): Knex.QueryBuilder<Vehicle, Vehicle[]> {
    const query = this.database<Vehicle>('vehicles').whereNull('deleted_at');
    if (filters.category) query.where('category', filters.category);
    if (filters.search) query.whereILike('name', `%${filters.search}%`);
    return query;
  }

  async findAll(
    filters: VehicleFilters,
  ): Promise<{ rows: Vehicle[]; total: number }> {
    const [rows, count] = await Promise.all([
      this.filtered(filters)
        .select('*')
        .orderBy('id')
        .limit(filters.limit)
        .offset((filters.page - 1) * filters.limit),
      this.filtered(filters).count<{ count: string }>('* as count').first(),
    ]);
    return { rows, total: Number(count?.count ?? 0) };
  }

  findById(
    id: number,
    executor: Knex | Knex.Transaction = this.database,
  ): Promise<Vehicle | undefined> {
    return executor<Vehicle>('vehicles')
      .where({ id })
      .whereNull('deleted_at')
      .first();
  }

  async create(
    input: VehicleInput & { photo_path: string | null },
  ): Promise<Vehicle> {
    const [vehicle] = await this.database<Vehicle>('vehicles')
      .insert(input)
      .returning('*');
    return vehicle!;
  }

  async update(id: number, input: VehicleUpdate): Promise<Vehicle | undefined> {
    const [vehicle] = await this.database<Vehicle>('vehicles')
      .where({ id })
      .whereNull('deleted_at')
      .update({ ...input, updated_at: this.database.fn.now() })
      .returning('*');
    return vehicle;
  }

  async softDelete(id: number): Promise<boolean> {
    return (
      (await this.database<Vehicle>('vehicles')
        .where({ id })
        .whereNull('deleted_at')
        .update({
          deleted_at: this.database.fn.now(),
          updated_at: this.database.fn.now(),
        })) > 0
    );
  }
}
