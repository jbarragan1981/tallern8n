# Portal de Incidencias URVASEO

Este es el repositorio del **Portal de Incidencias URVASEO**, una plataforma para reportar y gestionar incidencias (novedades, proyectos y comentarios).

## Estructura del Proyecto

El proyecto está configurado como un monorepo utilizando **npm workspaces**:

```mermaid
graph TD
    root["tallern8n (Raíz)"] --> backend["backend/ (Express + TypeScript)"]
    root --> frontend["frontend/ (Angular)"]
    root --> docs["docs/ (Documentación)"]
    
    backend --> b_src["src/"]
    b_src --> b_config["config/"]
    b_src --> b_controllers["controllers/"]
    b_src --> b_dtos["dtos/"]
    b_src --> b_entities["entities/"]
    b_src --> b_middlewares["middlewares/"]
    b_src --> b_routes["routes/"]
    b_src --> b_services["services/"]
    
    frontend --> f_src["src/"]
    f_src --> f_app["app/"]
    f_app --> f_components["components/"]
    f_app --> f_core["core/"]
    f_app --> f_pages["pages/"]
    f_src --> f_env["environments/"]
```

### Distribución de Carpetas

```text
tallern8n/ (Raíz)
├── backend/                  # API REST (Node.js + Express + TypeScript + TypeORM)
│   ├── src/
│   │   ├── config/           # Configuración (Base de Datos, JWT, etc.)
│   │   ├── controllers/      # Controladores de la API
│   │   ├── dtos/             # Data Transfer Objects (Validación)
│   │   ├── entities/         # Entidades de TypeORM (Mapeo a DB)
│   │   ├── middlewares/      # Middlewares (Autenticación, Roles)
│   │   ├── routes/           # Definición de Rutas
│   │   └── services/         # Lógica de Negocio (Servicios)
│   └── tsconfig.json
│
├── frontend/                 # Aplicación SPA (Angular 17+)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Componentes Reutilizables (Navbar, etc.)
│   │   │   ├── core/         # Servicios de Angular, Guards, Interceptors
│   │   │   └── pages/        # Componentes de Páginas (Login, Dashboard, Chatbot)
│   │   ├── environments/     # Configuración de entornos (API URL)
│   │   └── styles.css        # Estilos Globales (Vanilla CSS)
│   └── angular.json
│
└── docs/                     # Documentación del proyecto (Esquema DB, Estándares)
```

## Stack Tecnológico

- **Backend:** Node.js, TypeScript, Express, TypeORM, PostgreSQL.
- **Frontend:** Angular, Vanilla CSS, Signals, Standalone Components.
- **Seguridad:** Autenticación basada en JWT, contraseñas hasheadas con bcryptjs.
- **Base de Datos:** PostgreSQL (compartida con la instancia del bot de Telegram, mapeada con TypeORM sin sincronización/recreación de tablas).

## Requisitos Previos

- **Node.js** (v18+)
- **npm** (v9+)
- Contenedor Docker **n8n-postgres** en ejecución.

## Configuración y Desarrollo

1. **Instalar dependencias en el monorepo:**
   ```bash
   npm install
   ```

2. **Configurar el entorno:**
   Configurar las credenciales de base de datos y JWT en el archivo `.env` en la raíz del proyecto.

3. **Ejecutar servicios en desarrollo:**
   - **Backend:**
     ```bash
     npm run dev --workspace=backend
     ```
   - **Frontend:**
     ```bash
     npm run dev --workspace=frontend
     ```
