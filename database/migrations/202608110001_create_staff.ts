import type { Knex } from 'knex';

export const up = (knex: Knex): Promise<void> =>
  knex.schema.createTable('staff', (table) => {
    table.increments('id').primary();
    table.string('email', 254).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('name', 100).notNullable();
    table.timestamps(true, true);
  });

export const down = (knex: Knex): Promise<void> =>
  knex.schema.dropTable('staff');
