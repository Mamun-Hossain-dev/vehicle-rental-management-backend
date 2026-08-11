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
- `src/modules/*`: route -> controller -> service -> repository.
- `database/migrations`: PostgreSQL schema.
- `database/seeds`: development fixtures.

## Non-negotiable rules

- Strict TypeScript. Never use `any`.
- PostgreSQL + Knex only. Raw parameterized SQL for overlap/report calculations.
- Controllers: HTTP only. Services: business rules. Repositories: database only.
- Vehicle deletes are soft deletes. Rental deletes set `status = cancelled`.
- Rental dates are inclusive date-only strings. Do not round-trip them through JS `Date`.
- `total_amount` is server-calculated with decimal-safe string/BigInt helpers.
- Active overlap statuses: `booked`, `ongoing`, `completed`. `cancelled` never blocks.
- Create/update rentals inside a transaction with a per-vehicle advisory lock.
- Protected route groups: `/vehicles`, `/rentals`, `/reports`.
- Do not expose database errors or secrets.

## Fast verification

```bash
npm run build
npm run lint
npm run format:check
```

Database-backed verification needs PostgreSQL and `.env`:

```bash
npm run migrate
npm run seed
```

## Change checklist

- Update Joi schema when input shape changes.
- Keep `.env.example`, README endpoint docs, and scripts accurate.
- Check create and update overlap paths together.
- Check monthly report clips rentals with `GREATEST`/`LEAST`.
- No TODO, placeholder, dead abstraction, or unrequested dependency.
