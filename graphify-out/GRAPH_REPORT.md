# Graph Report - choson-project  (2026-07-03)

## Corpus Check
- 96 files · ~19,037 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 637 nodes · 1212 edges · 62 communities (36 shown, 26 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]

## God Nodes (most connected - your core abstractions)
1. `useToast()` - 23 edges
2. `RuntimeException` - 21 edges
3. `compilerOptions` - 17 edges
4. `apiGet()` - 16 edges
5. `apiPost()` - 13 edges
6. `apiPut()` - 11 edges
7. `InvoiceServiceImpl` - 11 edges
8. `PdfGenerationService` - 11 edges
9. `AuthServiceImpl` - 10 edges
10. `UserController` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ClientServiceImpl` --implements--> `ClientService`  [EXTRACTED]
  javaspring-choson-backend/src/main/java/com/choson/sweet/domain/clients/ClientServiceImpl.java → javaspring-choson-backend/src/main/java/com/choson/sweet/domain/clients/ClientController.java
- `InvoiceServiceImpl` --implements--> `InvoiceService`  [EXTRACTED]
  javaspring-choson-backend/src/main/java/com/choson/sweet/domain/invoices/InvoiceServiceImpl.java → javaspring-choson-backend/src/main/java/com/choson/sweet/domain/invoices/InvoiceController.java
- `Register()` --calls--> `useAuth()`  [EXTRACTED]
  choson-frontend/src/pages/Register.tsx → choson-frontend/src/context/AuthContext.tsx
- `ClientDetail()` --calls--> `useToast()`  [EXTRACTED]
  choson-frontend/src/pages/ClientDetail.tsx → choson-frontend/src/context/ToastContext.tsx
- `ClientForm()` --calls--> `useToast()`  [EXTRACTED]
  choson-frontend/src/pages/ClientForm.tsx → choson-frontend/src/context/ToastContext.tsx

## Import Cycles
- None detected.

## Communities (62 total, 26 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (83): getMe(), login(), logout(), register(), API_BASE, apiDelete(), apiFetch(), apiGet() (+75 more)

### Community 1 - "Community 1"
Cohesion: 0.14
Nodes (18): ClientRepository, ClientServiceImpl, Boolean, Client, List, Optional, String, UUID (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (27): dependencies, react, react-dom, react-router-dom, devDependencies, autoprefixer, eslint, @eslint/js (+19 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (16): Boolean, JwtUtil, LoginRequest, LoginTokens, Override, RegisterRequest, String, UserResponse (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.21
Nodes (14): HttpServletResponse, ApiResponse, AuthService, GetMapping, HttpServletRequest, JwtUtil, LoginRequest, PostMapping (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.23
Nodes (9): Filter, FilterChain, HttpServletRequest, JwtUtil, Override, String, ServletRequest, ServletResponse (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.19
Nodes (16): ClientController, ApiResponse, ClientCreateRequest, ClientResponse, ClientService, ClientUpdateRequest, DeleteMapping, GetMapping (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module, moduleDetection (+10 more)

### Community 8 - "Community 8"
Cohesion: 0.17
Nodes (8): ExceptionHandler, String, ApiResponse, ResponseEntity, Void, ApiResponse, GlobalExceptionHandler, T

### Community 9 - "Community 9"
Cohesion: 0.27
Nodes (8): ClientService, ClientCreateRequest, ClientDeleteResponse, ClientResponse, ClientUpdateRequest, Iterable, List, UUID

### Community 10 - "Community 10"
Cohesion: 0.27
Nodes (7): LoginRequest, LoginTokens, RegisterRequest, String, UserResponse, UUID, AuthService

### Community 11 - "Community 11"
Cohesion: 0.32
Nodes (5): Boolean, Optional, String, User, UserRepository

### Community 12 - "Community 12"
Cohesion: 0.47
Nodes (3): GetMapping, String, SweetApplication

### Community 13 - "Community 13"
Cohesion: 0.40
Nodes (3): LoginTokens, String, UserResponse

### Community 14 - "Community 14"
Cohesion: 0.50
Nodes (3): UserResponse, String, UUID

### Community 27 - "Community 27"
Cohesion: 0.22
Nodes (15): ApiResponse, DeleteMapping, GetMapping, HttpServletRequest, Iterable, PostMapping, ProductCreateRequest, ProductResponse (+7 more)

### Community 28 - "Community 28"
Cohesion: 0.39
Nodes (5): List, Optional, Product, UUID, ProductRepository

### Community 29 - "Community 29"
Cohesion: 0.27
Nodes (8): Iterable, List, ProductCreateRequest, ProductDeleteResponse, ProductResponse, ProductUpdateRequest, UUID, ProductService

### Community 30 - "Community 30"
Cohesion: 0.15
Nodes (15): InvoiceSettingsController, InvoiceSettingsServiceImpl, ApiResponse, GetMapping, HttpServletRequest, InvoiceSettingsResponse, InvoiceSettingsService, InvoiceSettingsUpdateRequest (+7 more)

### Community 43 - "Community 43"
Cohesion: 0.19
Nodes (16): InvoiceController, ApiResponse, DeleteMapping, GetMapping, HttpServletRequest, InvoiceCreateRequest, InvoiceResponse, InvoiceService (+8 more)

### Community 44 - "Community 44"
Cohesion: 0.20
Nodes (14): InvoiceRepository, InvoiceServiceImpl, ClientRepository, InvoiceCreateRequest, InvoiceDeleteResponse, InvoiceResponse, InvoiceSettingsRepository, InvoiceUpdateRequest (+6 more)

### Community 45 - "Community 45"
Cohesion: 0.24
Nodes (8): InvoiceService, InvoiceCreateRequest, InvoiceDeleteResponse, InvoiceResponse, InvoiceUpdateRequest, Iterable, List, UUID

### Community 46 - "Community 46"
Cohesion: 0.40
Nodes (5): InvoiceRepository, Invoice, List, Optional, UUID

### Community 47 - "Community 47"
Cohesion: 0.52
Nodes (4): Bean, CorsFilter, FilterRegistrationBean, CorsConfig

### Community 55 - "Community 55"
Cohesion: 0.52
Nodes (4): InvoiceSettingsService, InvoiceSettingsResponse, InvoiceSettingsUpdateRequest, UUID

### Community 56 - "Community 56"
Cohesion: 0.47
Nodes (4): InvoiceSettingsRepository, InvoiceSettings, Optional, UUID

### Community 60 - "Community 60"
Cohesion: 0.17
Nodes (12): InvoiceItemResponse, Font, InvoiceItem, InvoiceItem, Client, Invoice, InvoiceSettings, String (+4 more)

### Community 61 - "Community 61"
Cohesion: 0.22
Nodes (10): ProductService, List, Override, ProductCreateRequest, ProductDeleteResponse, ProductRepository, ProductResponse, ProductUpdateRequest (+2 more)

## Knowledge Gaps
- **106 isolated node(s):** `$schema`, `plugin`, `name`, `private`, `version` (+101 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `RuntimeException` connect `Community 1` to `Community 3`, `Community 4`, `Community 8`, `Community 44`, `Community 60`, `Community 61`?**
  _High betweenness centrality (0.144) - this node is a cross-community bridge._
- **Why does `InvoiceServiceImpl` connect `Community 44` to `Community 43`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `ClientServiceImpl` connect `Community 1` to `Community 6`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Are the 20 inferred relationships involving `RuntimeException` (e.g. with `.createClient()` and `.deleteClient()`) actually correct?**
  _`RuntimeException` has 20 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `plugin`, `name` to the rest of the system?**
  _106 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05402650356778797 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1350806451612903 - nodes in this community are weakly interconnected._