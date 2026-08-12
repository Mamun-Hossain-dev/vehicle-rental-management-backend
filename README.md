# Vehicle Rental Management API

Production-scoped REST API for staff-managed vehicles, bookings, uploads, and monthly revenue reports.

## Tech stack

Node.js 20+, TypeScript, Express 5, PostgreSQL 14+, Knex, Joi, JWT, bcryptjs, Multer.

## Features

- Staff login and JWT-protected business routes
- Staff login and failed-login rate limiting
- Vehicle CRUD, pagination/filter/search, local photos, soft deletion
- Rental filtering, inclusive pricing, overlap prevention, cancellation
- SQL monthly report with clipped rental days and highest revenue vehicle
- Strict TypeScript, centralized validation/errors, migrations and seed fixtures
- Interactive OpenAPI/Swagger documentation

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
pnpm install
cp .env.example .env
createdb -h localhost -U postgres vehicle_rental
pnpm migrate
pnpm seed
pnpm dev
```

Production:

```bash
pnpm build
pnpm start
```

Configure all database, pool, JWT, port, and upload values in `.env`. `JWT_SECRET` must be at least 32 characters. Upload directory is created automatically.

| Variable         | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `NODE_ENV`       | `development`, `test`, or `production`    |
| `PORT`           | HTTP server port                          |
| `DB_HOST`        | PostgreSQL host                           |
| `DB_PORT`        | PostgreSQL port                           |
| `DB_NAME`        | PostgreSQL database name                  |
| `DB_USER`        | PostgreSQL user                           |
| `DB_PASSWORD`    | PostgreSQL password                       |
| `DB_POOL_MIN`    | Minimum Knex pool connections             |
| `DB_POOL_MAX`    | Maximum Knex pool connections             |
| `JWT_SECRET`     | JWT signing secret, minimum 32 characters |
| `JWT_EXPIRES_IN` | Token lifetime, for example `1d`          |
| `UPLOAD_PATH`    | Local vehicle-photo directory             |

API base URL: `http://localhost:3000/api/v1`

Swagger UI: `http://localhost:3000/api/v1/docs`

OpenAPI JSON: `http://localhost:3000/api/v1/docs/openapi.json`

Run `pnpm seed` after the migrations to load development fixtures. The seed
deletes all rows from `rentals`, `vehicles`, and `staff` before inserting its
known dataset, so do not run it against production or a database containing
data you need. The seed refuses to run when `NODE_ENV=production`. It includes
a July 29–August 3 rental for testing month-boundary report clipping.

Development seed login: `staff@example.com` / `password123`. Never use it in production.

## Endpoints

Vehicle, rental, and report endpoints require an authenticated staff JWT using
`Authorization: Bearer <access_token>`. Authentication and an explicit staff
role guard protect each route group. Customers are rental records, not API
accounts. Health, documentation, and login are public.

| Method | Path                                                                                   | Purpose                                            |
| ------ | -------------------------------------------------------------------------------------- | -------------------------------------------------- |
| GET    | `/api/v1/health`                                                                       | Health check                                       |
| GET    | `/api/v1/docs`                                                                         | Swagger UI                                         |
| GET    | `/api/v1/docs/openapi.json`                                                            | OpenAPI document                                   |
| POST   | `/api/v1/auth/login`                                                                   | Staff login                                        |
| GET    | `/api/v1/vehicles?page=1&limit=10&category=SUV&search=Toyota`                          | List vehicles                                      |
| GET    | `/api/v1/vehicles/:id`                                                                 | Vehicle detail                                     |
| POST   | `/api/v1/vehicles`                                                                     | Create using multipart fields and optional `photo` |
| PUT    | `/api/v1/vehicles/:id`                                                                 | Update fields/photo                                |
| DELETE | `/api/v1/vehicles/:id`                                                                 | Soft delete                                        |
| GET    | `/api/v1/rentals?vehicle_id=1&status=booked&start_date=2026-08-01&end_date=2026-08-31` | Filter rentals                                     |
| GET    | `/api/v1/rentals/:id`                                                                  | Rental detail                                      |
| POST   | `/api/v1/rentals`                                                                      | Create rental; amount calculated server-side       |
| PUT    | `/api/v1/rentals/:id`                                                                  | Update and recalculate rental                      |
| DELETE | `/api/v1/rentals/:id`                                                                  | Cancel rental                                      |
| GET    | `/api/v1/reports/rentals?month=2026-08&vehicle_id=1`                                   | Monthly report; vehicle filter optional            |

Login body:

```json
{ "email": "staff@example.com", "password": "password123" }
```

Login returns `data.access_token` and `data.staff` with the authenticated
staff member's `id`, `name`, `email`, `role`, and `created_at`.

Login allows five failed attempts per IP in 15 minutes. Successful logins do not consume the limit.

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

Overlap is checked with parameterized raw SQL:

```sql
SELECT EXISTS (
  SELECT 1
  FROM rentals
  WHERE vehicle_id = ?
    AND status <> 'cancelled'
    AND start_date <= ?::date -- requested end
    AND end_date >= ?::date   -- requested start
    AND (?::integer IS NULL OR id <> ?::integer)
);
```

Update excludes its own ID. Create/update runs in a transaction and locks involved vehicle rows with `FOR UPDATE`, serializing availability checks for the same vehicle. This closes the check-then-insert race between API requests. Every non-cancelled status blocks overlap, including completed rentals. Cancelled rentals remain as history.

The report is aggregated in parameterized raw SQL. `GREATEST(start_date,
month_start)` and `LEAST(end_date, month_end)` clip every rental to the requested
month; adding one makes the range inclusive. July 29–August 3 therefore
contributes three August days and `9000.00` at `3000.00/day`. A `LEFT JOIN`
keeps active vehicles with no matching rentals in the output with zero totals.
Cancelled rentals and soft-deleted vehicles are omitted. Highest-revenue ties
use the lowest vehicle ID.

Photo types: JPEG, PNG, WebP. Maximum 5 MB. New photo replacement removes the old local file after a successful database update. Files are served from `/api/v1/uploads/vehicles/<filename>`.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm format
pnpm format:check
pnpm migrate
pnpm migrate:rollback
pnpm seed
```
