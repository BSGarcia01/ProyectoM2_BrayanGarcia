
# MiniBlog API — Proyecto Módulo 2

Proyecto desarrollado por Bryan García como evaluación del Módulo 2 (Backend con Node.js, Express y PostgreSQL) en SoyHenry.

## 1. Descripción del proyecto

MiniBlog API es una API REST construida con **Node.js**, **Express** y **PostgreSQL**, que permite gestionar usuarios y publicaciones (posts) de un mini-blog. La API ofrece operaciones CRUD completas (crear, leer, actualizar y borrar) para ambos recursos, con una relación real entre ellos: cada post pertenece a un usuario específico (`usuario_id` como clave foránea).

El proyecto incluye validaciones de datos de entrada, manejo centralizado de errores mediante middleware, pruebas unitarias con Vitest, documentación de la API en formato OpenAPI, y despliegue en producción sobre Railway.

## 2. Tecnologías utilizadas

- **Node.js** — entorno de ejecución de JavaScript en el servidor.
- **Express** — framework para construir la API REST y sus rutas.
- **PostgreSQL** — base de datos relacional para persistencia de datos.
- **pg (node-postgres)** — librería cliente para conectar Node.js con PostgreSQL, usando `Pool` y queries parametrizadas.
- **Vitest** — framework de pruebas unitarias.
- **OpenAPI** — documentación estándar de la API.
- **Railway** — plataforma de despliegue en producción.
- **Claude (Anthropic)** — usado como apoyo de aprendizaje durante el desarrollo (ver sección 9).

## 3. Estructura del repositorio

```
ProyectoM2_BrayanGarcia/
├── db/
│   ├── config.js            → Configuración del Pool de conexión a PostgreSQL
│   └── test-connection.js   → Script para verificar la conexión a la base de datos
├── routes/
│   ├── usuarios.js          → Endpoints CRUD de usuarios
│   └── posts.js             → Endpoints CRUD de posts
├── validators/
│   ├── usuarios.js          → Validaciones de nombre y email
│   └── posts.js             → Validaciones de título, contenido y usuario_id
├── errors.js                → Funciones para crear errores con código de estado
├── errorHandler.js          → Middleware centralizado de manejo de errores
├── tests/                   → Pruebas unitarias con Vitest
├── openapi.yaml              → Documentación de la API en formato OpenAPI
├── index.js                  → Punto de entrada: configura Express y levanta el servidor
├── .env                       → Variables de entorno (no se sube a Git)
├── .env.example                → Plantilla de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## 4. Entidades

**usuarios**

| Columna | Tipo | Restricción |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| nombre | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | UNIQUE |

**posts**

| Columna | Tipo | Restricción |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| titulo | VARCHAR(200) | NOT NULL |
| contenido | TEXT | NOT NULL |
| usuario_id | INTEGER | FOREIGN KEY → usuarios(id), ON DELETE CASCADE |

## 5. Endpoints disponibles

**Usuarios**

| Método | Ruta | Descripción |
|---|---|---|
| GET | /usuarios | Listar todos los usuarios |
| GET | /usuarios/:id | Detalle de un usuario específico |
| POST | /usuarios | Crear un nuevo usuario |
| PUT | /usuarios/:id | Actualizar un usuario existente |
| DELETE | /usuarios/:id | Eliminar un usuario (elimina sus posts en cascada) |

**Posts**

| Método | Ruta | Descripción |
|---|---|---|
| GET | /posts | Listar todos los posts |
| GET | /posts/:id | Detalle de un post específico |
| POST | /posts | Crear un nuevo post |
| PUT | /posts/:id | Actualizar un post existente |
| DELETE | /posts/:id | Eliminar un post |

## 6. Validaciones implementadas

- `nombre` no puede estar vacío (usuarios).
- `email` no puede estar vacío, debe tener formato válido, y debe ser único (usuarios).
- `titulo` no puede estar vacío (posts).
- `contenido` no puede estar vacío (posts).
- `usuario_id` es obligatorio al crear un post, y debe corresponder a un usuario existente (posts).
- Respuestas con códigos HTTP apropiados: `200` (OK), `201` (creado), `400` (datos inválidos), `404` (no encontrado), `409` (conflicto, ej. email duplicado), `500` (error interno).

## 7. Manejo de errores

El proyecto centraliza el manejo de errores mediante un middleware (`errorHandler.js`) ubicado al final de la cadena de middlewares. Los errores se generan con funciones auxiliares (`errors.js`) y se propagan usando `next(error)`, evitando repetir lógica de respuesta en cada endpoint. Esto garantiza respuestas consistentes en formato JSON con `error` y `status` en todos los casos.

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
   DB_PASSWORD=tu_contraseña
   ```

