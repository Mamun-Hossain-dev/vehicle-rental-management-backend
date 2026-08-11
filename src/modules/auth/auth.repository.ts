import type { Knex } from 'knex';
import { db } from '../../config/database.js';
import type { StaffPublic, StaffRecord } from './auth.types.js';

export class AuthRepository {
  constructor(private readonly database: Knex = db) {}

  findByEmail(email: string): Promise<StaffRecord | undefined> {
    return this.database<StaffRecord>('staff')
      .whereRaw('LOWER(email) = LOWER(?)', [email])
      .first();
  }

  async create(input: {
    name: string;
    email: string;
    password_hash: string;
  }): Promise<StaffPublic> {
    const [staff] = await this.database<StaffRecord>('staff')
      .insert(input)
      .returning(['id', 'email', 'name', 'created_at']);
    return staff!;
  }
}
