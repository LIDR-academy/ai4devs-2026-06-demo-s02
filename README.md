# ai4devs-2026-06-demo-s02

Demo project showcasing **OpenSpec** — a spec-driven change management workflow for AI-assisted development.

**Stack:** AdonisJS 7 · Lucid ORM · SQLite · React 19 · Vite 7 · Tailwind v4 · shadcn/ui

---

## What is OpenSpec?

OpenSpec is a workflow where every change starts as a spec, not as code. Before any implementation, you define *why*, *what*, and *how*. Claude then uses those artifacts to implement changes that are traceable, reviewable, and reversible.

```
explore → propose → apply → archive
```

Each change lives in `openspec/changes/<name>/` with four artifacts:

| Artifact | Purpose |
|---|---|
| `proposal.md` | Why the change, what it affects, high-level impact |
| `design.md` | Decisions, trade-offs, migration plan, open questions |
| `specs/<capability>/spec.md` | Updated capability spec (Given/When/Then scenarios) |
| `tasks.md` | Concrete implementation checklist |

---

## Project Structure

```
openspec/
  config.yaml                     # Project context + per-artifact rules
  specs/
    auth/spec.md                  # Base capability specs
  changes/
    add-birthday-to-me-endpoint/  # Active change (in progress)
      .openspec.yaml
      proposal.md
      design.md
      specs/auth/spec.md
      tasks.md
    archive/                      # Completed changes
      2026-06-18-extend-me-endpoint-profile-fields/

backend/                          # AdonisJS 7 REST API
  app/controllers/
  app/models/
  database/migrations/
  start/routes.ts
```

---

## OpenSpec Workflow

### 1. Explore

Think through a problem before committing to a direction. No code generated — only artifacts.

```
/opsx:explore
```

Use this to clarify scope, surface constraints, and identify open questions.

### 2. Propose

Create a complete change proposal in one step: `proposal.md`, `design.md`, `specs/`, and `tasks.md`.

```
/opsx:propose
```

Review all artifacts before proceeding. The proposal is the contract — implementation follows it.

### 3. Apply

Implement the tasks from an approved change. Claude reads the design and tasks, then writes code.

```
/opsx:apply
```

Tasks in `tasks.md` are checked off as they complete. Pause and resume at any task boundary.

### 4. Archive

Finalize a completed change and move it to `openspec/changes/archive/`.

```
/opsx:archive
```

---

## Configuration

`openspec/config.yaml` defines project context (tech stack, conventions) and per-artifact rules:

```yaml
schema: spec-driven

context: |
  Backend en AdonisJS 7, frontend en React 19 + Vite.
  Backend: AdonisJS 7, Lucid ORM, SQLite (better-sqlite3),
  VineJS, @adonisjs/auth con guard access_tokens
  Frontend: React 19, Vite 7, Tailwind v4, shadcn/ui
  Tooling: Biome, simple-git-hooks, npm

rules:
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - TypeScript strict mode
    - Descriptive migrations with timestamp
    - "Controllers return structured JSON: { data } or { error }"
    - Opaque tokens with prefix `oat_`
```

---

## Active Change: add-birthday-to-me-endpoint

**Status:** In progress

**Why:** Clients need date of birth for age-gating without a separate endpoint call.

**What changes:**
- New `birthday` (`DATE`, nullable) column on `users` via migration
- `POST /signup` accepts optional `birthday` field
- `GET /me` response gains `birthday` (ISO date string `YYYY-MM-DD` or `null`)

**Tasks remaining:** See [`openspec/changes/add-birthday-to-me-endpoint/tasks.md`](openspec/changes/add-birthday-to-me-endpoint/tasks.md)

---

## API

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/signup` | — | Create account, returns user + token |
| POST | `/login` | — | Authenticate, returns user + token |
| GET | `/me` | Bearer token | Current user profile |

Tokens are opaque with prefix `oat_`.

---

## Backend Setup

```bash
cd backend
npm install
node ace migration:run
node ace serve --watch
```

Runs on `http://localhost:3333` by default.
