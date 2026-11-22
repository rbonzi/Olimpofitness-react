import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Planes() {
  const navigate = useNavigate();
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Asegúrate de que el puerto coincida con el de tu microservicio-planes (8080 u 8081)
  const API_URL = 'http://localhost:8080/api/planes';

  useEffect(() => {
    const obtenerPlanes = async () => {
      try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
          throw new Error('No se pudieron cargar los planes desde el servidor');
        }
        const datos = await respuesta.json();
        setPlanes(datos);
      } catch (err) {
        console.error('Error al traer planes:', err);
        setError('Error de conexión con el servidor de planes.');
      } finally {
        setCargando(false);
      }
    };

    obtenerPlanes();
  }, []);

  // Mantiene intacta tu lógica original de sesión y checkout
  const handleElegirPlan = (plan) => {
    const sesionActiva = localStorage.getItem('sesionOlimpo') === 'true';

    if (!sesionActiva) {
      navigate('/login');
    } else {
      const datosUsuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')) || {};

      const posibleCompra = {
        idPlan: plan.id,
        nombrePlan: plan.nombre,
        beneficiario: datosUsuarioLogueado.nombre || 'Usuario Olimpo',
        precio: plan.precio || 0,
      };

      localStorage.setItem('posibleCompra', JSON.stringify(posibleCompra));
      navigate('/checkout');
    }
  };

  // Formatea el texto de duración según duracionMeses
  const formatearDuracion = (meses) => {
    if (!meses || meses === 0) return '/día';
    if (meses === 1) return '/mes';
    if (meses === 12) return '/año';
    return `/${meses} meses`;
  };

  return (
    <div>
      {/* ZONA DEL TÍTULO PRINCIPAL */}
      <div className="encabezado-planes">
        <h1 className="titulo-principal-planes">PLANES OLIMPO</h1>

        <h3 className="subtitulo-sedes">
          <span className="texto-resalte">NUESTRAS SEDES</span> VENTANAS • QUINTERO • VALPARAÍSO • VIÑA DEL MAR
        </h3>

        <h2 className="texto-multisede">
          TODOS LOS PLANES POSEEN <br />
          <span className="destacado-blanco">ACCESO MULTISEDE</span>
        </h2>
      </div>

      {/* CONTENEDOR DE TARJETAS DE PLANES DESDE MYSQL */}
      <div className="contenedor-planes">
        {cargando && <p style={{ color: 'white', textAlign: 'center' }}>Cargando planes disponibles...</p>}
        
        {error && <p style={{ color: '#ff4d4d', textAlign: 'center' }}>{error}</p>}

        {!cargando && !error && planes.length === 0 && (
          <p style={{ color: 'white', textAlign: 'center' }}>Aún no hay planes registrados en la base de datos.</p>
        )}

        {!cargando && !error && planes.map((plan) => (
          <div className="tarjeta-plan" key={plan.id}>
            <h2 className="titulo-plan">{plan.nombre?.toUpperCase()}</h2>
            
            <h2 className="precio-plan">
              ${Number(plan.precio).toLocaleString('es-CL')}{' '}
              <span className="detalle-mes">{formatearDuracion(plan.duracionMeses)}</span>
            </h2>

            {plan.duracionMeses > 1 && (
              <p className="texto-ahorro">
                Equivale a ${Math.round(plan.precio / plan.duracionMeses).toLocaleString('es-CL')} mensual
              </p>
            )}

            <div className="etiqueta-beneficios">BENEFICIOS:</div>

            <ul className="lista-beneficios">
              {plan.descripcion
                ? plan.descripcion.split(',').map((beneficio, index) => (
                    <li key={index}>
                      <strong>{beneficio.trim().toUpperCase()}</strong>
                    </li>
                  ))
                : <li><strong>ACCESO MULTISEDE</strong></li>
              }
            </ul>

            <button
              className="boton-verde"
              onClick={() => handleElegirPlan(plan)}
            >
              ELEGIR PLAN
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}