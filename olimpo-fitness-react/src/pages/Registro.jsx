import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Registro() {
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [clave1, setClave1] = useState('');
  const [clave2, setClave2] = useState('');

  // Estados para el mensaje de respuesta (error o éxito)
  const [mensaje, setMensaje] = useState('');
  const [esExito, setEsExito] = useState(false);

  // Función equivalente a registrarCuenta()
  const handleRegistrarCuenta = (e) => {
    e.preventDefault();

    // 1. Validar que las contraseñas coincidan
    if (clave1 !== clave2) {
      setMensaje('Las contraseñas no coinciden.');
      setEsExito(false);
      return;
    }

    // 2. Validar largo mínimo de contraseña
    if (clave1.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres.');
      setEsExito(false);
      return;
    }

    // 3. Obtener base de datos de usuarios de localStorage
    let usuariosGuardados = JSON.parse(localStorage.getItem('baseDatosOlimpo')) || [];

    // 4. Verificar si el correo ya existe
    const existeCorreo = usuariosGuardados.find(
      (user) => user.correo.toLowerCase() === correo.trim().toLowerCase()
    );

    if (existeCorreo) {
      setMensaje('Este correo ya está registrado. Intenta iniciar sesión.');
      setEsExito(false);
      return;
    }

    // 5. Crear el nuevo objeto de usuario
    const nuevoUsuario = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      clave: clave1,
      plan: 'Sin Plan Activo',
    };

    // 6. Guardar en localStorage
    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem('baseDatosOlimpo', JSON.stringify(usuariosGuardados));

    // 7. Mostrar mensaje de éxito y redireccionar a Login
    setEsExito(true);
    setMensaje('¡Cuenta creada con éxito! Redirigiendo...');

    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="contenedor-login">
      <div className="cuadro-login">
        <h2>REGISTRAR CUENTA</h2>

        <form onSubmit={handleRegistrarCuenta}>
          <input
            type="email"
            className="campo-texto"
            placeholder="Ingrese su correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <input
            type="text"
            className="campo-texto"
            placeholder="Ingrese su nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <input
            type="password"
            className="campo-texto"
            placeholder="Ingrese su contraseña"
            value={clave1}
            onChange={(e) => setClave1(e.target.value)}
            required
          />

          <input
            type="password"
            className="campo-texto"
            placeholder="Confirme su contraseña"
            value={clave2}
            onChange={(e) => setClave2(e.target.value)}
            required
          />

          <button type="submit" className="boton-entrar">
            CREAR CUENTA
          </button>

          {/* Mensaje dinámico de error o éxito */}
          {mensaje && (
            <p
              className="texto-registro"
              style={{
                color: esExito ? '#129b3a' : '#ff4d4d',
                marginTop: '10px',
                fontWeight: 'bold',
              }}
            >
              {mensaje}
            </p>
          )}

          <p className="texto-registro">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="btn-crear">
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}