import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable('rentals', (table) => {
    table.increments('id').primary();
    table
      .integer('vehicle_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('vehicles')
      .onDelete('RESTRICT');
    table.string('customer_name', 120).notNullable();
    table.string('customer_phone', 30).notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.decimal('total_amount', 12, 2).notNullable();
    table.string('status', 20).notNullable().defaultTo('booked');
    table.timestamps(true, true);
    table.index('vehicle_id');
    table.index('status');
    table.index('start_date');
    table.index('end_date');
  });
  await knex.raw(
    "ALTER TABLE rentals ADD CONSTRAINT rentals_status_check CHECK (status IN ('booked', 'ongoing', 'completed', 'cancelled'))",
  );
  await knex.raw(
    'ALTER TABLE rentals ADD CONSTRAINT rentals_dates_check CHECK (start_date <= end_date)',
  );
};

export const down = (knex: Knex): Promise<void> =>
  knex.schema.dropTable('rentals');
