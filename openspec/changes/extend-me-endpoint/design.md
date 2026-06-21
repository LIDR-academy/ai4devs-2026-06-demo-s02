## Context

`GET /me` currently returns `{ id, email, createdAt }`. The `fullName` column already exists on the `users` table (nullable) but is never surfaced. There is no `lastLoginAt` field anywhere — the access_tokens table has `lastUsedAt` (tracks token usage, not login events). Adding both fields requires one new migration and two controller changes.

## Goals / Non-Goals

**Goals:**
- Surface `displayName` (mapped from `fullName`) in `GET /me`
- Track and surface `lastLoginAt` (timestamp of last successful credential check) in `GET /me`
- Record `lastLoginAt` on every successful `POST /login`

**Non-Goals:**
- Tracking login history (only the most recent timestamp is stored)
- Surfacing `lastLoginAt` on the login response itself
- Changing the signup flow

## Decisions

### Store `lastLoginAt` on the `users` table, not on `access_tokens`

`auth_access_tokens.lastUsedAt` tracks token usage (any authenticated request), not credential-based login events. These are different semantics. A new `last_login_at` nullable timestamp column on `users` cleanly represents "when did this user last present their password."

Alternatives considered:
- Derive from `auth_access_tokens.createdAt` (latest token) — fragile; tokens can be created by admin flows, and `createdAt` on existing tokens won't map to login time reliably.
- Use `lastUsedAt` — wrong semantic (updates on every request, not just login).

### Map `fullName` → `displayName` in the API response

`fullName` is an internal DB column name. `displayName` is the public contract name. Mapping at the serialization layer (controller) keeps the API name stable if the column is ever renamed.

### Update `lastLoginAt` synchronously inside `AccessTokensController.store()`

After `User.accessTokens.create(user)` succeeds, save `user.lastLoginAt = DateTime.now()`. Synchronous update in the same request keeps the field accurate without introducing async queues or background jobs for a simple timestamp.

## Risks / Trade-offs

- **Existing users have `lastLoginAt = null`** → Clients must handle null; `GET /me` will return `lastLoginAt: null` until next login. Acceptable since column is intentionally nullable.
- **Extra write on login** → One additional `UPDATE users SET last_login_at = ?` per login. Negligible cost for SQLite at this scale.
- **Additive API change** → Existing consumers ignore unknown fields; no versioning needed.

## Migration Plan

1. Generate and run migration: `node ace make:migration add_last_login_at_to_users`
2. Add `table.timestamp('last_login_at').nullable()` in `up()`, drop column in `down()`
3. Run `node ace migration:run` — regenerates `database/schema.ts` automatically
4. Deploy controllers changes (no ordering constraint vs migration since column is nullable)

Rollback: `node ace migration:rollback` drops the column; revert controller changes.
