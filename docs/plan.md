**🏗️ Modified Project: Aether Studio (Zero-Cost Multi-Tenant Edition \- Edge-Optimized)**  
**🛠️ The Refined Tech Stack**

* **Framework: Next.js (App Router) hosted on Vercel—deployed exclusively to serve the authenticated builder dashboard and configuration UI (**studio.aether.studio**).**  
* **Public Routing Engine: Cloudflare Workers capturing wildcard subdomains at the edge, utilizing the native Cloudflare Cache API (**caches.default**) to serve pages from edge memory, and streaming static HTML directly from storage only on cache misses. This ensures zero Vercel serverless execution and protects R2 limits.**  
* **Data Structures: Rose Tree (nested UI canvas state) & Hash Map (static tokenized layout component mappings).**  
* **Relational Database Layer: Turso (Edge SQLite) or Neon (Serverless Postgres) running on permanent free tiers to manage tenant account metadata, user access controls, subscription flags, and custom domain mappings.**  
* **Hot Storage: Browser** localStorage **for local auto-saves (debounced at 100ms), synchronized instantly across open windows via the native browser** BroadcastChannel **API to prevent cross-tab state overwrites without database operations.**  
* **Draft Remote Backup: Vercel KV (Redis) managing user session drafts via a 15-second interaction debounce, immediate window lifecycle flushes (**visibilitychange **\+** beforeunload **beacon triggers), and state reconciliation using defensive timestamp conflict resolution.**  
* **Cold Storage: Cloudflare R2 (Object Storage) hosting finalized, compiled portfolio HTML text payloads and media assets ($0.00 egress).**  
* **Traffic Shield Layer: Cloudflare CDN (Proxied DNS) caching live subdomains globally. Fully restricted to core wildcard subdomains (**\*.aether.studio**) and upgraded via Cloudflare for SaaS (Custom Hostnames free tier up to 100 entries, offset by premium pricing tiers beyond 100).**  
* **Security Layer: Backend HTML Sanitizer (**isomorphic-dompurify**) stripping arbitrary script injections on compilation \+ Cloudflare Turnstile token validation injected into form components.**  
* **Observability Layer: Sentry integrated into the Next.js frontend/backend for exception tracking, paired with edge log streaming via Cloudflare Workers to Axiom/Better Stack using** ctx.waitUntil() **to capture runtime telemetry.**  
* **Interactivity Engine: Self-contained Native Web Components (Custom Elements) managed by a lightweight, modular global script (**runtime-engine.js**), isolating interactive behaviors directly within individual elements.**  
* **Design System: Token-restricted Atomic Components. Tailwind-based utility blocks compiled once during development to a static, lightweight (\~50KB)** aether-core.min.css **file hosted on a permanent CDN link. Arbitrary user layout overrides are translated by a token-to-inline transformer and injected directly as inline HTML style attributes. Large media drops bypass** localStorage **entirely via direct-to-R2 pre-signed uploads.**

**📋 Phase-by-Phase Roadmap**

### **Phase 1: The Visual Builder Core, Security, & Relational Schema**

* **Task 1.1: Secure the storage environment variables. Configure the Next.js builder backend to read Cloudflare R2 Access Keys, Bucket configurations, and the Relational Database (Turso/Neon) connection strings.**  
* **Task 1.2: Establish the core multi-tenant schema in the relational database to safely track user records, subscription flags, and subdomain assignments.**  
* **Task 1.3: Build the Component Registry (Hash Map). Map design-token visual blocks to deterministic HTML components. Design the registry compiler to append arbitrary user choices directly as inline HTML style attributes. Inject a permanent** \<link\> **tag pointing to the centralized** aether-core.min.css **sheet in the document head.**  
* **Task 1.4: Implement the Drag-and-Drop canvas using an immutable Rose Tree to handle nested layout states within the Next.js dashboard workspace.**  
* **Task 1.5: Build a secure pre-signed URL generator in Next.js. When a user drops an image onto the canvas, the client uploads the raw asset directly to Cloudflare R2, returning a static URL string to insert into the Rose Tree. This completely prevents base64 strings from bloating browser** localStorage**.**  
* **Task 1.6: Build the compilation engine to serialize the visual tree into a standalone static HTML string buffer, rendering interactive layout structures into standard Native Web Component blocks (e.g.,** \<aether-modal\>**). Route the buffer through** isomorphic-dompurify **on the backend, stripping user-submitted scripts while preserving declarative element attributes.**

### **Phase 2: Local-First State Persistence & The Defensive Sync Preview**

