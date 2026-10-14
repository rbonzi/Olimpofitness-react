import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Planes() {
  const navigate = useNavigate();

  // Catálogo de precios trasladado desde comprarPlanes.js
  const catalogoPrecios = {
    'plan-diario': 5000,
    'plan-mensual': 29900,
    'plan-trimestral': 75000,
    'plan-semestral': 138000,
    'plan-anual': 240000,
  };

  // Función equivalente a apretarBoton de tu script original
  const handleElegirPlan = (tipoPlan) => {
    const sesionActiva = localStorage.getItem('sesionOlimpo') === 'true';

    if (!sesionActiva) {
      // Si no ha iniciado sesión, redirige al Login
      navigate('/login');
    } else {
      const datosUsuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado')) || {};

      const posibleCompra = {
        nombrePlan: tipoPlan,
        beneficiario: datosUsuarioLogueado.nombre || 'Usuario Olimpo',
        precio: catalogoPrecios[tipoPlan] || 0,
      };

      // Guarda la posible compra en localStorage para usarla en el Checkout
      localStorage.setItem('posibleCompra', JSON.stringify(posibleCompra));

      // Navega a la vista de pago/checkout
      navigate('/checkout');
    }
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

      {/* CONTENEDOR DE TARJETAS DE PLANES */}
      <div className="contenedor-planes">
        {/* Plan 1: Clase Sola */}
        <div className="tarjeta-plan">
          <h2 className="titulo-plan">CLASE SOLA</h2>
          <h2 className="precio-plan">$5.000 <span className="detalle-mes">/día</span></h2>

          <div className="etiqueta-beneficios">BENEFICIOS:</div>

          <ul className="lista-beneficios">
            <li><strong>ACCESO POR 1 DÍA</strong></li>
            <li><strong>USO LIBRE DE MÁQUINAS</strong></li>
            <li><strong>SIN CONTRATO</strong></li>
          </ul>

          <button 
            className="boton-verde" 
            onClick={() => handleElegirPlan('plan-diario')}
          >
            ELEGIR PLAN
          </button>
        </div>

        {/* Plan 2: Mensual */}
        <div className="tarjeta-plan">
          <h2 className="titulo-plan">PLAN MENSUAL</h2>
          <h2 className="precio-plan">$29.990 <span className="detalle-mes">/mes</span></h2>

          <div className="etiqueta-beneficios">BENEFICIOS:</div>

          <ul className="lista-beneficios">
            <li><strong>MATRÍCULA GRATIS</strong></li>
            <li><strong>ACCESO ILIMITADO</strong> <br /> AL GIMNASIO</li>
            <li><strong>ACCESO ILIMITADO</strong> <br /> A CLASES GRUPALES</li>
          </ul>

          <button 
            className="boton-verde" 
            onClick={() => handleElegirPlan('plan-mensual')}
          >
            ELEGIR PLAN
          </button>
        </div>

        {/* Plan 3: Trimestral */}
        <div className="tarjeta-plan">
          <h2 className="titulo-plan">PLAN TRIMESTRAL</h2>
          <h2 className="precio-plan">$75.000 <span className="detalle-mes">/3 meses</span></h2>
          <p className="texto-ahorro">Equivale a $25.000 mensual</p>

          <div className="etiqueta-beneficios">BENEFICIOS:</div>

          <ul className="lista-beneficios">
            <li><strong>TODO LO DEL PLAN MENSUAL</strong></li>
            <li><strong>EVALUACIÓN NUTRICIONAL</strong></li>
            <li><strong>CONGELAMIENTO</strong> <br /> HASTA 15 DÍAS</li>
          </ul>

          <button 
            className="boton-verde" 
            onClick={() => handleElegirPlan('plan-trimestral')}
          >
            ELEGIR PLAN
          </button>
        </div>

        {/* Plan 4: Semestral */}
        <div className="tarjeta-plan">
          <div className="etiqueta-destacado">¡MÁS CONVENIENTE!</div>

          <h2 className="titulo-plan">PLAN SEMESTRAL</h2>
          <h2 className="precio-plan">$138.000 <span className="detalle-mes">/6 meses</span></h2>
          <p className="texto-ahorro">Equivale a $23.000 mensual</p>

          <div className="etiqueta-beneficios">BENEFICIOS:</div>

          <ul className="lista-beneficios">
            <li><strong>TODOS LOS BENEFICIOS</strong></li>
            <li><strong>EVALUACIÓN NUTRICIONAL</strong></li>
            <li><strong>CONGELAMIENTO</strong> <br /> HASTA 15 DÍAS</li>
          </ul>

          <button 
            className="boton-verde" 
            onClick={() => handleElegirPlan('plan-semestral')}
          >
            ELEGIR PLAN
          </button>
        </div>

        {/* Plan 5: Anual */}
        <div className="tarjeta-plan">
          <div className="etiqueta-destacado">¡MEJOR VALOR!</div>

          <h2 className="titulo-plan">PLAN ANUAL</h2>
          <h2 className="precio-plan">$240.000 <span className="detalle-mes">/año</span></h2>
          <p className="texto-ahorro">Equivale a $20.000 mensual</p>

          <div className="etiqueta-beneficios">BENEFICIOS:</div>

          <ul className="lista-beneficios">
            <li><strong>TODOS LOS BENEFICIOS</strong></li>
            <li><strong>CONGELAMIENTO</strong> <br /> HASTA 60 DÍAS</li>
            <li><strong>POLERA DE REGALO</strong></li>
          </ul>

          <button 
            className="boton-verde" 
            onClick={() => handleElegirPlan('plan-anual')}
          >
            ELEGIR PLAN
          </button>
        </div>
      </div>
    </div>
  );
}