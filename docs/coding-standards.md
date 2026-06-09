# Estándares de código — Portal de Incidencias URVASEO

> Reglas obligatorias para todo el código del proyecto (backend Node/TS/Express/TypeORM
> y frontend Angular). El objetivo es código **seguro, limpio, mantenible y que pase el
> Quality Gate de SonarQube**. Si una regla choca con una petición, avisa antes de romperla.

---

## 1. Seguridad

### Secretos y configuración
- Los secretos (contraseña de BD, `JWT_SECRET`, claves de API) viven **solo en `backend/.env`**, que está en `.gitignore`. **Nunca** hardcodear secretos en el código ni en docs versionados.
- Mantener un `.env.example` sin valores reales como plantilla.

### Autenticación y contraseñas
- Contraseñas con **bcrypt** (cost ≥ 10). Jamás guardar ni loggear texto plano.
- **Nunca** devolver `password_hash`, `reset_token` ni `reset_expira` en una respuesta. Seleccionar columnas explícitas o mapear a un DTO de salida.
- JWT: secreto largo y aleatorio, expiración corta (`JWT_EXPIRES`), y validación en **cada** ruta protegida vía middleware.
- `reset_token`: aleatorio, de **un solo uso** y con expiración (30 min). Invalidarlo (`null`) tras usarse.
- `forgot-password` responde **igual** exista o no el correo (no revelar qué usuarios existen).

### Entrada y base de datos
- **Validar y sanear toda entrada** del cliente (`body`, `params`, `query`) en el backend. Nunca confiar en la validación del frontend. Usar un validador (p. ej. `zod`).
- SQL **siempre parametrizado** (`$1, $2, …`) o con el query builder de TypeORM. Prohibido concatenar input del usuario en queries (inyección SQL).
- Aplicar **menor privilegio**: los roles (`reportante`/`tecnico`/`supervisor`) se verifican en el **backend**, no solo ocultando botones en el frontend.

### Superficie HTTP
- **CORS** restringido al origen del frontend (`FRONTEND_URL`), nunca `*` en producción.
- Cabeceras de seguridad con **helmet** en Express.
- **Rate limiting** en endpoints sensibles (`/login`, `/forgot-password`) contra fuerza bruta.
- **HTTPS** obligatorio en producción (incluida la instancia de n8n para el chat embebido).

### Errores y logs
- No exponer stack traces ni detalles internos al cliente. Mensajes genéricos: `{ "message": "..." }`. El detalle va a logs del servidor.
- **No loggear** secretos, tokens, contraseñas ni objetos de usuario completos.
- Manejo de errores centralizado (middleware de error en Express).

### Dependencias
- Ejecutar `npm audit` periódicamente y mantener dependencias actualizadas. No introducir librerías sin justificación.

---

## 2. Clean Code

- **Nombres descriptivos** y coherentes con el dominio (`novedad`, `incidencia`, `reportadoPor`). Nada de `data`, `temp`, `x`.
- **Funciones pequeñas** con una sola responsabilidad (idealmente < 30 líneas).
- **Sin valores mágicos**: estados, roles y severidades en constantes/enums (`ESTADO.RESUELTO`, no `'resuelto'` suelto por todo el código).
- **DRY**: no duplicar lógica (acceso a repos, validación de token, formateo). Extraer a funciones/servicios.
- **Early return / guard clauses** en lugar de anidar `if` profundos.
- Comentarios solo para explicar el **porqué**, no el qué; el código se explica por sí mismo.
- **Tipado fuerte**: prohibido `any`. Usar interfaces y tipos. Activar `strict` en `tsconfig`.
- **Separación por capas** (ver SOLID): las rutas no contienen SQL ni lógica de negocio; los componentes Angular no arman peticiones HTTP a mano.
- `async/await` con manejo de errores; nada de promesas sin `await` ni sin `catch`.
- Formateo y linting automáticos: **Prettier + ESLint** (backend y frontend). El build no pasa con errores de lint.

