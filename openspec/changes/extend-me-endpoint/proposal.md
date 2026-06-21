## Why

The `/me` endpoint returns minimal user data (`id`, `email`, `createdAt`), but clients need `displayName` for UI personalization and `lastLoginAt` for security dashboards. Both fields belong in the user profile response.

## What Changes

- Add `last_login_at` column to the `users` table (new migration)
- Record `lastLoginAt` on every successful login in `AccessTokensController.store()`
- Extend `GET /me` response to include `displayName` (mapped from `fullName`) and `lastLoginAt`

## Capabilities

### New Capabilities

_(none — this extends an existing capability)_

### Modified Capabilities

- `auth`: `/me` response body gains `displayName` and `lastLoginAt` fields; login flow records timestamp on success

## Impact

- **Database**: new `last_login_at` nullable timestamp column on `users` table; migration required
- **API**: `GET /me` response shape expands (additive, non-breaking for existing consumers)
- **Controllers**: `profile_controller.ts`, `access_tokens_controller.ts`
- **Schema**: `database/schema.ts` regenerated after migration
