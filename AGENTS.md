# Proyecto: Portal de Incidencias URVASEO

Portal web que reutiliza la base de datos de los Talleres 1 y 5 (n8n + PostgreSQL).
Permite registro/login, recuperación de contraseña, un dashboard de incidencias y
una página interna con el chatbot de n8n embebido.

## Stack

- **Monorepo** con npm workspaces: carpetas `backend/` y `frontend/`.
- **Backend:** Node.js (18+) + TypeScript + Express + TypeORM + PostgreSQL.
- **Frontend:** Angular (componentes standalone, signals, control flow `@if`/`@for`).
- **Auth:** JWT; contraseñas hasheadas con `bcryptjs`.
- **Integración:** el correo de recuperación de contraseña se envía reutilizando un
  webhook de n8n (nodo Gmail del Taller 1).

## Base de datos

El modelo de datos completo (tablas, tipos, claves foráneas, valores `CHECK` y
defaults) está documentado en **[`docs/db-schema.md`](docs/db-schema.md)**. Es la
**fuente de verdad**: léelo antes de crear o modificar entidades, queries o migraciones.

Reglas no negociables (el detalle está en el documento anterior):

- Las tablas **YA EXISTEN** (Talleres 1 y 5): `bot_usuarios`, `proyectos`,
  `novedades`, `comentarios`. **No las recrees.**
- TypeORM con **`synchronize: false`**; mapear entidades a esas tablas exactas.
- Las "incidencias" del portal son la tabla `novedades`.
- Conexión: contenedor `n8n-postgres`, puerto `5432`, base `n8n`.
- Los `id` (`bigint`) llegan como **`string`** en node-postgres.
- **Nunca** devolver `password_hash` ni `reset_token` en una respuesta.

## Estándares de código

Las reglas de **seguridad, clean code, principios SOLID (anti–código espagueti) y
SonarQube** están en **[`docs/coding-standards.md`](docs/coding-standards.md)**. Son
**obligatorias** para todo el código. Léelas antes de escribir o refactorizar.

Resumen de lo no negociable (el detalle está en ese documento):

- **Seguridad:** secretos solo en `.env`; nunca devolver `password_hash`/`reset_token`;
  SQL parametrizado; validar toda entrada en el backend; roles verificados en el servidor.
- **Clean code:** sin `any`, funciones pequeñas, sin valores mágicos, DRY, capas separadas.
- **SOLID:** `route → controller → service → repository/entity`; inyectar dependencias;
  sin lógica de negocio en rutas/componentes; sin dependencias circulares.
- **SonarQube:** pasar el Quality Gate (0 bugs/vulnerabilidades, cobertura ≥ 80 %,
  duplicación < 3 %, baja complejidad). No silenciar reglas con `// NOSONAR`.

## Convenciones

- Errores de la API como JSON: `{ "message": "..." }`.
- En SQL, usar parámetros (`$1, $2, …`); nunca concatenar valores del usuario (evita inyección).
- Nombres de tabla y columna **exactamente** como están en `docs/db-schema.md`.
- Secretos (contraseña de BD, `JWT_SECRET`) viven solo en `backend/.env`,
  que está en `.gitignore`. No los pongas en este archivo ni en el repo.

## Reglas para el agente

1. Lee `docs/db-schema.md` y `docs/coding-standards.md` antes de tocar código.
2. Antes de crear archivos, **propón el plan y espera mi verificación.**
3. No instales dependencias extra sin avisar.
4. Aplica siempre los estándares de seguridad, clean code, SOLID y SonarQube de `docs/coding-standards.md`.
5. Opcional pero recomendado: antes de crear las entidades, conéctate al contenedor
   `n8n-postgres` y ejecuta `\d bot_usuarios`, `\d novedades`, `\d proyectos`,
   `\d comentarios` para confirmar el esquema vivo y usar esos nombres exactos.
6. Si la base real difiere de `docs/db-schema.md`, gana la base real: actualiza el documento.
