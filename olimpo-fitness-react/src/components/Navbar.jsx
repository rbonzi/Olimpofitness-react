import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  
  // Estados para manejar la sesión en tiempo real
  const [sesionActiva, setSesionActiva] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  // Revisa la sesión en localStorage al cargar el componente
  useEffect(() => {
    const sesion = localStorage.getItem('sesionOlimpo') === 'true';
    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));

    setSesionActiva(sesion);
    setUsuarioLogueado(usuario);
  }, []);

  // Función para cerrar sesión
  const cerrarSesion = (e) => {
    e.preventDefault();
    localStorage.removeItem('sesionOlimpo');
    localStorage.removeItem('usuarioLogueado');
    setSesionActiva(false);
    setUsuarioLogueado(null);
    navigate('/'); // Redirige al inicio sin recargar la página
  };

  return (
    <nav className="barra-navegacion">
      <nav className="contenedor-botones">
        <Link to="/">
          <img src="/Imagenes/logo-blanco.png" alt="Logo gimnasio" className="logo" />
        </Link>

        {/* Enlaces navegables principales */}
        <Link to="/" className="boton-texto"> INICIO </Link>
        <Link to="/planes" className="boton-texto"> PLANES </Link>
        <Link to="/reservas" className="boton-texto"> RESERVAS </Link>
        <Link to="/nosotros" className="boton-texto"> SOBRE NOSOTROS </Link>
        <Link to="/faq" className="boton-texto"> PREGUNTAS FRECUENTES </Link>

        {/* SI NO HAY SESIÓN ACTIVA: Muestra "INICIAR SESIÓN" */}
        {!sesionActiva && (
          <Link to="/login" className="boton-texto" id="link-login">
            INICIAR SESIÓN
          </Link>
        )}

        {/* SI HAY SESIÓN ACTIVA: Muestra Perfil/Admin y Cerrar Sesión */}
        {sesionActiva && (
          <>
            {usuarioLogueado && usuarioLogueado.rol === 'admin' ? (
              /* Si el rol es admin */
              <Link to="/admin" className="boton-texto" id="link-admin" style={{ color: '#e9c009' }}>
                ZONA ADMIN
              </Link>
            ) : (
              /* Si el rol es usuario normal */
              <Link to="/perfil" className="boton-texto" id="link-perfil">
                MI PERFIL
              </Link>
            )}

            {/* Botón Cerrar Sesión */}
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
      </nav>
    </nav>
  );
}