## MODIFIED Requirements

### Requirement: Return current user
The system MUST return the authenticated user data including display name and last login timestamp.

#### Scenario: GET /me with valid token
- GIVEN a request with header Authorization: Bearer <validToken>
- WHEN GET /me
- THEN response status is 200
- AND body is { id, email, createdAt, displayName, lastLoginAt }
- AND displayName is the user's full name or null if not set
- AND lastLoginAt is an ISO timestamp of the last successful login or null if the user has never logged in after this change

## ADDED Requirements

### Requirement: Record login timestamp on successful login
The system MUST update the user's last login timestamp on each successful authentication.

#### Scenario: Successful login updates lastLoginAt
- GIVEN a user exists with valid credentials
- WHEN POST /login with matching credentials
- THEN response status is 200
- AND the user's lastLoginAt is updated to the current server time
