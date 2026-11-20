import { reservasApi } from '../services/reservasApi';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Reservas() {
  const navigate = useNavigate();

  const [clases, setClases] = React.useState([]);
  const [error, setError] = React.useState('');

  async function cargarClases() {
    try {
      setClases(await reservasApi('/clases'));
      setError('');
    } catch {
      setError('No se pudieron cargar los cupos.');
    }
  }

  React.useEffect(() => { cargarClases(); }, []);

  async function handleReservarClase(id) {
    if (!sessionStorage.getItem('tokenOlimpo')) {
      navigate('/login');
      return;
    }
    try {
      await reservasApi('/clases/' + id, 'POST');
      await Swal.fire('Reserva confirmada', 'Puedes verla en tu perfil.', 'success');
    } catch (error) {
      await Swal.fire('Reserva pendiente', error.message, 'warning');
    }
    cargarClases();
  }
  return (
    <main className="contenedor-reservas">
      <div className="encabezado-planes">
        <h1 className="titulo-principal-planes">RESERVA TU CLASE</h1>
        <p className="subtitulo-sedes">
          Asegura tu cupo en nuestras disciplinas. Capacidad limitada.
        </p>
      </div>

      {error && <p role="alert">{error} <button onClick={cargarClases}>Reintentar</button></p>}
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
              disabled={!(clases.find(c => c.id === 1)?.disponibles > 0)}
              onClick={() => handleReservarClase(1)}
            >
              Reservar ({clases.find(c => c.id === 1)?.disponibles ?? '…'} cupos)
            </button>
          </div>

          <div className="tarjeta-clase">
            <h4>Spinning</h4>
            <p className="hora-clase">18:00 - 19:00</p>
            <p className="profe-clase">Prof: Andrea S.</p>
            <button
              className="btn-reservar"
              disabled={!(clases.find(c => c.id === 2)?.disponibles > 0)}
              onClick={() => handleReservarClase(2)}
            >
              Reservar ({clases.find(c => c.id === 2)?.disponibles ?? '…'} cupos)
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
              disabled={!(clases.find(c => c.id === 3)?.disponibles > 0)}
              onClick={() => handleReservarClase(3)}
            >
              Reservar ({clases.find(c => c.id === 3)?.disponibles ?? '…'} cupos)
            </button>
          </div>

          <div className="tarjeta-clase">
            <h4>Crossfit</h4>
            <p className="hora-clase">19:00 - 20:00</p>
            <p className="profe-clase">Prof: Carlos M.</p>
            <button
              className="btn-reservar"
              disabled={!(clases.find(c => c.id === 4)?.disponibles > 0)}
              onClick={() => handleReservarClase(4)}
            >
              Reservar ({clases.find(c => c.id === 4)?.disponibles ?? '…'} cupos)
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
              disabled={!(clases.find(c => c.id === 5)?.disponibles > 0)}
              onClick={() => handleReservarClase(5)}
            >
              Reservar ({clases.find(c => c.id === 5)?.disponibles ?? '…'} cupos)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}