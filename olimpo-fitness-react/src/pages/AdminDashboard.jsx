import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([]);

  // Carga la lista de usuarios desde localStorage al cargar el componente
  useEffect(() => {
    const usuariosGuardados = JSON.parse(localStorage.getItem('baseDatosOlimpo')) || [];
    setUsuarios(usuariosGuardados);
  }, []);

  // Calcula dinámicamente cuántos usuarios tienen un plan activo
  const usuariosActivosCount = usuarios.filter(
    (user) => user.plan && user.plan !== 'Sin Plan Activo'
  ).length;

  // Función para editar el plan de un usuario en el estado y en localStorage
  const handleEditarPlan = (correoUsuario) => {
    const nuevoPlan = prompt('Ingrese el nuevo plan para este usuario:');
    if (!nuevoPlan) return;

    const usuariosActualizados = usuarios.map((user) => {
      if (user.correo === correoUsuario) {
        return { ...user, plan: nuevoPlan };
      }
      return user;
    });

    setUsuarios(usuariosActualizados);
    localStorage.setItem('baseDatosOlimpo', JSON.stringify(usuariosActualizados));
  };

  return (
    <main className="contenedor-admin">
      <h1 className="titulo-admin">Panel de Control General</h1>

      {/* Tarjetas de Resumen */}
      <div className="tarjetas-resumen">
        <div className="tarjeta-dato">
          <h3>Ventas del Día</h3>
          <p className="numero-grande">$185.000</p>
        </div>
        <div className="tarjeta-dato">
          <h3>Nuevas Matrículas</h3>
          <p className="numero-grande">12</p>
        </div>
        <div className="tarjeta-dato">
          <h3>Usuarios Activos</h3>
          <p className="numero-grande" id="contador-usuarios">
            {usuariosActivosCount}
          </p>
        </div>
      </div>

      {/* Sección de la Tabla */}
      <div className="seccion-tabla">
        <h2>Gestión de Suscripciones</h2>
        <table className="tabla-admin">
          <thead>
            <tr>
              <th>Nombre Cliente</th>
              <th>Correo</th>
              <th>Plan Actual</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody id="tabla-usuarios">
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No hay usuarios registrados aún.
                </td>
              </tr>
            ) : (
              usuarios.map((user, index) => {
                const tienePlanActivo = user.plan && user.plan !== 'Sin Plan Activo';
                const estadoClase = tienePlanActivo ? 'estado-activo' : 'estado-inactivo';
                const estadoTexto = tienePlanActivo ? 'Al día' : 'Inactivo';

                return (
                  <tr key={user.correo || index}>
                    <td>{user.nombre}</td>
                    <td>{user.correo}</td>
                    <td>{user.plan || 'Sin Plan Activo'}</td>
                    <td className={estadoClase}>{estadoTexto}</td>
                    <td>
                      <button 
                        className="btn-editar"
                        onClick={() => handleEditarPlan(user.correo)}
                      >
                        Editar Plan
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}