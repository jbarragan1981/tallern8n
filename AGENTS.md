# Proyecto: Portal de Incidencias URVASEO
 
## Stack
- Monorepo con npm workspaces: carpetas backend/ y frontend/.
- Backend: Node.js + TypeScript + Express + TypeORM + PostgreSQL.
- Frontend: Angular (componentes standalone, signals, control flow @if/@for).
- Autenticación con JWT; contraseñas hasheadas con bcryptjs.
 
## Base de datos (NO recrear: ya existe, viene de los Talleres 1 y 5)
- Misma instancia Postgres del Taller 1 (contenedor n8n-postgres).
- Tablas reutilizadas: bot_usuarios, proyectos, novedades, comentarios.
- TypeORM debe usar synchronize: false y mapear entidades a las tablas existentes.
- bot_usuarios se EXTIENDE con: email, password_hash, reset_token, reset_expira.
 
## Convenciones
- Las "incidencias" del portal son la tabla novedades.
- Errores como JSON: { "message": "..." }.
- Nunca devolver password_hash en una respuesta.
- El correo de recuperación se envía reutilizando un webhook de n8n.
 
## Reglas para el agente
- Antes de crear archivos, propón el plan y espera mi verificación.
- No instales dependencias extra sin avisar.
- Usa los nombres de tabla y columnas EXACTAMENTE como están en la base.
