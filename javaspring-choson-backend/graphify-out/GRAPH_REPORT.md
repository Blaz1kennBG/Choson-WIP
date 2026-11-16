# Graph Report - javaspring-choson-backend  (2026-07-03)

## Corpus Check
- 62 files · ~11,025 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 553 nodes · 919 edges · 55 communities (31 shown, 24 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]

## God Nodes (most connected - your core abstractions)
1. `RuntimeException` - 21 edges
2. `Sweet App — Frontend Documentation` - 13 edges
3. `Sweet App — Project Documentation` - 12 edges
4. `InvoiceServiceImpl` - 11 edges
5. `PdfGenerationService` - 11 edges
6. `AuthServiceImpl` - 10 edges
7. `UserController` - 10 edges
8. `ClientServiceImpl` - 9 edges
9. `InvoiceService` - 9 edges
10. `ProductServiceImpl` - 9 edges

## Surprising Connections (you probably didn't know these)
- `InvoiceServiceImpl` --implements--> `InvoiceService`  [EXTRACTED]
  src/main/java/com/choson/sweet/domain/invoices/InvoiceServiceImpl.java → src/main/java/com/choson/sweet/domain/invoices/InvoiceController.java
- `ClientServiceImpl` --implements--> `ClientService`  [EXTRACTED]
  src/main/java/com/choson/sweet/domain/clients/ClientServiceImpl.java → src/main/java/com/choson/sweet/domain/clients/ClientController.java
- `InvoiceSettingsServiceImpl` --implements--> `InvoiceSettingsService`  [EXTRACTED]
  src/main/java/com/choson/sweet/domain/invoice_settings/InvoiceSettingsServiceImpl.java → src/main/java/com/choson/sweet/domain/invoice_settings/InvoiceSettingsController.java
- `ProductServiceImpl` --implements--> `ProductService`  [EXTRACTED]
  src/main/java/com/choson/sweet/domain/products/ProductServiceImpl.java → src/main/java/com/choson/sweet/domain/products/ProductController.java
- `AuthServiceImpl` --implements--> `AuthService`  [EXTRACTED]
  src/main/java/com/choson/sweet/domain/user/AuthServiceImpl.java → src/main/java/com/choson/sweet/domain/user/AuthService.java

## Import Cycles
- None detected.

