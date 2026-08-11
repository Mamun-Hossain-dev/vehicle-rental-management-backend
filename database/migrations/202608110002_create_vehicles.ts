import type { Knex } from 'knex';

export const up = (knex: Knex): Promise<void> =>
  knex.schema.createTable('vehicles', (table) => {
    table.increments('id').primary();
    table.string('name', 120).notNullable();
    table.string('plate_number', 30).notNullable().unique();
    table.string('category', 50).notNullable().index();
    table.decimal('daily_rate', 12, 2).notNullable();
    table.string('photo_path', 500);
    table.timestamp('deleted_at', { useTz: true }).index();
    table.timestamps(true, true);
  });

export const down = (knex: Knex): Promise<void> =>
  knex.schema.dropTable('vehicles');
