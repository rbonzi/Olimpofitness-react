import { reservasApi } from '../services/reservasApi';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuariosApi } from '../services/usuariosApi';

export default function Perfil() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [errorReservas, setErrorReservas] = useState('');
  const [misReservas, setMisReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    const cargarPerfil = async () => {
      // Obtener el JWT generado por Spring Boot
      const token = sessionStorage.getItem('tokenOlimpo');

      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        // Consultar datos reales del microservicio
        const datosUsuario = await usuariosApi.miPerfil(token);

        if (!activo) return;

        // Validar que el backend devolvió un usuario
        if (!datosUsuario || !datosUsuario.correo) {
          throw new Error(
            'El servidor no devolvió un perfil válido.'
          );
        }

        setUsuario(datosUsuario);

        try {
          const reservas = await reservasApi('/mis');
          if (activo) setMisReservas(reservas);
        } catch {
          if (activo) setErrorReservas('No se pudieron cargar las reservas.');
        }
      } catch (err) {
        if (!activo) return;

        setError(
          err.message || 'No se pudo cargar el perfil.'
        );
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarPerfil();

    return () => {
      activo = false;
    };
  }, [navigate]);

  // Mostrar carga mientras consulta Spring Boot
  if (cargando) {
    return (
      <main className="contenedor-perfil">
        <div className="tarjeta-perfil">
          <p style={{ color: '#e9c009', textAlign: 'center' }}>
            Cargando perfil...
          </p>
        </div>
      </main>
    );
  }

  // Mostrar error sin dejar una pantalla blanca
  if (error) {
    return (
      <main className="contenedor-perfil">
        <div className="tarjeta-perfil">
          <p style={{ color: '#ff4d4d', textAlign: 'center' }}>
            {error}
          </p>

          <button
            className="boton-entrar"
            onClick={() => navigate('/login')}
          >
            Volver al inicio de sesión
          </button>
        </div>
      </main>
    );
  }

  if (!usuario) return null;

  // El microservicio de usuarios todavía no
  // proporciona información de membresías
  const plan = usuario.plan || 'Sin Plan Activo';
  const esInactivo = plan === 'Sin Plan Activo';

  // Generar iniciales para el avatar
  const iniciales = usuario.nombre
    ? usuario.nombre
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'OF';

  return (
    <main className="contenedor-perfil">
      <div className="tarjeta-perfil">

        {/* Cabecera del perfil */}
        <div className="cabecera-perfil">
          <div className="avatar-usuario">
            <span>{iniciales}</span>
          </div>

          <h1 className="nombre-usuario" id="texto-nombre">
            {usuario.nombre}
          </h1>

          {esInactivo ? (
            <span
              className="badge-estado"
              id="badgeEstado"
              style={{
                background: '#e800004b',
                border: '1px solid #E80000',
                color: '#E80000',
              }}
            >
              Socio Inactivo
            </span>
          ) : (
            <span
              className="badge-estado"
              id="badgeEstado"
              style={{
                background: '#129b3a33',
                border: '1px solid #129b3a',
                color: '#129b3a',
              }}
            >
              Socio Activo
            </span>
          )}
        </div>

        <hr className="separador" />

        {/* Datos reales de Spring Boot */}
        <div className="seccion-datos">
          <h3 className="titulo-seccion">Datos Extra</h3>

          <div className="fila-dato">
            <span className="etiqueta-dato">Correo:</span>
            <span className="valor-dato" id="texto-correo">
              {usuario.correo}
            </span>
          </div>
        </div>

        <hr className="separador" />

        {/* Membresía pendiente de integración */}
        <div className="seccion-datos">
          <h3 className="titulo-seccion">
            Membresía Actual
          </h3>

          <div className="fila-dato">
            <span className="etiqueta-dato">Plan:</span>
            <span
              className="valor-dato plan-resaltado"
              id="texto-plan"
            >
              {esInactivo
                ? 'SIN PLAN ACTIVO'
                : plan.toUpperCase()}
            </span>
          </div>

          <div
            className="fila-dato"
            id="texto-vencimiento-2"
          >
            <span className="etiqueta-dato">
              Estado:
            </span>

            <span
              className={`valor-dato ${
                esInactivo ? '' : 'estado-al-dia'
              }`}
              id="texto-estado"
              style={{
                color: esInactivo
                  ? '#E80000'
                  : undefined,
              }}
            >
              {esInactivo ? 'INACTIVO' : 'Al día'}
            </span>
          </div>

          {usuario.fechaVencimiento && (
            <div
              className="fila-dato"
              id="texto-vencimiento"
            >
              <span className="etiqueta-dato">
                Vencimiento:
              </span>
              <span className="valor-dato">
                {usuario.fechaVencimiento}
              </span>
            </div>
          )}
        </div>

        <hr className="separador" />

        {/* Reservas locales pendientes de integrar */}
        <div className="seccion-datos">
          <h3 className="titulo-seccion">
            Mis Clases Reservadas
          </h3>

          <div id="lista-reservas">
            {misReservas.length === 0 ? (
              <span className="etiqueta-dato">
                {errorReservas || 'No tienes clases reservadas aún.'}
              </span>
            ) : (
              misReservas.map((reserva, index) => (
                <div
                  key={index}
                  className="fila-dato"
                  style={{
                    borderLeft: '3px solid #129b3a',
                    paddingLeft: '10px',
                    marginBottom: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span
                    className="valor-dato"
                    style={{ color: '#e9c009' }}
                  >
                    {reserva.clase}
                  </span>

                  <span
                    className="etiqueta-dato"
                    style={{ fontSize: '12px' }}
                  >
                    Generada el: {reserva.fechaReserva}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
