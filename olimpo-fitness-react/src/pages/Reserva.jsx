import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Reservas() {
  const navigate = useNavigate();

  // Función equivalente a reservarClase()
  const handleReservarClase = (nombreClase) => {
    const sesionActiva = localStorage.getItem('sesionOlimpo');
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    // 1. Validar que la sesión esté activa
    if (sesionActiva !== 'true' || !usuarioLogueado) {
      Swal.fire({
        title: '¡Atención!',
        text: '¡Debes iniciar sesión para reservar una clase!',
        icon: 'warning',
        confirmButtonText: 'Ir a Iniciar Sesión',
        background: '#1e1e1e',
        color: '#ffffff',
        confirmButtonColor: '#ffcc00'
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    // 2. Validar si el usuario es administrador
    if (usuarioLogueado.rol === 'admin') {
      Swal.fire({
        title: 'Perfil Administrador',
        text: 'Eres el administrador, no necesitas reservar cupo.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        background: '#1e1e1e',
        color: '#ffffff',
        confirmButtonColor: '#ffcc00'
      });
      return;
    }

    // 3. Revisar el historial de reservas en localStorage
    let historialReservas = JSON.parse(localStorage.getItem('reservasOlimpo')) || [];

    const yaReservada = historialReservas.find(
      (reserva) => reserva.correo === usuarioLogueado.correo && reserva.clase === nombreClase
    );

    if (yaReservada) {
      Swal.fire({
        title: 'Reserva Existente',
        text: `Ya tienes una reserva activa para: ${nombreClase}`,
        icon: 'info',
        confirmButtonText: 'Aceptar',
        background: '#1e1e1e',
        color: '#ffffff',
        confirmButtonColor: '#ffcc00'
      });
      return;
    }

    // 4. Crear nueva reserva y guardar
    const nuevaReserva = {
      correo: usuarioLogueado.correo,
      nombre: usuarioLogueado.nombre,
      clase: nombreClase,
      fechaReserva: new Date().toLocaleDateString()
    };

    historialReservas.push(nuevaReserva);
    localStorage.setItem('reservasOlimpo', JSON.stringify(historialReservas));

    Swal.fire({
      title: '¡Reserva Exitosa!',
      text: `¡Éxito! Tu cupo para ${nombreClase} ha sido reservado.`,
      icon: 'success',
      confirmButtonText: 'Genial',
      background: '#1e1e1e',
      color: '#ffffff',
      confirmButtonColor: '#129b3a'
    });
  };

  return (
    <main className="contenedor-reservas">
      <div className="encabezado-planes">
        <h1 className="titulo-principal-planes">RESERVA TU CLASE</h1>
        <p className="subtitulo-sedes">
          Asegura tu cupo en nuestras disciplinas. Capacidad limitada.
        </p>
      </div>

      <div className="grilla-horarios">
        {/* LUNES */}
        <div className="dia-horario">
          <h3 className="titulo-dia">LUNES</h3>

          <div className="tarjeta-clase">
            <h4>Crossfit</h4>
            <p className="hora-clase">09:00 - 10:00</p>
            <p className="profe-clase">Prof: Carlos M.</p>
            <button
              className="btn-reservar"
              onClick={() => handleReservarClase('Crossfit - Lunes 09:00')}
            >
              RESERVAR
            </button>
          </div>

          <div className="tarjeta-clase">
            <h4>Spinning</h4>
            <p className="hora-clase">18:00 - 19:00</p>
            <p className="profe-clase">Prof: Andrea S.</p>
            <button
              className="btn-reservar"
              onClick={() => handleReservarClase('Spinning - Lunes 18:00')}
            >
              RESERVAR
            </button>
          </div>
        </div>

        {/* MIÉRCOLES */}
        <div className="dia-horario">
          <h3 className="titulo-dia">MIÉRCOLES</h3>

          <div className="tarjeta-clase">
            <h4>Yoga</h4>
            <p className="hora-clase">10:00 - 11:00</p>
            <p className="profe-clase">Prof: Valeria T.</p>
            <button
              className="btn-reservar"
              onClick={() => handleReservarClase('Yoga - Miércoles 10:00')}
            >
              RESERVAR
            </button>
          </div>

          <div className="tarjeta-clase">
            <h4>Crossfit</h4>
            <p className="hora-clase">19:00 - 20:00</p>
            <p className="profe-clase">Prof: Carlos M.</p>
            <button
              className="btn-reservar"
              onClick={() => handleReservarClase('Crossfit - Miércoles 19:00')}
            >
              RESERVAR
            </button>
          </div>
        </div>

        {/* VIERNES */}
        <div className="dia-horario">
          <h3 className="titulo-dia">VIERNES</h3>

          <div className="tarjeta-clase">
            <h4>Boxeo</h4>
            <p className="hora-clase">11:00 - 12:30</p>
            <p className="profe-clase">Prof: Luis F.</p>
            <button
              className="btn-reservar"
              onClick={() => handleReservarClase('Boxeo - Viernes 11:00')}
            >
              RESERVAR
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}