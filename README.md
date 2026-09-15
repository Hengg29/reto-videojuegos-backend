# Reto Videojuegos — Backend

API en Node.js + Express, conectada a MySQL, que sirve datos de un catálogo
de videojuegos.

Repo del frontend: https://github.com/Hengg29/reto-videojuegos-frontend

## Requisitos

- Node.js (v18 o superior recomendado)
- MySQL corriendo localmente (o accesible por red)

## Instalación y ejecución local

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Crea un archivo `.env` en esta carpeta (usa `.env.example` como base) con
   tus datos reales:
   ```
   PORT=4000

   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=videojuegos_db
   ```

3. Crea la base de datos ejecutando el script SQL de este proyecto (ver
   sección "Base de datos" abajo) en tu MySQL.

4. Levanta el servidor:
   ```bash
   npm run dev
   ```
   Debe imprimir: `✅ Backend escuchando en http://localhost:4000`

## Estructura del proyecto

```
backend/
├── server.js               ← arma la app: middlewares + monta las rutas
├── config/
│   └── db.js                ← conexión (pool) a MySQL
├── routes/                  ← define qué URL dispara qué función
└── controllers/             ← la lógica de cada endpoint
```

- **routes/** → solo dice "cuando llega esta URL, usa esta función".
- **controllers/** → tiene la función en sí (la lógica: qué responder, qué guardar, etc).
- **config/** → configuración compartida, como la conexión a la base de datos.

## Endpoints disponibles

| Método | Ruta              | Qué hace                                |
|--------|-------------------|------------------------------------------|
| GET    | /api/health       | Revisa que el servidor esté vivo         |
| GET    | /api/db-health    | Revisa que la conexión a MySQL funcione  |

_(Esta tabla se irá actualizando conforme se agreguen los endpoints de
juegos, login y usuarios.)_

## Base de datos

Base de datos: `videojuegos_db` — 4 tablas normalizadas (3FN):

- **generos** — catálogo de géneros de videojuegos (Acción, RPG, etc.)
- **clasificaciones** — clasificación por edad tipo ESRB (E, T, M, AO)
- **usuarios** — cuentas con rol `admin` o `user` (login)
- **juegos** — el catálogo principal, relacionado con `generos` y
  `clasificaciones` mediante llaves foráneas (evita duplicar texto y
  mantiene la integridad de los datos)

Relaciones:
- `juegos.genero_id` → `generos.id`
- `juegos.clasificacion_id` → `clasificaciones.id`

El script de creación de la base y datos de ejemplo está en
[`database/schema.sql`](database/schema.sql).
