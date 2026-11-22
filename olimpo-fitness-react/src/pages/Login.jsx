
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usuariosApi } from '../services/usuariosApi';
import Swal from 'sweetalert2';

export default function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleIniciarSesion = async (e) => {
    e.preventDefault();

    if (cargando) return;

    setCargando(true);

    try {
      // Autenticación real con Spring Boot
      const respuesta = await usuariosApi.login(
        correo.trim(),
        clave
      );

      const { token, usuario } = respuesta;

      if (!token || !usuario) {
        throw new Error(
          'La respuesta del servidor no es válida.'
        );
      }

      // Guardar sesión y token JWT
      sessionStorage.setItem('tokenOlimpo', token);
      sessionStorage.setItem(
        'usuarioLogueado',
        JSON.stringify(usuario)
      );

      // Compatibilidad temporal con el frontend actual
      localStorage.setItem('sesionOlimpo', 'true');
      localStorage.setItem(
        'usuarioLogueado',
        JSON.stringify(usuario)
      );

      await Swal.fire({
        title: `¡Bienvenido/a, ${usuario.nombre}!`,
        text: 'Sesión iniciada correctamente.',
        icon: 'success',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#ffcc00',
        background: '#1e1e1e',
        color: '#ffffff',
      });

      // Redirigir según el rol de Spring Boot
      const destino =
        usuario.rol?.toUpperCase() === 'ADMIN'
          ? '/admin'
          : '/perfil';

      navigate(destino);

      // Actualizar componentes que leen la sesión
      window.location.reload();

    } catch (error) {
      await Swal.fire({
        title: 'Error de autenticación',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Reintentar',
        confirmButtonColor: '#ff4d4d',
        background: '#1e1e1e',
        color: '#ffffff',
      });

    } finally {
      setCargando(false);
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
            autoComplete="email"
            required
          />

          <input
            type="password"
            className="campo-texto"
            placeholder="Ingrese su contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            className="boton-entrar"
            disabled={cargando}
          >
            {cargando
              ? 'INICIANDO SESIÓN...'
              : 'INICIAR SESIÓN'}
          </button>

          <p className="texto-registro">
            ¿No tienes cuenta?{' '}
            <Link
              to="/registro"
              className="btn-crear"
            >
              Crear cuenta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
