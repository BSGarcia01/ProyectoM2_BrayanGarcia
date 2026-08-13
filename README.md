# MiniBlog API — Proyecto Módulo 2

Proyecto desarrollado por Bryan García como evaluación del Módulo 2 (Backend con Node.js, Express y PostgreSQL) en SoyHenry.

## 1. Descripción del proyecto

MiniBlog API es una API REST construida con **Node.js**, **Express** y **PostgreSQL**, que permite gestionar usuarios y publicaciones (posts) de un mini-blog. La API ofrece operaciones CRUD completas (crear, leer, actualizar y borrar) para ambos recursos, con una relación real entre ellos: cada post pertenece a un usuario específico (`usuario_id` como clave foránea).

El proyecto incluye validaciones de datos de entrada, manejo de errores con respuestas HTTP apropiadas, pruebas automatizadas con el test runner nativo de Node.js, documentación de la API en formato OpenAPI y despliegue en producción sobre Railway.

## 2. Tecnologías utilizadas

- **Node.js** — entorno de ejecución de JavaScript en el servidor.
- **Express** — framework para construir la API REST y sus rutas.
- **PostgreSQL** — base de datos relacional para persistencia de datos.
- **pg (node-postgres)** — librería cliente para conectar Node.js con PostgreSQL, usando `Pool` y queries parametrizadas.
- **node:test** — test runner nativo de Node.js para pruebas automatizadas.
- **supertest** — librería para probar los endpoints HTTP de la API.
- **OpenAPI** — documentación estándar de la API.
- **Railway** — plataforma de despliegue en producción.
- **Claude (Anthropic)** — usado como apoyo de aprendizaje durante el desarrollo (ver sección 12).

## 3. Estructura del repositorio

```
ProyectoM2_BrayanGarcia/
├── app.js                  → Configura Express y monta las rutas de usuarios y posts
├── index.js                → Punto de entrada: carga las variables de entorno y levanta el servidor
├── db/
│   ├── config.js           → Configuración del Pool de conexión a PostgreSQL
│   ├── setup.sql           → Script para crear las tablas de la base de datos
│   ├── seed.sql            → Script con datos de ejemplo (usuarios y posts)
│   └── test-connection.js  → Script para verificar la conexión a la base de datos
├── routes/
│   ├── usuarios.js         → Endpoints CRUD de usuarios
│   └── posts.js            → Endpoints CRUD de posts
├── validators/
│   ├── usuarios.js         → Validaciones de nombre y email
│   └── posts.js            → Validaciones de título, contenido y usuario_id
├── test/
│   └── app.test.js         → Pruebas automatizadas de la API
├── openapi.yaml            → Documentación de la API en formato OpenAPI
├── package.json
├── .env                    → Variables de entorno (no se sube a Git)
├── .env.example            → Plantilla de variables de entorno
└── .gitignore
```

## 4. Entidades

**usuarios**

| Columna | Tipo | Restricción |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| nombre | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | UNIQUE NOT NULL |

**posts**

| Columna | Tipo | Restricción |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| titulo | VARCHAR(100) | NOT NULL |
| contenido | TEXT | NOT NULL |
| usuario_id | INTEGER | NOT NULL, FOREIGN KEY → usuarios(id) |

## 5. Endpoints disponibles

**Usuarios**

| Método | Ruta | Descripción |
|---|---|---|
| GET | /usuarios | Listar todos los usuarios |
| GET | /usuarios/:id | Detalle de un usuario específico |
| POST | /usuarios | Crear un nuevo usuario |
| PUT | /usuarios/:id | Actualizar un usuario existente |
| DELETE | /usuarios/:id | Eliminar un usuario |

**Posts**

| Método | Ruta | Descripción |
|---|---|---|
| GET | /posts | Listar todos los posts |
| GET | /posts/:id | Detalle de un post específico |
| GET | /posts/usuario/:usuarioId | Posts de un usuario con detalle de su autor |
| POST | /posts | Crear un nuevo post |
| PUT | /posts/:id | Actualizar un post existente |
| DELETE | /posts/:id | Eliminar un post |

## 6. Validaciones implementadas

Las validaciones viven en el directorio `validators/` como funciones reutilizables que devuelven un mensaje de error o `null`:

- `nombre` no puede estar vacío (usuarios).
- `email` no puede estar vacío y debe tener formato válido (usuarios). Además, la base de datos garantiza que el email sea único, devolviendo `409` si se intenta registrar un email ya existente.
- `titulo` no puede estar vacío (posts).
- `contenido` no puede estar vacío (posts).
- `usuario_id` es obligatorio al crear un post, y debe corresponder a un usuario existente (si no existe, la clave foránea devuelve `404`).

## 7. Manejo de errores

Cada endpoint envuelve sus operaciones con la base de datos en `try/catch` y devuelve respuestas JSON consistentes en formato `{ "error": "mensaje" }`. Ante datos inválidos se responde `400`, las validaciones de la API también reflejan correctamente los códigos HTTP correspondientes de la base de datos:

- `200` (OK), `201` (creado), `400` (datos inválidos), `404` (no encontrado), `409` (conflicto, ej. email duplicado) y `500` (error interno del servidor).

