
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS usuarios;


CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR (100) NOT NULL,
    email VARCHAR (100) UNIQUE NOT NULL
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id)
);



