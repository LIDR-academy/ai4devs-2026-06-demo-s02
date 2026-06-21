## 1. Database Migration

- [x] 1.1 Generate migration: `node ace make:migration add_last_login_at_to_users`
- [x] 1.2 Add `table.timestamp('last_login_at').nullable()` in `up()` and `table.dropColumn('last_login_at')` in `down()`
- [x] 1.3 Run `node ace migration:run` and verify `database/schema.ts` now includes `lastLoginAt` on `UserSchema`

## 2. Record lastLoginAt on Login

- [x] 2.1 In `backend/app/controllers/access_tokens_controller.ts`, after `User.accessTokens.create(user)`, add `user.lastLoginAt = DateTime.now()` and `await user.save()`
- [x] 2.2 Import `DateTime` from `luxon` if not already imported

## 3. Extend /me Response

- [x] 3.1 In `backend/app/controllers/profile_controller.ts`, update the return value to include `displayName: user.fullName` and `lastLoginAt: user.lastLoginAt`
