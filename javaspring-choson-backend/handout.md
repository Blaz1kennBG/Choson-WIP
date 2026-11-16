> **Session Continuation Handout** — Created to resume this project. Read this first when starting a new session.

# Project: javaspring-choson

Spring Boot 4.0.6 application (`SweetApplication`) — a backend service with JPA, PostgreSQL, JWT auth, and a Client CRUD API.

---

## Project Structure

```
src/main/java/com/choson/sweet/
├── domain/
│   ├── clients/
│   │   ├── Client.java              — JPA entity (clients table)
│   │   ├── ClientController.java    — REST controller (/api/clients)
│   │   ├── ClientRepository.java    — Spring Data JPA repository
│   │   ├── ClientRequest.java       — Empty file, unused
│   │   ├── ClientService.java       — Service interface
│   │   ├── ClientServiceImpl.java   — Service implementation
│   │   └── dto/
│   │       ├── ClientCreateRequest.java
│   │       ├── ClientDeleteResponse.java
│   │       ├── ClientResponse.java
│   │       └── ClientUpdateRequest.java
│   └── user/
│       ├── AuthService.java
│       ├── AuthServiceImpl.java     — register, login, refresh, saveRefreshToken
│       ├── User.java                — JPA entity (USERS table)
│       ├── UserController.java
│       ├── UserRepository.java
│       └── dto/
│           ├── LoginRequest.java
│           ├── LoginResponse.java
│           ├── LoginTokens.java
│           ├── RefreshTokenRequest.java
│           ├── RegisterRequest.java
│           └── UserResponse.java
└── shared/
    ├── ApiResponse.java
    ├── AuthFilter.java               — JWT auth filter (cookie-based)
    ├── GlobalExceptionHandler.java
    └── JwtUtil.java                  — JWT generation & validation
```

---

## Key Decisions Made

### 1. `ClientRepository` cleaned up

- Removed `patchClientById`, `createClient`, `getAllClients`, `deleteClientById` (all were unused and couldn't be derived by Spring Data JPA)
- Removed `findByClientId` (no `clientId` field on entity — field is named `id`)
- Kept `findByName` and `existsByName` only

### 2. `creatorId` field added to `Client`

- Type: `UUID` — a plain column, not a JPA relationship
- No `@JoinColumn` annotation (it's not a `@ManyToOne`)
- Represents the `User` who created this client, stored as their UUID

### 3. `ClientResponse` refactored

- Constructor now takes `Client client` and maps via `BeanUtils.copyProperties(client, this)`
- Fields: `id`, `name`, `email`, `address`, `phone`, `createdAt`, `creatorId`

### 4. Auth enforced for `/api/clients`

- Removed `/api/clients` and `/api/clients/` from `PUBLIC_PATHS` in `AuthFilter`
- `POST /api/clients/` now requires a valid JWT `access_token` cookie
- `AuthFilter` extracts `userId` from JWT and sets `req.setAttribute("userId", userId)`

### 5. `createClient` requires auth

- `ClientController.createClient` injects `HttpServletRequest`, extracts `(UUID) servletRequest.getAttribute("userId")`
- Passes `userId` as `creatorId` to `ClientService.createClient(request, UUID creatorId)`
- `ClientServiceImpl.createClient` assigns `client.creatorId = creatorId`

### 6. `ClientCreateRequest` — simple DTO (no validation)

- Fields: `name`, `email`, `address`, `phone` (all public)
- Currently no validation annotations (`@NotBlank`, `@Email`, etc.)
- Works with `@RequestBody` — Spring deserializes JSON automatically

---

## Issue: `BeanUtils.copyProperties` not working

**Problem:** `BeanUtils.copyProperties(client, this)` in `ClientResponse` silently copies nothing because `ClientResponse` has **public fields without getters/setters**. `BeanUtils` requires setters on the target.

**Current workaround:** Not yet resolved. Options discussed:

| Option                             | Description                                        |
| ---------------------------------- | -------------------------------------------------- |
| ✅ Manual constructor              | Explicitly assign each field — simplest, zero deps |
| ✅ Add `@Data` to `ClientResponse` | Adds setters, makes `BeanUtils` work               |
| ⬜ Add getters/setters manually    | Works but verbose                                  |

**Preferred direction:** Not yet chosen — needs user decision.

---

## Known Issues

- `build.gradle` has duplicate jjwt dependencies (lines 27-29 and 31-33) — should clean up
- `ClientRequest.java` exists but is completely empty — unused
- `spring.jpa.open-in-view` warning shown on boot — cosmetic

---
