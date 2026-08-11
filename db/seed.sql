
TRUNCATE TABLE posts, usuarios RESTART IDENTITY;

INSERT INTO usuarios (nombre,email) VALUES ('Brian','brian@gmail.com'),
('carol','carol@gmail.com'),
('zahian','zahian@gmail.com');

INSERT INTO posts (titulo,contenido,usuario_id) VALUES ('carros','hace un mes no se venden los mismo 100 carros de siempre',1),
('motos','la tasa de deportistas en moto cada vez aumenta mas ',2),
('yates','la gente con mas dinero de lo comun estan comprando cada vesz mas yates',3);