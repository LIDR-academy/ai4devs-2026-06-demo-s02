# Capability: auth

## Purpose
Sistema de autenticación con tokens opacos para una API.
Permite signup, login, logout y consulta del usuario actual.

## Requirements

### Requirement: Sign up new users
The system MUST allow users to create accounts with email and password.

#### Scenario: Successful signup
- GIVEN no user exists with the given email
- WHEN POST /signup with valid email and password (>= 8 chars)
- THEN response status is 201
- AND body contains { user: { id, email }, accessToken }

### Requirement: Log in users
The system MUST allow signed-up users to obtain a fresh token.

#### Scenario: Successful login
- GIVEN a user exists with email and password
- WHEN POST /login with matching credentials
- THEN response status is 200
- AND body contains { user: { id, email }, accessToken }

### Requirement: Return current user
The system MUST return the authenticated user data.

#### Scenario: GET /me with valid token
- GIVEN a request with header Authorization: Bearer <validToken>
- WHEN GET /me
- THEN response status is 200
- AND body is { id, email, createdAt }