4. Crea la base de datos y las tablas ejecutando el script SQL de configuración:
   ```bash
   psql -U tu_usuario -c "CREATE DATABASE miniblog;"
   psql -U tu_usuario -d miniblog -f db/setup.sql
   ```

5. Ejecuta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   El servidor quedará disponible en `http://localhost:3000`.

## 9. Cómo ejecutar los tests

Este proyecto usa **Vitest** para las pruebas unitarias. Para ejecutarlas:

```bash
npm test
```

Las pruebas cubren las funciones de validación (`validators/usuarios.js` y `validators/posts.js`) y los endpoints principales de la API.

## 10. Documentación OpenAPI

La documentación de la API se encuentra en el archivo `openapi.yaml`, en la raíz del repositorio. Puedes visualizarla de forma interactiva copiando su contenido en [Swagger Editor](https://editor.swagger.io/), o usando una extensión de OpenAPI/Swagger en tu editor.

## 11. Despliegue en Railway

El proyecto está desplegado en Railway, incluyendo tanto la API como la base de datos PostgreSQL.

**Pasos generales del despliegue:**

1. Se creó un proyecto en Railway y se conectó al repositorio de GitHub.
2. Se agregó un servicio de PostgreSQL dentro del mismo proyecto de Railway.
3. Se configuraron las variables de entorno en el panel de Railway (equivalentes a las de `.env`), usando la URL interna de conexión que Railway genera automáticamente para el servicio de base de datos.
4. Railway detecta el `package.json` y ejecuta `npm start` (o el comando configurado) para levantar el servidor automáticamente.
5. Railway expone una URL pública para acceder a la API desde internet.

**Demo desplegada:** [https://proyectom2brayangarcia-production.up.railway.app/](https://proyectom2brayangarcia-production.up.railway.app/)

## 12. Uso de la IA

Durante el desarrollo de este proyecto utilicé Claude (Anthropic) como tutor de aprendizaje, no como generador de código directo. El enfoque de trabajo fue: yo escribía el código, la IA revisaba, explicaba errores y guiaba el razonamiento paso a paso mediante preguntas, sin entregar soluciones completas de forma directa salvo en piezas repetitivas donde ya dominaba el patrón (por ejemplo, replicar el CRUD de usuarios en posts).

Ejemplos de prompts utilizados durante el desarrollo:

- *"Ensename y guíame hasta llegar al punto deseado, no quiero que me des el código resuelto de una sola vez"* → estableció la dinámica de tutoría para todo el proyecto.
- *"¿Cómo generar un servidor con Express?"* → guio la construcción paso a paso de `index.js`, explicando `require`, callbacks y `app.listen()`.
- *"Necesito entender la diferencia entre Pool y Client en PostgreSQL"* → explicó por qué usar `Pool` en una API web, basado en la lectura oficial del curso.
- *"¿Por qué mi validación no funciona si le paso !nombre en vez de nombre?"* → guio la corrección de errores de sintaxis y el entendimiento profundo del operador `!` (negación) y `||` (o) en JavaScript.
- *"¿Qué es un middleware?"* → explicó el concepto de manejo centralizado de errores antes de implementarlo.

## 13. Repositorio

- **Repositorio:** [https://github.com/BSGarcia01/ProyectoM2_BrayanGarcia](https://github.com/BSGarcia01/ProyectoM2_BrayanGarcia)
- **Demo desplegada (Railway):** [https://proyectom2brayangarcia-production.up.railway.app/](https://proyectom2brayangarcia-production.up.railway.app/)

## Autor

Bryan García

Redes sociales: @stivengarciac