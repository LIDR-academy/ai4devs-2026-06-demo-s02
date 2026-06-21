## Why

Clients need the user's date of birth for age-gating and personalized features without a separate profile endpoint call. Adding `birthday` to `GET /me` keeps the profile payload self-contained.

## What Changes

- Add `birthday` column (`DATE`, nullable) to the `users` table via migration
- Accept `birthday` as an optional field at signup (`POST /signup`)
- Expose `birthday` in the `GET /me` response

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `auth`: `GET /me` response gains `birthday` (nullable ISO date string); `POST /signup` accepts optional `birthday` field

## Impact

- **Database**: new `birthday` date column on `users` table; requires migration
- **Backend**: `database/schema.ts` regenerated; `NewAccountController.store` accepts optional `birthday`; `ProfileController.show` serializes the new field
- **API contract**: `GET /me` response body changes; `POST /signup` request body gains optional field — backwards-compatible
