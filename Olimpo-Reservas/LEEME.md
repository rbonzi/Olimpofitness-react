# Probar Reservas en Windows

1. En MySQL Workbench ejecuta `CREATE DATABASE IF NOT EXISTS olimpo_reservas CHARACTER SET utf8mb4;` con el usuario que usará la aplicación.
2. Arranca el microservicio de Usuarios en el puerto 8081.
3. Abre la carpeta reservas en el IDE como proyecto Maven (JDK 17 o superior). Configura DB_USER y DB_PASSWORD en las variables de entorno de la ejecución con tus datos de MySQL. Ejecuta Aplicacion.java. También puedes usar mvn spring-boot:run en esa carpeta.
4. Abre http://localhost:8083/api/reservas/clases y comprueba que aparecen cinco horarios.
5. Copia el contenido de react/src sobre el src de tu proyecto React. En vite.config.js agrega la siguiente entrada dentro del objeto server.proxy existente, antes de cualquier regla general para /api. Conserva las rutas de Usuarios y Planes.

```js
'/api/reservas': 'http://localhost:8083',
```

6. Reinicia Vite, inicia sesión como socio y reserva una clase. Comprueba que queda un cupo menos, que aparece en el perfil y que un segundo intento devuelve el aviso de duplicado. Con otro socio, el perfil debe mostrar sus propias reservas.

El controlador usa el token del login para pedir el ID del socio a Usuarios. MySQL guarda una inscripción por socio y horario fijo. La tabla clase contiene los cinco horarios del sitio y diez cupos de ejemplo por horario. Las reservas antiguas del navegador siguen en el dispositivo y no se importan al servidor.
