# Vehicle Rental API Agent Guide

## CAVEMAN — less output token

Drop filler, articles, pleasantries, hedging.
Keep code blocks and technical terms exact.
Short sentences. Fragments OK.
No "I'd be happy to help." No "The reason this is happening is because."

## PONYTAIL — less code written

Before writing any code, check in order:

1. Does this need to exist? → no: skip it (YAGNI)
2. Stdlib does it? → use it
3. Native platform feature? → use it
4. Already installed dependency? → use it
5. One line? → one line
6. Only then: minimum that works

No new dependencies unless unavoidable.
No unrequested abstractions or boilerplate.
Deletion over addition.

## Project map

- `src/app.ts`: Express composition, static uploads, routes, error middleware.
- `src/config`: validated environment and Knex singleton.
- `src/middleware`: auth, validation, upload, errors.
- `src/docs/openapi.ts`: OpenAPI source for Swagger UI and JSON.
- `src/modules/*`: route -> controller -> service -> repository.
- `database/migrations`: PostgreSQL schema.
- `database/seeds`: development fixtures.

## Non-negotiable rules

- Strict TypeScript. Never use `any`.
- PostgreSQL + Knex. Use parameterized raw SQL for complex overlap/report
  queries; use Knex query-builder for ordinary CRUD.
- Controllers: HTTP only. Services: business rules. Repositories: database only.
- Vehicle deletes are soft deletes. Rental deletes set `status = cancelled`.
- Rental dates are inclusive date-only strings. Do not round-trip them through JS `Date`.
- `total_amount` is server-calculated with decimal-safe string/BigInt helpers.
- Active overlap statuses: `booked`, `ongoing`, `completed`. `cancelled` never blocks.
- Create/update rentals inside a transaction with a vehicle row `FOR UPDATE` lock.
- API base path: `/api/v1`.
- Protected route groups: `/api/v1/vehicles`, `/api/v1/rentals`, `/api/v1/reports`.
- Public auth route: `/api/v1/auth/login`; login rate limit is 5 failures per 15 minutes.
- Do not expose database errors or secrets.

## Fast verification

```bash
pnpm build
pnpm lint
pnpm format:check
```

Database-backed verification needs PostgreSQL and `.env`:

```bash
pnpm migrate
pnpm seed
```

## Change checklist

- Update Joi schemas when input shape changes.
- Keep `.env.example`, README endpoint docs, and scripts accurate.
- Keep OpenAPI paths and schemas aligned with routes and Joi validation.
- Check create and update overlap paths together.
- Check monthly report clips each rental to requested month boundaries.
- No TODO, placeholder, dead abstraction, or unrequested dependency.