* **Task 2.1: Configure the client-side canvas to write all state mutations to the browser’s** localStorage **using a 100ms debounce to preserve main-thread performance, automatically incrementing a sequential version timestamp. Instantiate a native browser** BroadcastChannel **instance to broadcast updates across all open browser tabs in real time.**  
* **Task 2.2: Create a "Sync Draft" Server Action. Trigger a remote update to Vercel KV (**user:\[id\]:draft**) containing the Rose Tree JSON payload and its version timestamp when the user pauses interactions for 15 consecutive seconds, or instantly via both** visibilitychange **and** beforeunload **listeners.**  
* **Task 2.3: Implement Defensive State Reconciliation upon dashboard initialization. Compare version numbers between** localStorage **and Vercel KV. If** KV\_timestamp \> localStorage\_timestamp**, display a UI conflict modal prompting the user to either restore the newer cloud backup or overwrite it with their current local changes.**  
* **Task 2.4: Build the Client-Side Preview. Load the raw compiled HTML string buffer instantly inside a client-side** \<iframe\> **using the** srcDoc **attribute for local simulation without API or server round-trips.**

### **Phase 3: The Resilient R2 Publish Pipeline & Invalidation Fail-Safes**

* **Task 3.1: Write the R2 Storage Writer action. When a user publishes, convert their subdomain destination to a predictable object key structure (**portfolios/\[subdomain\]/index.html**).**  
* **Task 3.2: Execute direct text-stream uploads using the AWS SDK S3 client configured for R2. Push the sanitized HTML string to the bucket instantly, automatically injecting Cloudflare Turnstile anti-spam script tags into active form blocks.**  
* **Task 3.3: Inject Cache-Control headers (**Cache-Control: public, max-age=31536000, s-maxage=31536000, immutable**) into the R2 metadata object to instruct the downstream edge network to match and maintain the asset inside edge memory cache pools.**  
* **Task 3.4: Build an asynchronous cache-purge retry queue. When a publish event occurs, attempt to clear the Cloudflare Edge Cache. If the Cloudflare Purge API fails or encounters rate limits, catch the exception, surface a warning to the log aggregator, and queue a background worker retry task to ensure the old static content is eventually invalidated.**

### **Phase 4: Edge Routing, Telemetry, & Edge-Native Forms**

* **Task 4.1: Setup Wrangler/Miniflare for local edge emulation of Cloudflare Workers, the Cache API, and R2 buckets to allow zero-cost offline testing.**  
* **Task 4.2: Deploy a Cloudflare Worker Subdomain Router. Write an edge script that intercepts requests using the native Cache API (**caches.default**). If a cache match is found, stream the HTML directly from edge memory to the client. On a cache miss, fetch the matching HTML file from Cloudflare R2, write it asynchronously to the edge cache using** ctx.waitUntil()**, and return the low-latency stream.**  
* **Task 4.3: Integrate edge-native logging. Inside the Worker Subdomain Router, wrap execution paths in error boundaries and use** ctx.waitUntil(fetch(...)) **to stream raw request performance metrics and exception traces out to Axiom/Better Stack without adding blocking latency to user requests.**  
* **Task 4.4: Deploy an Edge-Native Form Handler Worker. Route all static portfolio form submissions directly to a free-tier Cloudflare Worker endpoint. The worker verifies the embedded Cloudflare Turnstile token against the Turnstile API, dropping automated bot traffic before it consumes downstream processing resources.**

**📂 Unified Repository Structure**  
**Plaintext**  
/aether-studio  
├── /src  
│   ├── /app  
│   │   └── /dashboard             \# Next.js Builder UI, Canvas, BroadcastChannel & KV Version Reconciliation  
│   │   └── /api/publish           \# Compiles layout to HTML with inline styles, writes to R2, schedules cache purges  
│   │   └── /api/upload-url        \# Generates pre-signed R2 asset upload URLs (bypasses localStorage)  
│   ├── /components  
│   │   ├── /builder               \# Drag & Drop tree manipulation logic (debounced sync to LocalStorage \+ multi-tab broadcast)  
│   │   └── /registry              \# Token-to-inline style transformer converting blocks to HTML \+ style attributes  
│   ├── /lib  
│   │   ├── /compiler              \# Translates Rose Tree to sanitized Web Components \+ Turnstile blocks  
│   │   ├── /db                    \# Relational DB client (Turso/Neon) for tenant accounts, custom domains, and metadata  
│   │   ├── /kv                    \# Vercel KV client for debounced & lifecycle-flushed remote backups  
│   │   ├── /r2                    \# Cloudflare R2 client wrapper for CRUD asset files  
│   │   └── /telemetry             \# Sentry application tracing and backend error tracking configuration  
│   └── middleware.ts              \# Next.js internal path security and app sub-routing (dashboard only)  
├── /workers  
│   ├── /subdomain-router          \# Cloudflare Worker using Cache API (caches.default) \+ Axiom logging stream  
│   └── /edge-forms                \# Cloudflare Worker validating Turnstile tokens and handling data submissions  
├── wrangler.toml                  \# Local Edge orchestration and emulation configurations (Miniflare mapping)  
└── README.md                      \# Zero-cost edge-native architecture documentation
