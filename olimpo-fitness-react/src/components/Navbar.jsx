import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const [sesionActiva, setSesionActiva] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const verificarSesion = () => {
      const token = sessionStorage.getItem('tokenOlimpo');
      const datosUsuario = sessionStorage.getItem('usuarioLogueado');

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

    sessionStorage.removeItem('tokenOlimpo');
    sessionStorage.removeItem('usuarioLogueado');
    localStorage.removeItem('sesionOlimpo');
    localStorage.removeItem('usuarioLogueado');

    setSesionActiva(false);
    setUsuarioLogueado(null);
    setMenuAbierto(false);

    navigate('/');
  };

  const cerrarMenu = () => setMenuAbierto(false);

  const esAdmin = usuarioLogueado?.rol?.toUpperCase() === 'ADMIN';

  return (
    <nav className="barra-navegacion">
      <div className="navbar-header">
        <Link to="/" onClick={cerrarMenu}>
          <img
            src="/Imagenes/logo-blanco.png"
            alt="Logo gimnasio"
            className="logo"
          />
        </Link>

        {/* Botón hamburguesa visible solo en pantallas chicas */}
        <button
          type="button"
          className="boton-hamburguesa"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          {menuAbierto ? '✕' : '☰'}
        </button>
      </div>

      <div className={`contenedor-botones ${menuAbierto ? 'abierto' : ''}`}>
        <Link to="/" className="boton-texto" onClick={cerrarMenu}>
          INICIO
        </Link>

        <Link to="/planes" className="boton-texto" onClick={cerrarMenu}>
          PLANES
        </Link>

        <Link to="/reservas" className="boton-texto" onClick={cerrarMenu}>
          RESERVAS
        </Link>

        <Link to="/nosotros" className="boton-texto" onClick={cerrarMenu}>
          SOBRE NOSOTROS
        </Link>

        <Link to="/faq" className="boton-texto" onClick={cerrarMenu}>
          PREGUNTAS FRECUENTES
        </Link>

        {!sesionActiva && (
          <Link
            to="/login"
            className="boton-texto"
            id="link-login"
            onClick={cerrarMenu}
          >
            INICIAR SESIÓN
          </Link>
        )}

        {sesionActiva && (
          <>
            {esAdmin && (
              <Link
                to="/admin"
                className="boton-texto"
                id="link-admin"
                style={{ color: '#e9c009' }}
                onClick={cerrarMenu}
              >
                ZONA ADMIN
              </Link>
            )}

            <Link
              to="/perfil"
              className="boton-texto"
              id="link-perfil"
              onClick={cerrarMenu}
            >
              MI PERFIL
            </Link>

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