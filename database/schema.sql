CREATE DATABASE IF NOT EXISTS videojuegos_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE videojuegos_db;

-- Categorías (para el filtro con JavaScript)
CREATE TABLE generos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Clasificación por edad (ESRB)
CREATE TABLE clasificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(5) NOT NULL UNIQUE,
  nombre VARCHAR(50) NOT NULL,
  edad_minima INT NOT NULL,
  descripcion VARCHAR(150)
);

-- Usuarios (login admin/user)
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,          -- SIEMPRE hasheada (bcrypt)
  rol ENUM('admin','user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Juegos (el CRUD principal)
CREATE TABLE juegos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(120) NOT NULL,
  descripcion TEXT,
  imagen_url VARCHAR(255),
  precio DECIMAL(10,2) DEFAULT 0,
  fecha_lanzamiento DATE,                   -- para el filtro por fechas
  desarrollador VARCHAR(100),
  genero_id INT,
  clasificacion_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (genero_id) REFERENCES generos(id),
  FOREIGN KEY (clasificacion_id) REFERENCES clasificaciones(id)
);

-- ===== Datos de ejemplo =====
INSERT INTO generos (nombre) VALUES
('Acción'),('Aventura'),('RPG'),('Shooter'),('Deportes'),('Terror');

INSERT INTO clasificaciones (codigo, nombre, edad_minima, descripcion) VALUES
('E','Para todos',0,'Apto para cualquier edad'),
('T','Adolescentes',13,'Contenido para +13'),
('M','Maduro',17,'Contenido para +17'),
('AO','Solo adultos',18,'Mayores de edad (+18)');

-- Nota: imagen_url usa placeholders de picsum.photos por ahora.
-- Reemplázalos por tus propias imágenes cuando las tengas listas
-- (puedes subirlas a un servicio como Cloudinary/Imgur y pegar la URL,
-- o servir imágenes locales desde una carpeta /public del frontend).
INSERT INTO juegos (titulo, descripcion, imagen_url, precio, fecha_lanzamiento, desarrollador, genero_id, clasificacion_id) VALUES
('God of War Ragnarök','Kratos y Atreus enfrentan el Ragnarök nórdico.','https://picsum.photos/seed/god-of-war-ragnarok/600/400', 1599.00,'2022-11-09','Santa Monica',1,3),
('The Last of Us Part II','Aventura post-apocalíptica de venganza.','https://picsum.photos/seed/last-of-us-2/600/400', 1499.00,'2020-06-19','Naughty Dog',2,3),
('Elden Ring','RPG de mundo abierto de FromSoftware.','https://picsum.photos/seed/elden-ring/600/400', 1299.00,'2022-02-25','FromSoftware',3,3),
('FIFA 23','Simulador de fútbol.','https://picsum.photos/seed/fifa-23/600/400', 1399.00,'2022-09-30','EA Sports',5,1),
('Resident Evil 4 Remake','Survival horror clásico renovado.','https://picsum.photos/seed/resident-evil-4/600/400', 1499.00,'2023-03-24','Capcom',6,3);
