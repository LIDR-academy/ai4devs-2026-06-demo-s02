## MODIFIED Requirements

### Requirement: Log in users
The system MUST allow signed-up users to obtain a fresh token and MUST record the login timestamp.

#### Scenario: Successful login
- GIVEN a user exists with email and password
- WHEN POST /login with matching credentials
- THEN response status is 200
- AND body contains { user: { id, email }, accessToken }
- AND the user's lastLoginAt is updated to the current timestamp

### Requirement: Return current user
The system MUST return the authenticated user data including display name and last login time.

#### Scenario: GET /me with valid token
- GIVEN a request with header Authorization: Bearer <validToken>
- WHEN GET /me
- THEN response status is 200
- AND body contains { id, email, createdAt, displayName, lastLoginAt }

#### Scenario: GET /me before first login (lastLoginAt is null)
- GIVEN a user has never logged in after the migration
- WHEN GET /me with a valid token
- THEN response status is 200
- AND lastLoginAt is null
