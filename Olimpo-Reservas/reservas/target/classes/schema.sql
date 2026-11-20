CREATE TABLE IF NOT EXISTS clase (
  id INT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  capacidad INT NOT NULL
);
CREATE TABLE IF NOT EXISTS reserva (
  usuario_id BIGINT NOT NULL,
  clase_id INT NOT NULL,
  fecha DATE NOT NULL,
  PRIMARY KEY (usuario_id, clase_id),
  FOREIGN KEY (clase_id) REFERENCES clase(id)
);
INSERT IGNORE INTO clase VALUES
(1,'Crossfit - Lunes 09:00',10),(2,'Spinning - Lunes 18:00',10),
(3,'Yoga - Miércoles 10:00',10),(4,'Crossfit - Miércoles 19:00',10),
(5,'Boxeo - Viernes 11:00',10);
