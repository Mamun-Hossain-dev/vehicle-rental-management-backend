# Vehicle Rental Management API

Production-scoped REST API for staff-managed vehicles, bookings, uploads, and monthly revenue reports.

## Tech stack

Node.js 20+, TypeScript, Express 5, PostgreSQL 14+, Knex, Joi, JWT, bcryptjs, Multer.

## Features

- Staff login and JWT-protected business routes
- Vehicle CRUD, pagination/filter/search, local photos, soft deletion
- Rental filtering, inclusive pricing, overlap prevention, cancellation
- SQL monthly report with clipped rental days and highest revenue vehicle
- Strict TypeScript, centralized validation/errors, migrations and seed fixtures

## Structure

```text
src/
  config/          environment and database
  middleware/      auth, validation, uploads, errors
  modules/         auth, vehicles, rentals, reports
  utils/           small shared helpers
database/
  migrations/      complete schema
  seeds/           development fixtures
```

Flow: route -> middleware -> controller -> service -> repository -> Knex/PostgreSQL.

## Setup

```bash
npm install
cp .env.example .env
createdb vehicle_rental
npm run migrate
npm run seed
npm run dev
```

Production:

```bash
npm run build
npm start
```

Configure all database, pool, JWT, port, and upload values in `.env`. `JWT_SECRET` must be at least 32 characters. Upload directory is created automatically.

Development seed login: `admin@example.com` / `password123`. Never use it in production.

## Endpoints

All endpoints except login and health require `Authorization: Bearer <token>`.

| Method | Path                                                                            | Purpose                                            |
| ------ | ------------------------------------------------------------------------------- | -------------------------------------------------- |
| GET    | `/health`                                                                       | Health check                                       |
| POST   | `/auth/login`                                                                   | Staff login                                        |
| GET    | `/vehicles?page=1&limit=10&category=SUV&search=Toyota`                          | List vehicles                                      |
| GET    | `/vehicles/:id`                                                                 | Vehicle detail                                     |
| POST   | `/vehicles`                                                                     | Create using multipart fields and optional `photo` |
| PUT    | `/vehicles/:id`                                                                 | Update fields/photo                                |
| DELETE | `/vehicles/:id`                                                                 | Soft delete                                        |
| GET    | `/rentals?vehicle_id=1&status=booked&start_date=2026-08-01&end_date=2026-08-31` | Filter rentals                                     |
| GET    | `/rentals/:id`                                                                  | Rental detail                                      |
| POST   | `/rentals`                                                                      | Create rental; amount calculated server-side       |
| PUT    | `/rentals/:id`                                                                  | Update and recalculate rental                      |
| DELETE | `/rentals/:id`                                                                  | Cancel rental                                      |
| GET    | `/reports/rentals?month=2026-08&vehicle_id=1`                                   | Monthly report; vehicle filter optional            |

Login body:

```json
{ "email": "admin@example.com", "password": "password123" }
```

Rental create body:

```json
{
  "vehicle_id": 1,
  "customer_name": "John Doe",
  "customer_phone": "01700000000",
  "start_date": "2026-08-10",
  "end_date": "2026-08-12"
}
```

Responses use `{ "success": true, "data": ... }`. Errors use `{ "success": false, "message": "..." }`.

## Business rules

Rental dates are inclusive. Same-day rental is one day. Client cannot set `total_amount`. Money multiplication uses integer cents before PostgreSQL stores `numeric(12,2)`.

Overlap is checked with Knex query-builder:

```sql
vehicle_id = ?
AND status != 'cancelled'
AND start_date <= new_end
AND end_date >= new_start
```

Update excludes its own ID. Create/update runs in a transaction and locks involved vehicle rows with `FOR UPDATE`, serializing availability checks for the same vehicle. This closes the check-then-insert race between API requests. Every non-cancelled status blocks overlap, including completed rentals. Cancelled rentals remain as history.

The report uses a Knex subquery to select non-cancelled rentals overlapping the requested month. The service clips each range to the month and calculates inclusive days with decimal-safe money helpers. July 29–August 3 contributes three August days and `9000.00` at `3000.00/day`. Active vehicles with no matching rental appear with zeros. Highest revenue uses monthly clipped revenue; ties use lowest vehicle ID. Soft-deleted vehicles are omitted, while their rentals remain because vehicle deletion uses `ON DELETE RESTRICT` and application soft deletion.

Photo types: JPEG, PNG, WebP. Maximum 5 MB. New photo replacement removes the old local file after a successful database update. Files are served from `/uploads/vehicles/<filename>`.

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
npm run format
npm run format:check
npm run migrate
npm run migrate:rollback
npm run seed
```
