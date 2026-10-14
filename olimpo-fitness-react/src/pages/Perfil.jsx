import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [misReservas, setMisReservas] = useState([]);

  useEffect(() => {
    // 1. Validar si hay una sesión activa
    const sesionActiva = localStorage.getItem('sesionOlimpo') === 'true';
    const datosUsuario = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (!sesionActiva || !datosUsuario) {
      navigate('/login');
      return;
    }

    setUsuario(datosUsuario);

    // 2. Cargar y filtrar el historial de reservas para este usuario
    const historialReservas = JSON.parse(localStorage.getItem('reservasOlimpo')) || [];
    const filtradas = historialReservas.filter(
      (reserva) => reserva.correo === datosUsuario.correo
    );
    setMisReservas(filtradas);
  }, [navigate]);

  if (!usuario) {
    return null; // O un indicador de carga mientras redirige
  }

  const esInactivo = !usuario.plan || usuario.plan === 'Sin Plan Activo';

  // Obtener las iniciales del usuario para el avatar
  const iniciales = usuario.nombre
    ? usuario.nombre
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'OF';

  return (
    <main className="contenedor-perfil">
      <div className="tarjeta-perfil">
        {/* Cabecera del Perfil */}
        <div className="cabecera-perfil">
          <div className="avatar-usuario">
            <span>{iniciales}</span>
          </div>
          <h1 className="nombre-usuario" id="texto-nombre">
            {usuario.nombre}
          </h1>

          {/* Badge de Estado Dinámico */}
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

        {/* Sección Datos Extra */}
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

        {/* Sección Membresía Actual */}
        <div className="seccion-datos">
          <h3 className="titulo-seccion">Membresía Actual</h3>

          <div className="fila-dato">
            <span className="etiqueta-dato">Plan:</span>
            <span className="valor-dato plan-resaltado" id="texto-plan">
              {esInactivo ? 'SIN PLAN ACTIVO' : usuario.plan.toUpperCase()}
            </span>
          </div>

          <div className="fila-dato" id="texto-vencimiento-2">
            <span className="etiqueta-dato">Estado:</span>
            <span
              className={`valor-dato ${esInactivo ? '' : 'estado-al-dia'}`}
              id="texto-estado"
              style={{ color: esInactivo ? '#E80000' : undefined }}
            >
              {esInactivo ? 'INACTIVO' : 'Al día'}
            </span>
          </div>

          {!esInactivo && (
            <div className="fila-dato" id="texto-vencimiento">
              <span className="etiqueta-dato">Vencimiento:</span>
              <span className="valor-dato">15 de Noviembre, 2026</span>
            </div>
          )}
        </div>

        <hr className="separador" />

        {/* Sección Clases Reservadas */}
        <div className="seccion-datos">
          <h3 className="titulo-seccion">Mis Clases Reservadas</h3>

          <div id="lista-reservas">
            {misReservas.length === 0 ? (
              <span className="etiqueta-dato">No tienes clases reservadas aún.</span>
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
                  <span className="valor-dato" style={{ color: '#e9c009' }}>
                    {reserva.clase}
                  </span>
                  <span className="etiqueta-dato" style={{ fontSize: '12px' }}>
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