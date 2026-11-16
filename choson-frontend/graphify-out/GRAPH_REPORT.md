# Graph Report - choson-frontend  (2026-07-03)

## Corpus Check
- 33 files · ~12,395 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 160 nodes · 360 edges · 15 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
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
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]

## God Nodes (most connected - your core abstractions)
1. `useToast()` - 23 edges
2. `compilerOptions` - 17 edges
3. `apiGet()` - 16 edges
4. `apiPost()` - 13 edges
5. `apiPut()` - 11 edges
6. `apiDelete()` - 9 edges
7. `useAuth()` - 9 edges
8. `apiFetch()` - 8 edges
9. `Client` - 7 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `ClientForm()` --calls--> `useToast()`  [EXTRACTED]
  src/pages/ClientForm.tsx → src/context/ToastContext.tsx
- `getMe()` --calls--> `apiGet()`  [EXTRACTED]
  src/api/auth.ts → src/api/client.ts
- `downloadInvoicePdf()` --calls--> `apiUrl()`  [EXTRACTED]
  src/api/invoices.ts → src/api/client.ts
- `getInvoiceSettings()` --calls--> `apiGet()`  [EXTRACTED]
  src/api/invoiceSettings.ts → src/api/client.ts
- `getProduct()` --calls--> `apiGet()`  [EXTRACTED]
  src/api/products.ts → src/api/client.ts

## Import Cycles
- None detected.

## Communities (15 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (15): dependencies, date-fns, react, react-datepicker, react-dom, react-router-dom, name, private (+7 more)

### Community 1 - "Community 1"
Cohesion: 0.20
Nodes (14): createProduct(), deleteProduct(), getProduct(), getProducts(), updateProduct(), useToast(), ClientDetail(), Login() (+6 more)

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (9): Layout(), navItems, ProtectedRoute(), AuthProvider(), useAuth(), InvoiceDetail(), InvoiceSettings(), Register() (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.20
Nodes (15): getMe(), login(), logout(), register(), API_BASE, apiFetch(), apiPost(), apiUrl() (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.21
Nodes (19): apiDelete(), apiGet(), apiPut(), handleResponse(), deleteClient(), getClient(), getClients(), updateClient() (+11 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module, moduleDetection (+10 more)

### Community 6 - "Community 6"
Cohesion: 0.40
Nodes (5): createInvoice(), emptyItem(), InvoiceForm(), InvoiceFormData, InvoiceItemFormData

### Community 7 - "Community 7"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (14): createClient(), getInvoiceSettings(), updateInvoiceSettings(), ToastContext, ToastContextValue, ToastProvider(), ClientForm(), ApiResponse (+6 more)

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (14): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, postcss (+6 more)

## Knowledge Gaps
- **52 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useToast()` connect `Community 1` to `Community 2`, `Community 4`, `Community 13`, `Community 6`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 14` to `Community 0`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `apiGet()` connect `Community 4` to `Community 1`, `Community 3`, `Community 13`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `Community 5` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 14` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._