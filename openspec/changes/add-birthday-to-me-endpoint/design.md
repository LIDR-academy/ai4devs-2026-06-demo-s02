## Context

`GET /me` currently returns `{ id, email, createdAt, displayName, lastLoginAt }`. The `users` table has no `birthday` column. Signup (`POST /signup`) accepts only `email` and `password` via `signupValidator`. Birthday must be stored as a date (no time component) and exposed as an ISO date string (`YYYY-MM-DD`).

## Goals / Non-Goals

**Goals:**
- Add `birthday` nullable date column to the `users` table
- Accept `birthday` as an optional field at signup
- Expose `birthday` (ISO date string or null) in `GET /me`

**Non-Goals:**
- Birthday update endpoint (not in scope)
- Age validation or age-gating logic
- Expose `birthday` in the login response

## Decisions

### 1. Store `birthday` as a date-only column on `users`

Lucid's `@column.date()` maps to SQLite's `TEXT` storing `YYYY-MM-DD`. No timezone ambiguity since there is no time component.

Alternatives considered:
- Store as `timestamp` — unnecessary precision, introduces TZ complexity.

### 2. Accept `birthday` as optional at signup only (not via a separate PATCH endpoint)

Keeps scope minimal. Users who don't provide it get `null`; they can't update it later via this change.

Alternatives considered:
- Dedicated PATCH /me — valid future work, out of scope here.

### 3. Serialize as ISO string (`YYYY-MM-DD`) directly from Lucid `@column.date()`

Lucid serializes `@column.date()` as a `DateTime` object; configure `serialize` to output `toISODate()` so the response is a plain string, not a full ISO timestamp.

## Risks / Trade-offs

- **Existing users**: `birthday` is null for all existing users. Clients must handle null.
- **SQLite type**: stored as TEXT — no enforcement of valid dates beyond VineJS validation at the API layer.

## Migration Plan

1. Generate migration: `node ace make:migration add_birthday_to_users`
2. Add `table.date('birthday').nullable()` in `up()`, `table.dropColumn('birthday')` in `down()`
3. Run `node ace migration:run` (auto-regenerates `schema.ts`)
4. Update `signupValidator` to accept optional `birthday` (ISO date string)
5. Update `NewAccountController.store` to pass `birthday` to `User.create`
6. Update `ProfileController.show` to return `birthday`
7. Rollback: `node ace migration:rollback`, revert controller/validator changes

## Open Questions

_None._