---

## 3. Principios SOLID (anti–código espagueti)

Aplicados a este stack. La meta es que cada pieza tenga un lugar y los cambios no se propaguen en cascada.

- **S — Responsabilidad única:** cada archivo/clase tiene **una sola razón para cambiar**.
  - Backend en capas: `route → controller → service → repository/entity`. Un controller **no** consulta la BD; eso es del service/repository.
  - Frontend: un componente Angular muestra/recoge datos; **un service** habla con la API.
- **O — Abierto/Cerrado:** extensible sin modificar lo existente.
  - Ej.: agregar un nuevo canal de notificación o un nuevo estado no debe obligar a reescribir un `switch` gigante; usar mapas/estrategias.
- **L — Sustitución de Liskov:** una implementación de una interfaz debe cumplir su contrato sin sorpresas (mismos tipos de retorno, sin lanzar donde el contrato no lo prevé).
- **I — Segregación de interfaces:** interfaces pequeñas y específicas. Nada de "god interfaces" que obligan a implementar métodos que no se usan.
- **D — Inversión de dependencias:** depender de **abstracciones**, no de implementaciones concretas.
  - Inyectar dependencias (un service recibe el repositorio), no instanciarlas dentro con `new`.
  - Angular: usar `inject()` / DI. Backend: pasar `DataSource`/repositorios.

### Reglas concretas anti-spaghetti
1. Respetar las capas: ninguna ruta/componente contiene lógica de negocio.
2. Un archivo = una responsabilidad; una función = una tarea.
3. **Sin dependencias circulares** entre módulos.
4. **Sin estado global mutable** compartido.
5. Límite práctico: función ≤ 30 líneas, archivo ≤ ~300 líneas. Si crece, refactorizar.

---

## 4. Reglas para SonarQube

El proyecto debe **pasar el Quality Gate** antes de hacer merge.

### Objetivos del Quality Gate (sobre código nuevo)
- **0** bugs · **0** vulnerabilities · **0** security hotspots sin revisar.
- Cobertura de tests **≥ 80 %** en código nuevo.
- Duplicación de código **< 3 %**.
- Sin code smells **bloqueantes** ni **críticos**.
- **Cognitive complexity** baja por función (objetivo ≤ 15).

### Reglas que Sonar suele marcar — y cómo evitarlas
- Prohibido `any` en TypeScript → tipar correctamente.
- Sin `console.log` en código de producción → usar un logger.
- Sin código muerto, variables/imports sin usar, ni parámetros no utilizados.
- Sin bloques `catch` vacíos: manejar el error o re-lanzarlo.
- Funciones demasiado largas o complejas → dividir.
- Sin código duplicado → extraer a función/servicio (regla DRY).
- **Sin credenciales hardcodeadas** (Sonar las reporta como vulnerabilidad) → `.env`.
- Sin `TODO`/`FIXME` sin ticket asociado.
- Eliminar expresiones y condiciones siempre verdaderas/falsas.

### Cómo se ejecuta
- Tests con cobertura: **Jest** (backend) y **Jest/Karma** (Angular), generando reporte `lcov`.
- Análisis con **SonarScanner** vía un `sonar-project.properties` en la raíz, integrado en CI.

Ejemplo de `sonar-project.properties`:

```properties
sonar.projectKey=portal-incidencias-urvaseo
sonar.sources=backend/src,frontend/src
sonar.tests=backend/test,frontend/src
sonar.test.inclusions=**/*.spec.ts,**/*.test.ts
sonar.exclusions=**/node_modules/**,**/dist/**,**/*.config.ts
sonar.javascript.lcov.reportPaths=backend/coverage/lcov.info,frontend/coverage/lcov.info
sonar.sourceEncoding=UTF-8
sonar.qualitygate.wait=true
```

> Regla práctica: si Sonar marca algo, se **corrige**, no se silencia con `// NOSONAR`.
> Suprimir una regla solo con justificación escrita y aprobación.
