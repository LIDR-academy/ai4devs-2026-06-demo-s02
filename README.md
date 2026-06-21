# AI4DEVS — Demo S02: Desarrollo Spec-Driven con OpenSpec

Proyecto de demostración del flujo **OpenSpec**: un método para diseñar, especificar e implementar cambios de software de forma estructurada, usando Claude Code como asistente de ingeniería.

---

## ¿Qué es OpenSpec?

OpenSpec es un sistema de gestión de cambios orientado a especificaciones. En lugar de ir directo al código, cada cambio pasa por etapas bien definidas:

```
Idea → Propuesta → Diseño → Spec → Tareas → Implementación → Archivo
```

Cada cambio vive en su propia carpeta dentro de `openspec/changes/` y contiene artefactos de texto que documentan el _qué_, el _por qué_ y el _cómo_ antes de tocar una sola línea de código.

**Beneficios:**
- Decisiones técnicas quedan documentadas antes de implementar
- El contexto no se pierde entre sesiones de trabajo
- Claude Code puede retomar cualquier cambio desde cualquier punto
- Los cambios completados se archivan como historial de decisiones

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Backend | AdonisJS 7, TypeScript strict |
| ORM | Lucid + SQLite (better-sqlite3) |
| Validación | VineJS 4 |
| Autenticación | @adonisjs/auth (access_tokens, prefijo `oat_`) |
| Frontend | React 19 + Vite 7 + Tailwind v4 + shadcn/ui |
| Tooling | Biome, simple-git-hooks, npm |

---

## Estructura del proyecto

```
/
├── backend/                    # API REST en AdonisJS 7
│   ├── app/
│   │   ├── controllers/        # Lógica HTTP
│   │   ├── models/             # Modelos Lucid
│   │   └── validators/         # Esquemas VineJS
│   ├── database/
│   │   ├── migrations/         # Migraciones con timestamp
│   │   └── schema.ts           # Esquema auto-generado por Lucid
│   └── start/routes.ts         # Definición de rutas
│
└── openspec/                   # Sistema de gestión de cambios
    ├── config.yaml             # Contexto del proyecto y reglas
    ├── specs/                  # Especificaciones base por capacidad
    │   └── auth/spec.md
    └── changes/                # Un directorio por cambio
        └── extend-me-endpoint/
            ├── .openspec.yaml  # Metadata del cambio
            ├── proposal.md     # Problema y solución
            ├── design.md       # Decisiones técnicas y riesgos
            ├── tasks.md        # Lista de tareas implementables
            └── specs/          # Spec actualizada para este cambio
```

---

## API actual

```
POST /signup   →  { user: { id, email }, accessToken }
POST /login    →  { user: { id, email }, accessToken }
POST /logout   →  { message }
GET  /me       →  { id, email, createdAt, displayName, lastLoginAt }
```

Autenticación: `Authorization: Bearer <token>`

---

## Flujo OpenSpec paso a paso

### 1. Explorar (`/opsx explore`)

Antes de proponer, usa el modo exploración para analizar el problema, revisar specs existentes y clarificar requisitos sin comprometerte a una solución.

```
/opsx explore
> Quiero saber qué devuelve actualmente /me y qué necesitarían los clientes
```

### 2. Proponer (`/opsx propose`)

Describe el cambio en lenguaje natural. Claude genera automáticamente los artefactos: `proposal.md`, `design.md`, `specs/` y `tasks.md`.

```
/opsx propose
> Extender /me para incluir displayName y lastLoginAt
```

**Resultado:** nueva carpeta en `openspec/changes/` con todos los artefactos.

### 3. Revisar los artefactos

Antes de implementar, revisa y ajusta los archivos generados:

- **`proposal.md`** — por qué el cambio, qué modifica, impacto
- **`design.md`** — decisiones técnicas, alternativas descartadas, riesgos
- **`tasks.md`** — lista de tareas concretas y ejecutables
- **`specs/`** — escenarios BDD (Given/When/Then) actualizados

### 4. Implementar (`/opsx apply`)

Con los artefactos aprobados, ejecuta las tareas una por una:

```
/opsx apply
```

Claude lee `tasks.md`, implementa cada tarea y marca el progreso. Puedes pausar y retomar en cualquier momento.

### 5. Archivar (`/opsx archive`)

Una vez completado el cambio, archívalo para preservar el historial de decisiones:

```
/opsx archive
```

---

## Ejemplo real: `extend-me-endpoint`

Este repositorio incluye un cambio completo como referencia.

**Problema:** `/me` devolvía solo `{ id, email, createdAt }`. Los clientes necesitaban `displayName` para personalización de UI y `lastLoginAt` para dashboards de seguridad.

**Artefactos generados:**

```
openspec/changes/extend-me-endpoint/
├── proposal.md   →  qué cambia y por qué
├── design.md     →  decisión: guardar lastLoginAt en users (no en tokens)
├── tasks.md      →  3 tareas: migración, controller login, controller /me
└── specs/auth/   →  spec BDD actualizada con los nuevos campos
```

**Tareas ejecutadas:**

```markdown
## 1. Database Migration
- [x] 1.1 Generar migración: add_last_login_at_to_users
- [x] 1.2 Añadir columna nullable timestamp
- [x] 1.3 Ejecutar migración y verificar schema.ts

## 2. Record lastLoginAt on Login
- [x] 2.1 Actualizar AccessTokensController.store()
- [x] 2.2 Importar DateTime de luxon

## 3. Extend /me Response
- [x] 3.1 Actualizar ProfileController con displayName y lastLoginAt
```

**Resultado:** cambio aditivo, no-breaking, completamente documentado.

---

## Especificaciones (BDD)

Las specs viven en `openspec/specs/` y usan formato Given/When/Then:

```markdown
### Scenario: Successful login
- GIVEN a user exists with email and password
- WHEN POST /login with matching credentials
- THEN response status is 200
- AND body contains { user: { id, email }, accessToken }
```

Cada cambio puede añadir o modificar escenarios en `openspec/changes/<nombre>/specs/`.

---

## Primeros pasos

```bash
cd backend
npm install
node ace migration:run
node ace serve --watch
```

La API queda disponible en `http://localhost:3333`.

---

## Comandos OpenSpec disponibles

| Comando | Descripción |
|---------|-------------|
| `/opsx explore` | Explorar ideas y analizar el estado actual |
| `/opsx propose` | Crear nueva propuesta con todos los artefactos |
| `/opsx apply` | Implementar tareas de un cambio activo |
| `/opsx archive` | Archivar un cambio completado |

---

## Configuración OpenSpec

`openspec/config.yaml` define el contexto del proyecto y las reglas por artefacto:

```yaml
schema: spec-driven
context: |
  Backend en AdonisJS 7, frontend en React 19 + Vite.
  ...
rules:
  specs:
    - Usar el formato Given/When/Then para escenarios
  design:
    - TypeScript strict mode
    - Migrations descriptivas con timestamp
    - Controllers retornan JSON estructurado: { data } o { error }
```

Edita este archivo para adaptar OpenSpec a tu proyecto.
