## 1. Database Migration

- [ ] 1.1 Generate migration: `node ace make:migration add_birthday_to_users`
- [ ] 1.2 Add `table.date('birthday').nullable()` in `up()` and `table.dropColumn('birthday')` in `down()`
- [ ] 1.3 Run `node ace migration:run` to apply the migration

## 2. Validator Update

- [ ] 2.1 In `backend/app/validators/user.ts`, add optional `birthday` field to `signupValidator` (VineJS `vine.date({ formats: ['YYYY-MM-DD'] }).optional().nullable()` or equivalent string date)

## 3. Backend Logic

- [ ] 3.1 In `NewAccountController.store`, extract `birthday` from validated payload and pass it to `User.create({ email, password, birthday })`
- [ ] 3.2 In `ProfileController.show`, add `birthday: user.birthday` to the returned object

## 4. Verification

- [ ] 4.1 POST /signup with `birthday` field and confirm value stored in DB row
- [ ] 4.2 POST /signup without `birthday` and confirm DB row has `null`
- [ ] 4.3 GET /me and confirm response body includes `birthday` (ISO date string or null)
