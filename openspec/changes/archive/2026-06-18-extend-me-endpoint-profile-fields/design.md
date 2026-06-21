## Context

`GET /me` currently returns `{ id, email, createdAt }` from `ProfileController.show`. The `users` table has a `full_name` column (`fullName` in Lucid) but it is not exposed via the endpoint. There is no `last_login_at` column; login time must be captured and persisted on each successful `POST /login`.

## Goals / Non-Goals

**Goals:**
- Add `last_login_at` nullable timestamp to the `users` table
- Record the timestamp on every successful login via `AccessTokensController.store`
- Expose `lastLoginAt` and `displayName` (alias of `fullName`) in `GET /me`

**Non-Goals:**
- Track login history (only the most recent timestamp is stored)
- Expose `displayName` in signup/login responses
- Add `displayName` as a settable field via this change

## Decisions

### 1. Store `last_login_at` on the `users` row (not in `auth_access_tokens`)

`auth_access_tokens.last_used_at` tracks token usage, not login events. A dedicated column on `users` gives a clean, stable query surface and matches what other systems call "last login".

Alternatives considered:
- Query `auth_access_tokens` for max `created_at` per user — extra join, slower, fragile if tokens are deleted.

### 2. Set `lastLoginAt` synchronously in `AccessTokensController.store`

After `User.accessTokens.create(user)` succeeds, call `user.merge({ lastLoginAt: DateTime.now() }).save()`. Simple, no background queue needed at this scale.

Alternatives considered:
- After-login hook / event — adds indirection for no gain.

### 3. Expose `fullName` as `displayName` in the serialized response

The field is already `fullName` on the model; rename only at the serialization layer (explicit key in `ProfileController.show` return value). No DB rename required.

## Risks / Trade-offs

- **Clock skew**: `DateTime.now()` on the app server. Acceptable — this is display-only data.
- **SQLite timestamp precision**: Lucid/better-sqlite3 stores `DateTime` as ISO string; no sub-second precision issues for this use case.
- **Migration on existing rows**: `last_login_at` will be `null` for all existing users until their next login. Clients must handle `null`.

## Migration Plan

1. Generate migration: `node ace make:migration add_last_login_at_to_users`
2. Add `table.timestamp('last_login_at').nullable()` in `up()`, drop it in `down()`
3. Run `node ace migration:run`
4. Regenerate `database/schema.ts` (or add `lastLoginAt` column manually)
5. Update `AccessTokensController.store` to write the timestamp
6. Update `ProfileController.show` to return both new fields
7. Update `openspec/specs/auth/spec.md` (archived via this change's delta spec)

Rollback: run `node ace migration:rollback`; revert controller changes.

## Open Questions

_None._
