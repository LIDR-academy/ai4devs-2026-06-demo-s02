## Why

The `GET /me` endpoint returns minimal user data; clients need `lastLoginAt` for security audit displays and `displayName` for personalized UI without making separate profile calls.

## What Changes

- Add `last_login_at` column to the `users` table (new migration)
- Record login timestamp on every successful `POST /login`
- Expose `lastLoginAt` and `displayName` in the `GET /me` response

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `auth`: `GET /me` response gains `lastLoginAt` (nullable timestamp) and `displayName` (nullable string mapped from `fullName`)

## Impact

- **Database**: new `last_login_at` column on `users` table; requires migration
- **Backend**: `database/schema.ts` regenerated; `AccessTokensController.store` writes the timestamp; `ProfileController.show` serializes two new fields
- **API contract**: `GET /me` response body changes — clients relying on the exact shape should update