## Communities (55 total, 24 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (43): 10. Frontend Implementation Tips, 11. Open Issues / Cleanup Needed, 1. Auth Overview (Cookie-Based JWT), 2. Auth Endpoints, 3. Client CRUD Endpoints, 4. JSON Response Wrapper, 5. Entity Models, 6. Request/Response DTOs (+35 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (16): JwtUtil, Boolean, JwtUtil, LoginRequest, LoginTokens, Override, RegisterRequest, String (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (28): 10. Known Issues, 1. Project Overview, 2. Package Structure, 3. Entity Models, 4. DTOs, 5. API Endpoints, 6. Authentication & Authorization, 7. Service Layer (+20 more)

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (16): InvoiceRepository, InvoiceItem, InvoiceServiceImpl, PdfGenerationService, RuntimeException, ClientRepository, InvoiceCreateRequest, InvoiceDeleteResponse (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.21
Nodes (14): HttpServletResponse, ApiResponse, AuthService, GetMapping, HttpServletRequest, JwtUtil, LoginRequest, PostMapping (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.19
Nodes (16): InvoiceController, ApiResponse, DeleteMapping, GetMapping, HttpServletRequest, InvoiceCreateRequest, InvoiceResponse, InvoiceService (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (15): ClientController, ApiResponse, ClientCreateRequest, ClientResponse, ClientUpdateRequest, DeleteMapping, GetMapping, HttpServletRequest (+7 more)

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (15): ProductController, ApiResponse, DeleteMapping, GetMapping, HttpServletRequest, Iterable, PostMapping, ProductCreateRequest (+7 more)

### Community 8 - "Community 8"
Cohesion: 0.21
Nodes (11): ClientServiceImpl, ClientService, ClientCreateRequest, ClientDeleteResponse, ClientRepository, ClientResponse, ClientUpdateRequest, InvoiceService (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (10): ProductServiceImpl, ProductService, List, Override, ProductCreateRequest, ProductDeleteResponse, ProductRepository, ProductResponse (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.24
Nodes (8): InvoiceService, InvoiceCreateRequest, InvoiceDeleteResponse, InvoiceResponse, InvoiceUpdateRequest, Iterable, List, UUID

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (8): ExceptionHandler, ApiResponse, GlobalExceptionHandler, String, ApiResponse, ResponseEntity, Void, T

### Community 12 - "Community 12"
Cohesion: 0.27
Nodes (8): ClientService, ClientCreateRequest, ClientDeleteResponse, ClientResponse, ClientUpdateRequest, Iterable, List, UUID

### Community 13 - "Community 13"
Cohesion: 0.20
Nodes (11): InvoiceItemResponse, Font, InvoiceItem, PdfPCell, PdfPTable, PostConstruct, PdfGenerationService, Client (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.27
Nodes (8): ProductService, Iterable, List, ProductCreateRequest, ProductDeleteResponse, ProductResponse, ProductUpdateRequest, UUID

### Community 15 - "Community 15"
Cohesion: 0.27
Nodes (7): ClientRepository, Boolean, Client, List, Optional, String, UUID

### Community 16 - "Community 16"
Cohesion: 0.23
Nodes (9): Filter, FilterChain, ServletRequest, ServletResponse, AuthFilter, HttpServletRequest, JwtUtil, Override (+1 more)

### Community 17 - "Community 17"
Cohesion: 0.27
Nodes (7): LoginRequest, LoginTokens, RegisterRequest, String, UserResponse, UUID, AuthService

### Community 18 - "Community 18"
Cohesion: 0.17
Nodes (11): 1. `ClientRepository` cleaned up, 2. `creatorId` field added to `Client`, 3. `ClientResponse` refactored, 4. Auth enforced for `/api/clients`, 5. `createClient` requires auth, 6. `ClientCreateRequest` — simple DTO (no validation), Issue: `BeanUtils.copyProperties` not working, Key Decisions Made (+3 more)

### Community 19 - "Community 19"
Cohesion: 0.40
Nodes (5): InvoiceRepository, Invoice, List, Optional, UUID

### Community 20 - "Community 20"
Cohesion: 0.39
Nodes (5): ProductRepository, List, Optional, Product, UUID

### Community 21 - "Community 21"
Cohesion: 0.32
Nodes (5): Boolean, Optional, String, User, UserRepository

### Community 22 - "Community 22"
Cohesion: 0.47
Nodes (3): GetMapping, String, SweetApplication

### Community 23 - "Community 23"
Cohesion: 0.52
Nodes (4): Bean, CorsFilter, FilterRegistrationBean, CorsConfig

### Community 24 - "Community 24"
Cohesion: 0.40
Nodes (3): LoginTokens, String, UserResponse

### Community 25 - "Community 25"
Cohesion: 0.50
Nodes (3): UserResponse, String, UUID

### Community 49 - "Community 49"
Cohesion: 0.15
Nodes (15): InvoiceSettingsController, InvoiceSettingsServiceImpl, ApiResponse, GetMapping, HttpServletRequest, InvoiceSettingsResponse, InvoiceSettingsService, InvoiceSettingsUpdateRequest (+7 more)

### Community 50 - "Community 50"
Cohesion: 0.52
Nodes (4): InvoiceSettingsService, InvoiceSettingsResponse, InvoiceSettingsUpdateRequest, UUID

### Community 51 - "Community 51"
Cohesion: 0.47
Nodes (4): InvoiceSettingsRepository, InvoiceSettings, Optional, UUID

## Knowledge Gaps
- **111 isolated node(s):** `Client`, `Iterable`, `Void`, `Boolean`, `ClientRequest` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `RuntimeException` connect `Community 3` to `Community 1`, `Community 4`, `Community 8`, `Community 9`, `Community 11`, `Community 13`?**
  _High betweenness centrality (0.182) - this node is a cross-community bridge._
- **Why does `InvoiceServiceImpl` connect `Community 3` to `Community 5`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Are the 20 inferred relationships involving `RuntimeException` (e.g. with `.createClient()` and `.deleteClient()`) actually correct?**
  _`RuntimeException` has 20 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Client`, `Iterable`, `Void` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1126984126984127 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._