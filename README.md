project:
  name: Pastebin-Lite
  description: >
    A lightweight Pastebin-like web application that allows users to create,
    store, and share text pastes via a unique link. Pastes can optionally expire
    based on time (TTL) or number of views.

deployment:
  url: https://pastebin-lite-six-chi.vercel.app/

tech_stack:
  framework: Next.js (App Router)
  language: TypeScript (strict mode)
  runtime: Node.js
  orm: Prisma
  database: PostgreSQL (Neon)
  hosting: Vercel

environment_variables:
  DATABASE_URL: postgresql://<neon-connection-string>

local_setup:
  steps:
    - npm install
    - npx prisma generate
    - npx prisma db push
    - npm run dev
  app_url: http://localhost:3000

persistence_layer:
  database: PostgreSQL
  hosting: Neon
  access_layer: Prisma ORM
  description: >
    PostgreSQL is used as the persistence layer to store pastes, expiry metadata,
    and view counts. Prisma ORM provides type-safe database access and schema
    management.

api_endpoints:
  health_check:
    method: GET
    path: /api/healthz
    purpose: Check database connectivity
    success_response:
      ok: true

  create_paste:
    method: POST
    path: /api/pastes
    request_body:
      content: string (required)
      ttl_seconds: number (optional)
      max_views: number (optional)
    success_response:
     "id": "paste-id",
     "url": "https://pastebin-lite-six-chi.vercel.app/p/paste-id"

  fetch_paste:
    method: GET
    path: /api/pastes/:id
    success_response:
      content: string
      remaining_views: number | null
      expires_at: ISO-8601 timestamp | null
    error_response: 404 if expired, exhausted, or not found

html_view:
  path: /p/:id
  description: Render paste content as a simple HTML page

design_decisions:
  - Strict TypeScript with `unknown` instead of `any` for request validation
  - Explicit runtime validation for all API inputs
  - Expiry checks performed on every read
  - Atomic view count increments to prevent race conditions
  - Stateless API design suitable for serverless environments
  - Deterministic time handling to support automated testing

confidentiality:
  notice: >
    This project was created as part of a confidential take-home assignment and
    must not be publicly shared or reused.
