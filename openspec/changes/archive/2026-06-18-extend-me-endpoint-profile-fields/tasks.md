## 1. Database Migration

- [x] 1.1 Generate migration: `node ace make:migration add_last_login_at_to_users`
- [x] 1.2 Add `table.timestamp('last_login_at').nullable()` in `up()` and `table.dropColumn('last_login_at')` in `down()`
- [x] 1.3 Run `node ace migration:run` to apply the migration

## 2. Schema Update

- [x] 2.1 Add `lastLoginAt` column declaration to `UserSchema` in `backend/database/schema.ts` (`@column.dateTime()` nullable)

## 3. Backend Logic

- [x] 3.1 In `AccessTokensController.store`, after token creation set `user.lastLoginAt = DateTime.now()` and `await user.save()`
- [x] 3.2 In `ProfileController.show`, add `lastLoginAt: user.lastLoginAt` and `displayName: user.fullName` to the returned object

## 4. Verification

- [x] 4.1 POST /login and confirm `last_login_at` is written to the DB row
- [x] 4.2 GET /me and confirm response body includes `lastLoginAt` (ISO string or null) and `displayName` (string or null)
- [x] 4.3 GET /me for a user who has never logged in (if possible) confirms `lastLoginAt` is null
