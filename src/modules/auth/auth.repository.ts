import type { Knex } from 'knex';
import { db } from '../../config/database.js';
import type { StaffRecord } from './auth.types.js';

export class AuthRepository {
  constructor(private readonly database: Knex = db) {}

  findByEmail(email: string): Promise<StaffRecord | undefined> {
    return this.database<StaffRecord>('staff')
      .whereRaw('LOWER(email) = LOWER(?)', [email])
      .first();
  }
}