## 8. Requisitos y pasos para ejecutar localmente

### Requisitos previos
- Node.js instalado (v18 o superior recomendado).
- PostgreSQL instalado y corriendo localmente.

### Pasos

1. Clona este repositorio:
   ```bash
   git clone https://github.com/BSGarcia01/ProyectoM2_BrayanGarcia.git
   cd ProyectoM2_BrayanGarcia
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea tu archivo `.env` a partir de la plantilla:
   ```bash
   cp .env.example .env
   ```
   Y completa tus propias credenciales de PostgreSQL local:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=miniblog
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña_si_aplica
   ```

4. Crea la base de datos y las tablas ejecutando el script SQL de configuración:
   ```bash
   psql -U tu_usuario -c "CREATE DATABASE miniblog;"
   psql -U tu_usuario -d miniblog -f db/setup.sql
   ```

5. Carga los datos de ejemplo:
   ```bash
   psql -U tu_usuario -d miniblog -f db/seed.sql
   ```

6. Ejecuta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   El servidor quedará disponible en `http://localhost:3000`.

## 9. Cómo ejecutar los tests

Este proyecto usa el test runner nativo de Node.js (`node:test`). Para ejecutarlas:

```bash
npm test
```

Este comando primero ejecuta el `seed.sql` (dejando la base en un estado conocido) y luego corre las pruebas con `supertest` sobre la aplicación Express. Las pruebas cubren los endpoints principales de usuarios y posts:

- `GET /usuarios` devuelve los 3 usuarios de ejemplo.
- `POST /usuarios` crea un usuario (201).
- `POST /usuarios` con email duplicado devuelve `409`.
- `GET /posts` devuelve los 3 posts de ejemplo.
- `POST /posts` crea un post (201).
- `POST /posts` con un `usuario_id` inexistente devuelve `404`.
- `GET /posts/usuario/:usuarioId` devuelve los posts de un usuario con el detalle de su autor (200), y `404` si el usuario no existe o no tiene posts.

## 10. Documentación OpenAPI

La documentación de la API se encuentra en el archivo `openapi.yaml`, en la raíz del repositorio. Puedes visualizarla de forma interactiva copiando su contenido en [Swagger Editor](https://editor.swagger.io/), o usando una extensión de OpenAPI/Swagger en tu editor.

## 11. Despliegue en Railway

El proyecto está desplegado en Railway, incluyendo tanto la API como la base de datos PostgreSQL.

**Pasos generales del despliegue:**

1. Se creó un proyecto en Railway y se conectó al repositorio de GitHub.
2. Se agregó un servicio de PostgreSQL dentro del mismo proyecto de Railway.
3. Se configuraron las variables de entorno en el panel de Railway (equivalentes a las de `.env`). El `db/config.js` usa automáticamente la `DATABASE_URL` si existe (con SSL), o en su defecto las variables individuales `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD`. Railway genera también una URL interna (`postgres.railway.internal`) para comunicación entre servicios dentro del mismo proyecto, aunque desde internet se accede con la URL pública del proxy (`railway.app`).
4. Railway detecta el `package.json` y ejecuta `node index.js` para levantar el servidor automáticamente.
5. Se ejecutaron los scripts `db/setup.sql` y `db/seed.sql` contra la base de datos en la nube.
6. Railway expone una URL pública para acceder a la API desde internet.

**Demo desplegada:** [https://proyectom2brayangarcia-production.up.railway.app/](https://proyectom2brayangarcia-production.up.railway.app/)

## 12. Uso de la IA

Durante el desarrollo de este proyecto utilicé Claude (Anthropic) como tutor de aprendizaje, no como generador de código directo. El enfoque de trabajo fue: yo escribía el código, la IA revisaba, explicaba errores y guiaba el razonamiento paso a paso mediante preguntas, sin entregar soluciones completas de forma directa salvo en piezas repetitivas donde ya dominaba el patrón (por ejemplo, replicar el CRUD de usuarios en posts).

Ejemplos de prompts utilizados durante el desarrollo:

- *"Ensename y guíame hasta llegar al punto deseado, no quiero que me des el código resuelto de una sola vez"* → estableció la dinámica de tutoría para todo el proyecto.
- *"¿Cómo generar un servidor con Express?"* → guio la construcción paso a paso de `app.js` e `index.js`, explicando `require`, callbacks y `app.listen()`.
- *"Necesito entender la diferencia entre Pool y Client en PostgreSQL"* → explicó por qué usar `Pool` en una API web, basado en la lectura oficial del curso.
- *"¿Por qué mi validación no funciona si le paso !nombre en vez de nombre?"* → guio la corrección de errores de sintaxis y el entendimiento profundo del operador `!` (negación) y `||` (o) en JavaScript.

## 13. Repositorio

- **Repositorio:** [https://github.com/BSGarcia01/ProyectoM2_BrayanGarcia](https://github.com/BSGarcia01/ProyectoM2_BrayanGarcia)
- **Demo desplegada (Railway):** [https://proyectom2brayangarcia-production.up.railway.app/](https://proyectom2brayangarcia-production.up.railway.app/)

## Autor

Bryan García

Redes sociales: @stivengarciac