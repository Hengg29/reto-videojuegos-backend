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

   JWT_SECRET=un_valor_largo_y_aleatorio
   ```
   Puedes generar un `JWT_SECRET` seguro con:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

3. Crea la base de datos ejecutando el script SQL de este proyecto (ver
   sección "Base de datos" abajo) en tu MySQL.

4. Crea una cuenta de administrador (la tabla `usuarios` empieza vacía;
   no hay forma pública de crear un admin, por seguridad, así que se
   hace con este script):
   ```bash
   node scripts/crear-admin.js
   ```
   Esto crea `admin@gamevault.com` / `Admin1234`. Puedes pasar tus
   propios datos: `node scripts/crear-admin.js correo nombre password`.

5. Levanta el servidor:
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
├── middlewares/
│   └── auth.middleware.js    ← verificarToken (login) y soloAdmin (rol)
├── scripts/
│   └── crear-admin.js         ← crea/actualiza una cuenta admin a mano
├── routes/                  ← define qué URL dispara qué función
└── controllers/             ← la lógica de cada endpoint
```

- **routes/** → solo dice "cuando llega esta URL, usa esta función".
- **controllers/** → tiene la función en sí (la lógica: qué responder, qué guardar, etc).
- **config/** → configuración compartida, como la conexión a la base de datos.
- **middlewares/** → funciones que se ejecutan *antes* del controller para
  validar algo (¿está logueado?, ¿es admin?) y cortan la petición si no
  se cumple.

## Endpoints disponibles

| Método | Ruta              | Qué hace                                |
|--------|-------------------|------------------------------------------|
| GET    | /api/health       | Revisa que el servidor esté vivo         |
| GET    | /api/db-health    | Revisa que la conexión a MySQL funcione  |
| GET    | /api/juegos       | Lista todos los juegos, con nombre de género y clasificación incluidos |
| GET    | /api/juegos/:id   | Obtiene un juego por id, con el mismo detalle |
| GET    | /api/generos      | Lista todos los géneros (para los filtros del frontend) |
| POST   | /api/juegos       | Crea un juego 🔒 solo admin |
| PUT    | /api/juegos/:id   | Actualiza un juego 🔒 solo admin |
| DELETE | /api/juegos/:id   | Elimina un juego 🔒 solo admin |
| POST   | /api/auth/register | Crea una cuenta nueva (siempre con rol `user`) |
| POST   | /api/auth/login   | Inicia sesión, devuelve `{ usuario, token }` |
| GET    | /api/auth/me      | Devuelve el usuario del token actual 🔒 requiere login |

🔒 = requiere mandar el header `Authorization: Bearer <token>` que te da
`/api/auth/login`. Las rutas marcadas "solo admin" además revisan que el
`rol` del token sea `admin` (si no, responden 403).

### Autenticación

- Las contraseñas nunca se guardan en texto plano — se hashean con
  **bcrypt** antes de guardarlas.
- El login devuelve un **JWT** (JSON Web Token) firmado con `JWT_SECRET`,
  válido por 2 horas, con `{ id, email, rol }` adentro.
- El registro (`/api/auth/register`) siempre crea usuarios con rol
  `user` — no hay forma de auto-asignarse `admin` desde un endpoint
  público, por seguridad. Los admins se crean con
  `node scripts/crear-admin.js`.
- Ejemplo de petición protegida:
  ```bash
  curl -X POST http://localhost:4000/api/juegos \
    -H "Authorization: Bearer TU_TOKEN_AQUI" \
    -H "Content-Type: application/json" \
    -d '{"titulo":"Nuevo juego","precio":999,"genero_id":1,"clasificacion_id":1}'
  ```

Ejemplo de respuesta de `GET /api/juegos`:
```json
[
  {
    "id": 1,
    "titulo": "God of War Ragnarök",
    "descripcion": "Kratos y Atreus enfrentan el Ragnarök nórdico.",
    "imagen_url": "",
    "precio": "1599.00",
    "fecha_lanzamiento": "2022-11-09T06:00:00.000Z",
    "desarrollador": "Santa Monica",
    "genero_id": 1,
    "genero": "Acción",
    "clasificacion_id": 3,
    "clasificacion_codigo": "M",
    "clasificacion": "Maduro"
  }
]
```

_(Esta tabla se irá actualizando conforme se agreguen los endpoints de
crear/editar/borrar juegos, login y usuarios.)_

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
