## MODIFIED Requirements

### Requirement: Sign up new users
The system MUST allow users to create accounts with email, password, and optional birthday.

#### Scenario: Successful signup without birthday
- GIVEN no user exists with the given email
- WHEN POST /signup with valid email and password (>= 8 chars), no birthday
- THEN response status is 201
- AND body contains { user: { id, email }, accessToken }
- AND the user's birthday is null

#### Scenario: Successful signup with birthday
- GIVEN no user exists with the given email
- WHEN POST /signup with valid email, password (>= 8 chars), and birthday (ISO date string YYYY-MM-DD)
- THEN response status is 201
- AND body contains { user: { id, email }, accessToken }
- AND the user's birthday is stored as provided

### Requirement: Return current user
The system MUST return the authenticated user data including display name, last login timestamp, and birthday.

#### Scenario: GET /me with valid token
- GIVEN a request with header Authorization: Bearer <validToken>
- WHEN GET /me
- THEN response status is 200
- AND body is { id, email, createdAt, displayName, lastLoginAt, birthday }
- AND displayName is the user's full name or null if not set
- AND lastLoginAt is an ISO timestamp of the last successful login or null if the user has never logged in after this change
- AND birthday is an ISO date string (YYYY-MM-DD) or null if not provided at signup
