# Sweet App — Frontend Documentation

> **Purpose:** Complete guide for building a frontend client for the Sweet App backend.  
> **Backend:** Spring Boot 4.0.6 + PostgreSQL + JWT Auth  
> **Base URL:** `http://localhost:8080`

---

## Table of Contents

1. [Auth Overview (Cookie-Based JWT)](#1-auth-overview-cookie-based-jwt)
2. [Auth Endpoints](#2-auth-endpoints)
3. [Client CRUD Endpoints](#3-client-crud-endpoints)
4. [JSON Response Wrapper](#4-json-response-wrapper)
5. [Entity Models](#5-entity-models)
6. [Request/Response DTOs](#6-requestresponse-dtos)
7. [Error Handling](#7-error-handling)
8. [CORS + SameSite Issues](#8-cors--samesite-issues)
9. [Full API Reference Table](#9-full-api-reference-table)
10. [Frontend Implementation Tips](#10-frontend-implementation-tips)
11. [Open Issues / Cleanup Needed](#11-open-issues--cleanup-needed)

---

## 1. Auth Overview (Cookie-Based JWT)

The backend uses **HttpOnly cookies** for authentication — **not** `Authorization` headers.

### Cookie details

| Cookie | Path | Max-Age | HttpOnly | SameSite | Purpose |
|--------|------|---------|----------|----------|---------|
| `access_token` | `/` | 15 min (900s) | Yes | Strict | Auth for all API calls |
| `refresh_token` | `/api/auth/refresh` | 7 days (604800s) | Yes | Strict | Get new tokens |

### Auth flow

```
1. Register         → No cookies. Just creates user.
2. Login            → Server sets both cookies via Set-Cookie headers.
3. Navigate app     → Browser sends access_token with every request.
4. access_token     → 401 on any API call.
   expires            POST /api/auth/refresh (sends refresh_token cookie)
                      → Server sets new access_token + refresh_token.
5. refresh_token    → User must login again.
   expires
6. Logout           → Server clears both cookies (max-age=0).
```

> `access_token` is sent on every request to `localhost:8080` (path `/`).  
> `refresh_token` is only sent on requests to `localhost:8080/api/auth/refresh` (path-restricted).

### ⚠️ Frontend requirements

- **Credentials must be included** on all requests:  
  `fetch(url, { credentials: 'include' })` or  
  `axios.get(url, { withCredentials: true })`
- **Neither cookie is readable by JavaScript** (HttpOnly flag)
- **To check if logged in:** call `GET /api/clients` — 401 = not authenticated

---

## 2. Auth Endpoints

### `POST /api/auth/register`

Creates a new user.

**Request body:**
```json
{ "name": "john", "email": "john@example.com", "password": "secret123" }
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "data": { "id": "uuid", "name": "john", "email": "john@example.com" }
}
```

**Errors:** `400` — "Name already in use"

---

### `POST /api/auth/login`

Authenticates and sets HttpOnly cookies via `Set-Cookie` headers.

**Request body:**
```json
{ "name": "john", "password": "secret123" }
```

**Response (200):**
```json
{
  "message": "Login successful",
  "data": { "id": "uuid", "name": "john", "email": "john@example.com" }
}
```

**Side effects:** Sets `access_token` (15 min) and `refresh_token` (7 days) cookies.

**Errors:** `400` — "User not found" or "Invalid password"

---

### `GET /api/auth/me` — Get current user

Requires authentication. Returns the user data for the currently logged-in user.

**Request body:** None

**Response (200):**
```json
{
  "message": "Current user",
  "data": { "id": "uuid", "name": "john", "email": "john@example.com" }
}
```

**Errors:** `401` if not authenticated, `400` — "User not found"

---

### `POST /api/auth/refresh`

Exchanges a valid refresh token for new tokens.  
**Does not** need `access_token`, but needs the `refresh_token` cookie (sent automatically by browser for this path).

**Request body:** None

**Response (200):**
```json
{ "message": "Token refreshed", "data": null }
```

**Side effects:** New `access_token` and `refresh_token` cookies set.

**Errors:** `400` — "No refresh token provided" or "Invalid or expired refresh token"

---

### `POST /api/auth/logout`

Clears both auth cookies.

**Request body:** None

**Response (200):**
```json
{ "message": "Logged out", "data": null }
```

**Side effects:** Both cookies deleted (max-age=0).

---

## 3. Client CRUD Endpoints

All client endpoints **require authentication** (valid `access_token` cookie).

### `POST /api/clients` — Create

**Validation:** `email` uses `@Email` annotation + `@Valid` on controller. Name validated in service (≥3 chars, not empty).

**Request body:**
```json
{
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "address": "123 Main St",
  "phone": "555-0123"
}
```

**Response (201):**
```json
{
  "message": "Client created successfully",
  "data": {
    "id": "uuid",
    "name": "Acme Corp",
    "email": "contact@acme.com",
    "address": "123 Main St",
    "phone": "555-0123",
    "createdAt": "2026-06-21T14:22:59.056",
    "creatorId": "uuid-of-authenticated-user"
  }
}
```

**Errors:** `400` for validation failures, `401` if not authenticated.

---

### `GET /api/clients` — List my clients

Returns only clients where `creatorId` matches the authenticated user.

**Response (200):**
```json
{
  "message": "Clients retrieved successfully",
  "data": [ /* ClientResponse[] */ ]
}
```

**Errors:** `401` if not authenticated.

---

### `GET /api/clients/{id}` — Get by ID

**Response (200):** Single `ClientResponse` object.

**Errors:** `400` — "Client not found", `401` if not authenticated.

---

### `PUT /api/clients/{id}` — Update

> ⚠️ **Not mapped in controller yet.** The service layer implements it; the controller needs a `@PutMapping` to expose it.

**Request body:** Same as create.

**Validation:** Same as create.

---

### `DELETE /api/clients/{id}` — Delete

> ⚠️ **Not mapped in controller yet.**

**Response (200):** `{ "message": "Client deleted successfully", "data": null }`

---

## 4. JSON Response Wrapper

**Successful responses** use this format:

```json
{
  "message": "Human-readable message",
  "data": { }          // object | array | null
}
```

`data` is:
- An **object** for single resources
- An **array** for collections
- `null` for side-effect-only operations (logout, delete, refresh)

---

## 5. Entity Models

### Client (table: `clients`)

```json
{
  "id": "UUID (auto-generated)",
  "name": "String",
  "email": "String",
  "address": "String",
  "phone": "String",
  "createdAt": "String (ISO 8601, e.g. 2026-06-21T14:22:59.056)",
  "creatorId": "UUID (user ID who created this)"
}
```

### User (table: `USERS`)

```json
{
  "id": "UUID (auto-generated)",
  "name": "String",
  "email": "String"
}
```

User entity has additional fields (`hashedPassword`, `token`) that are **never** returned in API responses.

---

## 6. Request/Response DTOs

### RegisterRequest
| Field | Type | Required |
|-------|------|----------|
| name | string | yes |
| email | string | yes |
| password | string | yes |

### LoginRequest
| Field | Type | Required |
|-------|------|----------|
| name | string | yes |
| password | string | yes |

### ClientCreateRequest / ClientUpdateRequest
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | yes | Service-layer: not empty, ≥3 chars |
| email | string | yes | Annotation: `@Email` (valid format) |
| address | string | no | — |
| phone | string | no | — |

### UserResponse
| Field | Type |
|-------|------|
| id | UUID |
| name | string |
| email | string |

### ClientResponse
| Field | Type |
|-------|------|
| id | UUID |
| name | string |
| email | string |
| address | string |
| phone | string |
| createdAt | string (ISO 8601) |
| creatorId | UUID |

---

## 7. Error Handling

There are **two different error response formats** — be prepared for both:

### Format A — GlobalExceptionHandler (most errors)

Catches `RuntimeException` thrown by services.

**HTTP 400**
```json
{ "message": "Client name cannot be empty", "data": null }
```

All service-layer errors (not found, validation, name conflicts) use this format.

### Format B — AuthFilter (unauthenticated)

**HTTP 401**
```json
{ "message": "Unauthorized" }
```
No `data` field, no `ApiResponse` wrapper — it's a raw string written directly to the response.

### Format C — Spring's default validation errors (`@Valid`)

**HTTP 400**
```json
{
  "timestamp": "2026-06-21T14:22:59.056+00:00",
  "status": 400,
  "error": "Bad Request",
  "path": "/api/clients",
  "errors": [
    {
      "field": "email",
      "defaultMessage": "must be a well-formed email address",
      "rejectedValue": "invalid-email",
      "code": "Email"
    }
  ],
  "message": "Validation failed for object='clientCreateRequest'. Error count: 1"
}
```

This comes from Spring's default handling of `MethodArgumentNotValidException` — the `GlobalExceptionHandler` does **not** catch it. When you send an invalid email, you get this format, **not** the `ApiResponse` wrapper.

**To fix this in the backend:** Add a handler in `GlobalExceptionHandler`:
```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException e) {
    String msg = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();
    return ResponseEntity.badRequest().body(new ApiResponse<>(msg, null));
}
```

**Until that's fixed**, your frontend should handle both error shapes:

```js
async function handleError(res) {
  const body = await res.json();
  // Format A: { message, data }
  // Format C: { timestamp, status, errors: [{ defaultMessage, ... }] }
  const msg = body.message || body.errors?.[0]?.defaultMessage || 'Unknown error';
  return msg;
}
```

---

## 8. CORS + SameSite Issues

The cookies use `SameSite=Strict` (hardcoded in `UserController`).  
If your frontend runs on a different origin than `localhost:8080`:

### Problem

`SameSite=Strict` means cookies are **never** sent on cross-origin requests — even with `credentials: 'include'`.  
Result: every API call returns 401, and refresh also fails.

### Solutions

**Option A — Proxy (recommended for dev):**

In your Vite config (`vite.config.js`):
```js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

Then in your app, use **relative URLs** (`/api/clients`) instead of absolute ones.  
The browser thinks it's same-origin → cookies work with `SameSite=Strict`.

**Option B — Backend CORS config + `SameSite=None`:**

1. Add CORS config in the backend (see below).
2. Change `SameSite=Strict` → `SameSite=None` and `cookie.setSecure(true)`.

**Backend CORS config (add to backend):**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
            .allowCredentials(true);
    }
}
```

**Option C — If you control the backend, remove `SameSite` from cookies** (not recommended for prod but fine for dev).

---

## 9. Full API Reference Table

| Method | Path | Auth? | Request Body | Response `data` | Notes |
|--------|------|-------|-------------|-----------------|-------|
| POST | `/api/auth/register` | No | RegisterRequest | UserResponse | — |
| POST | `/api/auth/login` | No | LoginRequest | UserResponse | Sets cookies |
| GET | `/api/auth/me` | Yes | — | UserResponse | Get current user |
| POST | `/api/auth/refresh` | No | — | null | Needs `refresh_token` cookie |
| POST | `/api/auth/logout` | No | — | null | Clears cookies |
| POST | `/api/clients` | Yes | ClientCreateRequest | ClientResponse | `creatorId` set from JWT |
| GET | `/api/clients` | Yes | — | ClientResponse[] | Filtered by `creatorId` |
| GET | `/api/clients/{id}` | Yes | — | ClientResponse | — |
| PUT | `/api/clients/{id}` | Yes | ClientUpdateRequest | ClientResponse | — |
| DELETE | `/api/clients/{id}` | Yes | — | null | — |
| GET | `/hello` | No | — | plain text "Hello World!" | Health check |

---

## 10. Frontend Implementation Tips

### HTTP client setup

```js
// Native fetch
const BASE = 'http://localhost:8080';
const res = await fetch(`${BASE}/api/clients`, { credentials: 'include' });

// Axios
const api = axios.create({ baseURL: BASE, withCredentials: true });
```

### Auto-refresh on 401

```js
let isRefreshing = false;

async function apiFetch(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, { ...options, credentials: 'include' });
  if (res.status !== 401) return res;

  if (!isRefreshing) {
    isRefreshing = true;
    const refreshRes = await fetch(`${BASE}/api/auth/refresh`, {
      method: 'POST', credentials: 'include'
    });
    isRefreshing = false;

    if (refreshRes.ok) {
      return fetch(`${BASE}${url}`, { ...options, credentials: 'include' });
    }
    // Refresh failed → redirect to login
    window.location.href = '/login';
  }
  return res;
}
```

### Knowing the current user

- `POST /api/auth/login` returns `UserResponse` in the response body.
- `GET /api/auth/me` returns the current user at any time (requires valid `access_token` cookie).
- Store it after login or call `/me` on page load to restore session.

### UUID handling

All IDs are UUID strings. Most JSON parsers handle them as plain strings. Example:
```json
{ "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890" }
```

### Build & run the backend

```bash
./gradlew bootRun
```

**Requirements:**
- Java 25+
- PostgreSQL on `localhost:5432`, database `postgres`, user `postgres`, password `root`
- Tables created automatically by Hibernate (`ddl-auto: update`)

---

## 11. Open Issues / Cleanup Needed

| # | Issue | Impact |
|---|-------|--------|
| 1 | `@Valid` errors return Spring's default format, not `ApiResponse` | Frontend must handle 2 error shapes |
| 2 | `SameSite=Strict` on cookies breaks cross-origin frontends | Must use proxy or change to `SameSite=None` |
| 3 | ~~PUT/DELETE client endpoints not mapped~~ | ✅ Resolved — both mapped in controller |
| 4 | Duplicate jjwt dependencies in `build.gradle` | No runtime impact, just messy |
| 5 | Misplaced `spring.devtools.jwt` block in `application.yml` | No impact (ignored by Spring) |
| 6 | `ClientRequest.java` — empty unused file | Cleanup |
| 7 | `ClientDeleteResponse.java` — empty unused file | Cleanup |
| 8 | `LoginResponse.java` — exists but never used | Cleanup |
| 9 | Flyway dependency included but not configured | No migrations run |
