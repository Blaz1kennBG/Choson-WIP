# Sweet App — Project Documentation

> Generated from the Graphify knowledge graph (214 nodes, 716 edges)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Package Structure](#2-package-structure)
3. [Entity Models](#3-entity-models)
4. [DTOs](#4-dtos)
5. [API Endpoints](#5-api-endpoints)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Service Layer](#7-service-layer)
8. [Error Handling](#8-error-handling)
9. [Dependency Graph](#9-dependency-graph)
10. [Known Issues](#10-known-issues)

---

## 1. Project Overview

- **Name:** Sweet App
- **Type:** Spring Boot 4.0.6 REST API
- **Database:** PostgreSQL
- **Auth:** Cookie-based JWT (HttpOnly, SameSite=Strict)
- **Entry point:** `SweetApplication.java` (L8)

**Requirements:**
- Java 25+
- PostgreSQL on `localhost:5432`, database `postgres`, user `postgres`, password `root`
- Tables created automatically by Hibernate (`ddl-auto: update`)

---

## 2. Package Structure

| Package | Nodes | Description |
|---------|-------|-------------|
| `com.choson.sweet` | 6 | Application entry + health endpoint |
| `com.choson.sweet.domain.user` | 72 | User entity, auth controller, filter, JWT utils |
| `com.choson.sweet.domain.user/dto` | 18 | Auth request/response DTOs |
| `com.choson.sweet.domain.clients` | 69 | Client entity, controller, service, repository |
| `com.choson.sweet.domain.clients/dto` | 10 | Client request/response DTOs |
| `com.choson.sweet.shared` | 38 | Shared `ApiResponse` wrapper + exception handler |

---

## 3. Entity Models

### User (`com.choson.sweet.domain.user.User`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Auto-generated |
| `name` | String | Unique |
| `email` | String | |
| `hashedPassword` | String | Never returned in API responses |
| `token` | String | Refresh token, never returned |

**Repository:** `UserRepository` — methods:
- `findByName(String name)` → `Optional<User>`
- `existsByName(String name)` → `boolean`

### Client (`com.choson.sweet.domain.clients.Client`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Auto-generated |
| `name` | String | Not empty, ≥3 chars |
| `email` | String | `@Email` validated |
| `address` | String | Optional |
| `phone` | String | Optional |
| `createdAt` | String | ISO 8601 |
| `creatorId` | UUID | User ID who created this client |

**Repository:** `ClientRepository` — methods:
- `findByCreatorId(UUID creatorId)` → `List<Client>`

---

## 4. DTOs

### Auth DTOs (`com.choson.sweet.domain.user.dto`)

| DTO | Fields | Purpose |
|-----|--------|---------|
| `RegisterRequest` | name, email, password | Registration input |
| `LoginRequest` | name, password | Login input |
| `UserResponse` | id, name, email | Auth response body |
| `LoginTokens` | accessToken, refreshToken | Internal JWT pair |
| `LoginResponse` | (unused) | Empty, slated for cleanup |

### Client DTOs (`com.choson.sweet.domain.clients.dto`)

| DTO | Fields | Purpose |
|-----|--------|---------|
| `ClientCreateRequest` | name, email, address, phone | Create input |
| `ClientUpdateRequest` | name, email, address, phone | Update input |
| `ClientResponse` | id, name, email, address, phone, createdAt, creatorId | Response body |
| `ClientRequest` | (unused/empty) | Slated for cleanup |
| `ClientDeleteResponse` | (unused/empty) | Slated for cleanup |

### Shared

| Class | Purpose |
|-------|---------|
| `ApiResponse<T>` | `{ message: String, data: T }` wrapper for all JSON responses |

---

## 5. API Endpoints

### Auth (`UserController` — `/api/auth`)

| Method | Path | Auth | Request | Response `data` | Side effects |
|--------|------|------|---------|-----------------|--------------|
| `POST` | `/api/auth/register` | No | `RegisterRequest` | `UserResponse` | Creates user |
| `POST` | `/api/auth/login` | No | `LoginRequest` | `UserResponse` | Sets `access_token` + `refresh_token` cookies |
| `POST` | `/api/auth/refresh` | No | — | null | Sets new token pair |
| `GET` | `/api/auth/me` | Yes | — | `UserResponse` | Current user from JWT |
| `POST` | `/api/auth/logout` | No | — | null | Clears cookies |

### Clients (`ClientController` — `/api/clients`)

| Method | Path | Auth | Request | Response `data` |
|--------|------|------|---------|-----------------|
| `GET` | `/api/clients` | Yes | — | `ClientResponse[]` (filtered by `creatorId`) |
| `POST` | `/api/clients` | Yes | `ClientCreateRequest` | `ClientResponse` |
| `GET` | `/api/clients/{clientId}` | Yes | — | `ClientResponse` |
| `PUT` | `/api/clients/{clientId}` | Yes | `ClientUpdateRequest` | `ClientResponse` |
| `DELETE` | `/api/clients/{clientId}` | Yes | — | null |

### Health

| Method | Path | Auth | Response |
|--------|------|------|---------|
| `GET` | `/hello` | No | Plain text "Hello World!" |

---

## 6. Authentication & Authorization

### JwtUtil (`com.choson.sweet.domain.user`)

Core JWT component handling token operations:

| Method | Purpose |
|--------|---------|
| `.generateAccessToken()` | Creates short-lived (15 min) access JWT |
| `.generateRefreshToken()` | Creates long-lived (7 day) refresh JWT |
| `.getUserIdFromToken()` | Extracts user ID from a token |
| `.validateToken()` | Checks token validity and expiry |

### AuthFilter (`com.choson.sweet.domain.user`)

`jakarta.servlet.Filter` implementation applied to all `/api/**` paths except `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`:
- Extracts `access_token` cookie from request
- Validates via `JwtUtil.getUserIdFromToken()`
- Sets `userId` attribute on request for downstream controllers
- Returns 401 with `{ "message": "Unauthorized" }` on failure

### Cookie Configuration

| Cookie | Path | Max-Age | HttpOnly | SameSite |
|--------|------|---------|----------|----------|
| `access_token` | `/` | 15 min (900s) | Yes | Strict |
| `refresh_token` | `/api/auth/refresh` | 7 days (604800s) | Yes | Strict |

### Auth Flow

```
1. Register  → No cookies
2. Login     → Server sets both cookies (Set-Cookie)
3. Requests  → Browser sends access_token with every /api/* call
4. 401       → Client calls POST /api/auth/refresh → server sets new token pair
5. Logout    → Server clears both cookies (max-age=0)
```

---

## 7. Service Layer

### AuthServiceImpl

| Method | Description |
|--------|-------------|
| `.register()` | Validates name uniqueness, hashes password (BCrypt), saves user |
| `.login()` | Finds by name, checks password, generates token pair, saves refresh token |
| `.refresh()` | Validates refresh cookie, generates new token pair |
| `.logout()` | Clears refresh token in DB |
| `.me()` | Returns user from userId attribute |

Dependencies: `UserRepository`, `JwtUtil`, `PasswordEncoder`

### ClientServiceImpl

| Method | Description |
|--------|-------------|
| `.createClient()` | Validates name (not empty, ≥3 chars), saves with `creatorId` |
| `.getClientById()` | Finds by ID, throws "Client not found" |
| `.getAllByCreatorId()` | Returns all clients owned by the authenticated user |
| `.updateClient()` | Finds by ID, updates fields, re-validates name, saves |
| `.deleteClient()` | Finds by ID, deletes |

Dependencies: `ClientRepository`

---

## 8. Error Handling

### GlobalExceptionHandler (`com.choson.sweet.shared`)

Catches `RuntimeException` → returns HTTP 400:

```json
{ "message": "Error description", "data": null }
```

Common error messages:
- "Client name cannot be empty"
- "Client name must be at least 3 characters long"
- "Client not found"
- "Name already in use"
- "User not found"
- "Invalid password"

### AuthFilter (unauthenticated)

Returns HTTP 401:

```json
{ "message": "Unauthorized" }
```

No `data` field, no `ApiResponse` wrapper — raw JSON string.

---

## 9. Dependency Graph

Extracted from Graphify AST analysis:

**47 classes/interfaces** across 25 source files, connected by **716 edges**:

| Edge type | Count | Description |
|-----------|-------|-------------|
| `imports` | 376 | Package imports |
| `references` | 182 | Type/method references |
| `method` | 71 | Method definitions |
| `calls` | 59 | Method invocations |
| `contains` | 25 | Class/file containment |
| `implements` | 3 | Interface implementations |

**Key dependency chains:**

```
ClientController
  → ClientService (interface, injected)
    → ClientServiceImpl
      → ClientRepository (interface, injected)
        → Client (entity)

UserController
  → AuthService (interface, injected)
    → AuthServiceImpl
      → UserRepository
      → JwtUtil
      → PasswordEncoder

AuthFilter
  → JwtUtil
  → UserRepository
```

---

## 10. Known Issues

| # | Issue | Impact |
|---|-------|--------|
| 1 | `@Valid` errors return Spring's default validation format instead of `ApiResponse` | Frontend must handle 2 error shapes |
| 2 | `SameSite=Strict` on cookies breaks cross-origin frontends | Must use Vite proxy or change to `SameSite=None` |
| 3 | Duplicate jjwt dependencies in `build.gradle` | No runtime impact |
| 4 | Misplaced `spring.devtools.jwt` block in `application.yml` | Ignored by Spring |
| 5 | `ClientRequest.java` — empty unused file | Cleanup |
| 6 | `ClientDeleteResponse.java` — empty unused file | Cleanup |
| 7 | `LoginResponse.java` — exists but never used | Cleanup |
| 8 | Flyway dependency included but not configured | No migrations run |

---

*Generated from `graphify-out/graph.json` — 214 nodes, 716 edges, 25 source files.*
