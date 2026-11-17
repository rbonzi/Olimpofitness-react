
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const [sesionActiva, setSesionActiva] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  useEffect(() => {
    const verificarSesion = () => {
      const token = sessionStorage.getItem('tokenOlimpo');
      const datosUsuario = sessionStorage.getItem(
        'usuarioLogueado'
      );

      if (!token || !datosUsuario) {
        setSesionActiva(false);
        setUsuarioLogueado(null);
        return;
      }

      try {
        const usuario = JSON.parse(datosUsuario);

        setSesionActiva(true);
        setUsuarioLogueado(usuario);
      } catch {
        setSesionActiva(false);
        setUsuarioLogueado(null);
      }
    };

    verificarSesion();

    window.addEventListener('storage', verificarSesion);

    return () => {
      window.removeEventListener('storage', verificarSesion);
    };
  }, []);

  const cerrarSesion = (e) => {
    e.preventDefault();

    // Eliminar token JWT y datos de sesión
    sessionStorage.removeItem('tokenOlimpo');
    sessionStorage.removeItem('usuarioLogueado');

    // Eliminar compatibilidad con el sistema anterior
    localStorage.removeItem('sesionOlimpo');
    localStorage.removeItem('usuarioLogueado');

    setSesionActiva(false);
    setUsuarioLogueado(null);

    navigate('/');
  };

  const esAdmin =
    usuarioLogueado?.rol?.toUpperCase() === 'ADMIN';

  return (
    <nav className="barra-navegacion">
      <div className="contenedor-botones">

        <Link to="/">
          <img
            src="/Imagenes/logo-blanco.png"
            alt="Logo gimnasio"
            className="logo"
          />
        </Link>

        {/* Enlaces principales */}
        <Link to="/" className="boton-texto">
          INICIO
        </Link>

        <Link to="/planes" className="boton-texto">
          PLANES
        </Link>

        <Link to="/reservas" className="boton-texto">
          RESERVAS
        </Link>

        <Link to="/nosotros" className="boton-texto">
          SOBRE NOSOTROS
        </Link>

        <Link to="/faq" className="boton-texto">
          PREGUNTAS FRECUENTES
        </Link>

        {/* Usuario sin sesión */}
        {!sesionActiva && (
          <Link
            to="/login"
            className="boton-texto"
            id="link-login"
          >
            INICIAR SESIÓN
          </Link>
        )}

        {/* Usuario autenticado */}
        {sesionActiva && (
          <>
            {/* Acceso permanente al panel ADMIN */}
            {esAdmin && (
              <Link
                to="/admin"
                className="boton-texto"
                id="link-admin"
                style={{ color: '#e9c009' }}
              >
                ZONA ADMIN
              </Link>
            )}

            {/* Perfil para clientes y administradores */}
            <Link
              to="/perfil"
              className="boton-texto"
              id="link-perfil"
            >
              MI PERFIL
            </Link>

            {/* Cerrar sesión */}
            <a
              href="#"
              onClick={cerrarSesion}
              className="boton-texto"
              id="link-logout"
              style={{ color: '#ff4d4d' }}
            >
              CERRAR SESIÓN
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
