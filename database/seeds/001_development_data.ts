import type { Knex } from 'knex';
import { env } from '../../src/config/env.js';
import { hashPassword } from '../../src/utils/password.js';

export const seed = async (knex: Knex): Promise<void> => {
  if (env.NODE_ENV === 'production') {
    throw new Error('Development seed is disabled in production');
  }

  await knex('rentals').del();
  await knex('vehicles').del();
  await knex('staff').del();

  await knex('staff').insert({
    name: 'Development Staff',
    email: 'staff@example.com',
    password_hash: await hashPassword('password123'),
  });
  const vehicles = await knex('vehicles')
    .insert([
      {
        name: 'Toyota Axio',
        plate_number: 'DHAKA-11-1001',
        category: 'Sedan',
        daily_rate: '3000.00',
      },
      {
        name: 'Toyota Prado',
        plate_number: 'DHAKA-11-1002',
        category: 'SUV',
        daily_rate: '6500.00',
      },
      {
        name: 'Honda Vezel',
        plate_number: 'DHAKA-11-1003',
        category: 'SUV',
        daily_rate: '4500.00',
      },
    ])
    .returning(['id', 'name']);
  const byName = Object.fromEntries(
    vehicles.map((vehicle: { id: number; name: string }) => [
      vehicle.name,
      vehicle.id,
    ]),
  );
  await knex('rentals').insert([
    {
      vehicle_id: byName['Toyota Axio'],
      customer_name: 'John Doe',
      customer_phone: '01700000000',
      start_date: '2026-07-29',
      end_date: '2026-08-03',
      total_amount: '18000.00',
      status: 'completed',
    },
    {
      vehicle_id: byName['Toyota Prado'],
      customer_name: 'Jane Doe',
      customer_phone: '01800000000',
      start_date: '2026-08-10',
      end_date: '2026-08-12',
      total_amount: '19500.00',
      status: 'booked',
    },
    {
      vehicle_id: byName['Toyota Prado'],
      customer_name: 'Cancelled Customer',
      customer_phone: '01900000000',
      start_date: '2026-08-11',
      end_date: '2026-08-15',
      total_amount: '32500.00',
      status: 'cancelled',
    },
    {
      vehicle_id: byName['Honda Vezel'],
      customer_name: 'Same Day Customer',
      customer_phone: '01600000000',
      start_date: '2026-08-20',
      end_date: '2026-08-20',
      total_amount: '4500.00',
      status: 'ongoing',
    },
  ]);
};
