import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');

  const handleIniciarSesion = (e) => {
    e.preventDefault();
    const correoTrimmed = correo.trim();

    // 1. CREDENCIALES DIRECTAS DE ADMINISTRADOR
    if (correoTrimmed === 'admin@olimpo.cl' && clave === 'admin123') {
      const usuarioAdmin = {
        nombre: 'Administrador Principal',
        correo: correoTrimmed,
        rol: 'admin',
        plan: 'Dueño del Gimnasio',
      };

      localStorage.setItem('sesionOlimpo', 'true');
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioAdmin));

      Swal.fire({
        title: '¡Bienvenido, Administrador!',
        text: 'Accediendo al Panel de Control...',
        icon: 'success',
        confirmButtonText: 'Ir a Admin',
        background: '#1e1e1e',
        color: '#ffffff',
        confirmButtonColor: '#ffcc00',
      }).then(() => {
        navigate('/admin');
        window.location.reload();
      });
      return;
    }

    // 2. BÚSQUEDA DE USUARIO NORMAL REGISTRADO
    const listaUsuarios = JSON.parse(localStorage.getItem('baseDatosOlimpo')) || [];

    const usuarioEncontrado = listaUsuarios.find(
      (user) => user.correo.toLowerCase() === correoTrimmed.toLowerCase() && user.clave === clave
    );

    if (usuarioEncontrado) {
      localStorage.setItem('sesionOlimpo', 'true');
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));

      Swal.fire({
        title: `¡Bienvenido/a, ${usuarioEncontrado.nombre}!`,
        text: 'Sesión iniciada con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        background: '#1e1e1e',
        color: '#ffffff',
        confirmButtonColor: '#ffcc00',
      }).then(() => {
        navigate('/perfil');
        window.location.reload();
      });
    } else {
      Swal.fire({
        title: 'Error de Autenticación',
        text: 'Correo o contraseña incorrectos. Por favor verifica tus datos.',
        icon: 'error',
        confirmButtonText: 'Reintentar',
        background: '#1e1e1e',
        color: '#ffffff',
        confirmButtonColor: '#ff4d4d',
      });
    }
  };

  return (
    <div className="contenedor-login">
      <div className="cuadro-login">
        <h2>INICIAR SESIÓN</h2>

        <form onSubmit={handleIniciarSesion}>
          <input
            type="email"
            className="campo-texto"
            placeholder="Ingrese su correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <input
            type="password"
            className="campo-texto"
            placeholder="Ingrese su contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />

          <button type="submit" className="boton-entrar">
            INICIAR SESIÓN
          </button>

          <p className="texto-registro">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="btn-crear">
              Crear cuenta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}