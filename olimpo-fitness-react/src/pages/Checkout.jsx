import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Checkout() {
  const navigate = useNavigate();
  const [compra, setCompra] = useState(null);
  const [procesando, setProcesando] = useState(false);

  // Carga los datos de la compra seleccionada desde localStorage
  useEffect(() => {
    const datosPosibleCompra = JSON.parse(localStorage.getItem('posibleCompra'));
    if (datosPosibleCompra) {
      setCompra(datosPosibleCompra);
    }
  }, []);

  // Función para actualizar datos en localStorage
  const actualizarDatoLocal = (clave, propiedad, nuevoValor) => {
    const objeto = JSON.parse(localStorage.getItem(clave));
    if (objeto) {
      objeto[propiedad] = nuevoValor;
      localStorage.setItem(clave, JSON.stringify(objeto));
    }
  };

  const actualizarBaseDatosUsuarios = (correoUsuario, propiedad, nuevoValor) => {
    let listaUsuarios = JSON.parse(localStorage.getItem('baseDatosOlimpo')) || [];
    listaUsuarios = listaUsuarios.map((user) => {
      if (user.correo === correoUsuario) {
        user[propiedad] = nuevoValor;
      }
      return user;
    });
    localStorage.setItem('baseDatosOlimpo', JSON.stringify(listaUsuarios));
  };

  // Confirmación del pago
  const handleConfirmarPago = () => {
    if (!compra) return;

    setProcesando(true);

    Swal.fire({
      title: '¡Pago Exitoso!',
      text: 'Ya puedes disfrutar de tu membresía.',
      icon: 'success',
      confirmButtonText: 'Ir a mi perfil',
      background: '#1e1e1e',
      color: '#ffffff',
      confirmButtonColor: '#ffcc00'
    }).then((result) => {
      if (result.isConfirmed) {
        const planFormateado = compra.nombrePlan.replace('-', ' ');

        // Actualizar sesión actual
        actualizarDatoLocal('usuarioLogueado', 'plan', planFormateado);

        // Actualizar base de datos general
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioLogueado'));
        if (usuarioActual && usuarioActual.correo) {
          actualizarBaseDatosUsuarios(usuarioActual.correo, 'plan', planFormateado);
        }

        // Limpiar la posible compra y redirigir al perfil
        localStorage.removeItem('posibleCompra');
        navigate('/perfil');
      } else {
        setProcesando(false);
      }
    });
  };

  if (!compra) {
    return (
      <main className="contenedor-pago">
        <div className="cuadro-pago">
          <h2>CONFIRMAR PAGO</h2>
          <p className="text-center my-4" style={{ color: '#fff' }}>
            No hay ningún plan seleccionado para procesar.
          </p>
          <button className="boton-amarillo" onClick={() => navigate('/planes')}>
            VER PLANES
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="contenedor-pago">
      <div className="cuadro-pago">
        <h2>CONFIRMAR PAGO</h2>

        <div className="fila-detalle">
          <span className="etiqueta">Beneficiario:</span>
          <span className="valor">{compra.beneficiario}</span>
        </div>

        <div className="fila-detalle">
          <span className="etiqueta">Tipo de Plan:</span>
          <span className="valor">
            {compra.nombrePlan ? compra.nombrePlan.replace('-', ' ') : ''}
          </span>
        </div>

        <div className="fila-detalle">
          <span className="etiqueta">Valor final:</span>
          <span className="valor">${compra.precio}</span>
        </div>

        <button 
          className="boton-amarillo" 
          onClick={handleConfirmarPago}
          disabled={procesando}
        >
          {procesando ? 'PROCESANDO PAGO...' : 'PROCEDER AL PAGO'}
        </button>
      </div>
    </main>
  );
}