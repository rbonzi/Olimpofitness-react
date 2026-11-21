import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { usuariosApi } from '../services/usuariosApi';
import { planesApi } from '../services/planesApi';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargarDatos = async () => {
      const token = sessionStorage.getItem('tokenOlimpo');

      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const perfil = await usuariosApi.miPerfil(token);

        if (perfil.rol?.toUpperCase() !== 'ADMIN') {
          throw new Error('No tienes permisos para acceder al panel.');
        }

        const [listaUsuarios, listaPlanes] = await Promise.all([
          usuariosApi.listarUsuarios(token),
          planesApi.listarPlanes(),
        ]);

        if (activo) {
          if (!Array.isArray(listaUsuarios)) {
            throw new Error('El servidor no devolvió una lista de usuarios válida.');
          }
          setUsuarios(listaUsuarios);
          setPlanes(Array.isArray(listaPlanes) ? listaPlanes : []);
        }
      } catch (err) {
        if (activo) {
          setError(err.message);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarDatos();

    return () => {
      activo = false;
    };
  }, [navigate]);

  // ================= GESTIÓN DE USUARIOS =================
  const handleEditarUsuario = async (user) => {
    const resultado = await Swal.fire({
      title: 'Editar usuario',
      html: `
        <input id="editar-nombre" class="swal2-input" placeholder="Nombre">
        <input id="editar-correo" type="email" class="swal2-input" placeholder="Correo">
      `,
      didOpen: () => {
        document.getElementById('editar-nombre').value = user.nombre;
        document.getElementById('editar-correo').value = user.correo;
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e9c009',
      background: '#1e1e1e',
      color: '#ffffff',
      preConfirm: () => {
        const nombre = document.getElementById('editar-nombre').value.trim();
        const correo = document.getElementById('editar-correo').value.trim();

        if (!nombre || !correo) {
          Swal.showValidationMessage('Nombre y correo son obligatorios.');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
          Swal.showValidationMessage('Ingresa un correo válido.');
          return false;
        }
        return { nombre, correo };
      },
    });

    if (!resultado.isConfirmed) return;

    const token = sessionStorage.getItem('tokenOlimpo');
    setProcesando(true);

    try {
      const actualizado = await usuariosApi.actualizarUsuario(
        user.id,
        resultado.value.nombre,
        resultado.value.correo,
        token
      );

      setUsuarios((actuales) =>
        actuales.map((u) => (u.id === user.id ? actualizado : u))
      );

      await Swal.fire({
        title: 'Usuario actualizado',
        icon: 'success',
        confirmButtonColor: '#e9c009',
      });
    } catch (err) {
      await Swal.fire({
        title: 'Error al actualizar',
        text: err.message,
        icon: 'error',
      });
    } finally {
      setProcesando(false);
    }
  };

  const handleEliminarUsuario = async (user) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Se eliminará la cuenta de ${user.nombre}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#E80000',
      background: '#1e1e1e',
      color: '#ffffff',
    });

    if (user.rol?.toUpperCase() === 'ADMIN') {
      await Swal.fire({
        title: 'Operación no permitida',
        text: 'No se pueden eliminar cuentas administradoras.',
        icon: 'warning',
      });
      return;
    }

    if (!confirmacion.isConfirmed) return;

    const token = sessionStorage.getItem('tokenOlimpo');
    setProcesando(true);

    try {
      await usuariosApi.eliminarUsuario(user.id, token);
      setUsuarios((actuales) => actuales.filter((u) => u.id !== user.id));

      await Swal.fire({
        title: 'Usuario eliminado',
        icon: 'success',
        confirmButtonColor: '#e9c009',
      });
    } catch (err) {
      await Swal.fire({
        title: 'Error al eliminar',
        text: err.message,
        icon: 'error',
      });
    } finally {
      setProcesando(false);
    }
  };

  // ================= GESTIÓN DE PLANES =================
  const handleCrearPlan = async () => {
    const resultado = await Swal.fire({
      title: 'Nuevo Plan Olimpo',
      html: `
        <input id="plan-nombre" class="swal2-input" placeholder="Nombre (ej: Plan Mensual)">
        <input id="plan-precio" type="number" class="swal2-input" placeholder="Precio (ej: 29990)">
        <input id="plan-duracion" type="number" class="swal2-input" placeholder="Duración en meses (0 = día, 1 = mes)">
        <input id="plan-descripcion" class="swal2-input" placeholder="Beneficios separados por coma">
      `,
      showCancelButton: true,
      confirmButtonText: 'Crear Plan',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e9c009',
      background: '#1e1e1e',
      color: '#ffffff',
      preConfirm: () => {
        const nombre = document.getElementById('plan-nombre').value.trim();
        const precio = parseFloat(document.getElementById('plan-precio').value);
        const duracionMeses = parseInt(document.getElementById('plan-duracion').value, 10);
        const descripcion = document.getElementById('plan-descripcion').value.trim();

        if (!nombre || isNaN(precio) || isNaN(duracionMeses) || !descripcion) {
          Swal.showValidationMessage('Todos los campos son obligatorios.');
          return false;
        }
        return { nombre, precio, duracionMeses, descripcion };
      },
    });

    if (!resultado.isConfirmed) return;

    const token = sessionStorage.getItem('tokenOlimpo');
    setProcesando(true);

    try {
      const creado = await planesApi.crearPlan(resultado.value, token);
      setPlanes((actuales) => [...actuales, creado]);

      await Swal.fire({
        title: 'Plan creado',
        icon: 'success',
        confirmButtonColor: '#e9c009',
      });
    } catch (err) {
      await Swal.fire({
        title: 'Error al crear plan',
        text: err.message,
        icon: 'error',
      });
    } finally {
      setProcesando(false);
    }
  };

  const handleEditarPlan = async (plan) => {
    const resultado = await Swal.fire({
      title: 'Editar Plan',
      html: `
        <input id="edit-plan-nombre" class="swal2-input" placeholder="Nombre">
        <input id="edit-plan-precio" type="number" class="swal2-input" placeholder="Precio">
        <input id="edit-plan-duracion" type="number" class="swal2-input" placeholder="Duración en meses">
        <input id="edit-plan-descripcion" class="swal2-input" placeholder="Beneficios separados por coma">
      `,
      didOpen: () => {
        document.getElementById('edit-plan-nombre').value = plan.nombre;
        document.getElementById('edit-plan-precio').value = plan.precio;
        document.getElementById('edit-plan-duracion').value = plan.duracionMeses;
        document.getElementById('edit-plan-descripcion').value = plan.descripcion;
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e9c009',
      background: '#1e1e1e',
      color: '#ffffff',
      preConfirm: () => {
        const nombre = document.getElementById('edit-plan-nombre').value.trim();
        const precio = parseFloat(document.getElementById('edit-plan-precio').value);
        const duracionMeses = parseInt(document.getElementById('edit-plan-duracion').value, 10);
        const descripcion = document.getElementById('edit-plan-descripcion').value.trim();

        if (!nombre || isNaN(precio) || isNaN(duracionMeses) || !descripcion) {
          Swal.showValidationMessage('Todos los campos son obligatorios.');
          return false;
        }
        return { nombre, precio, duracionMeses, descripcion };
      },
    });

    if (!resultado.isConfirmed) return;

    const token = sessionStorage.getItem('tokenOlimpo');
    setProcesando(true);

    try {
      const actualizado = await planesApi.actualizarPlan(plan.id, resultado.value, token);
      setPlanes((actuales) =>
        actuales.map((p) => (p.id === plan.id ? actualizado : p))
      );

      await Swal.fire({
        title: 'Plan actualizado',
        icon: 'success',
        confirmButtonColor: '#e9c009',
      });
    } catch (err) {
      await Swal.fire({
        title: 'Error al actualizar plan',
        text: err.message,
        icon: 'error',
      });
    } finally {
      setProcesando(false);
    }
  };

  const handleEliminarPlan = async (plan) => {
    const confirmacion = await Swal.fire({
      title: '¿Eliminar plan?',
      text: `Se eliminará "${plan.nombre}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#E80000',
      background: '#1e1e1e',
      color: '#ffffff',
    });

    if (!confirmacion.isConfirmed) return;

    const token = sessionStorage.getItem('tokenOlimpo');
    setProcesando(true);

    try {
      await planesApi.eliminarPlan(plan.id, token);
      setPlanes((actuales) => actuales.filter((p) => p.id !== plan.id));

      await Swal.fire({
        title: 'Plan eliminado',
        icon: 'success',
        confirmButtonColor: '#e9c009',
      });
    } catch (err) {
      await Swal.fire({
        title: 'Error al eliminar plan',
        text: err.message,
        icon: 'error',
      });
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <main className="contenedor-admin">
        <h1 className="titulo-admin">Cargando panel administrativo...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="contenedor-admin">
        <h1 className="titulo-admin">Acceso administrativo</h1>
        <p style={{ color: '#ff4d4d' }}>{error}</p>
        <button className="btn-editar" onClick={() => navigate('/perfil')}>
          Volver a mi perfil
        </button>
      </main>
    );
  }

  return (
    <main className="contenedor-admin">
      <h1 className="titulo-admin">Panel de Control General</h1>

      {/* Tarjetas de resumen */}
      <div className="tarjetas-resumen">
        <div className="tarjeta-dato">
          <h3>Planes Activos</h3>
          <p className="numero-grande">{planes.length}</p>
          <small>Conectado a MySQL</small>
        </div>

        <div className="tarjeta-dato">
          <h3>Nuevas Matrículas</h3>
          <p className="numero-grande">—</p>
          <small>Pendiente de integración</small>
        </div>

        <div className="tarjeta-dato">
          <h3>Usuarios Registrados</h3>
          <p className="numero-grande" id="contador-usuarios">
            {usuarios.length}
          </p>
        </div>
      </div>

      {/* Tabla de Planes */}
      <div className="seccion-tabla" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>Gestión de Planes</h2>
          <button
            className="btn-editar"
            style={{ background: '#28a745', color: '#ffffff' }}
            disabled={procesando}
            onClick={handleCrearPlan}
          >
            + Nuevo Plan
          </button>
        </div>

        <table className="tabla-admin">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Duración (Meses)</th>
              <th>Beneficios</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {planes.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No hay planes registrados. Crea uno con "+ Nuevo Plan".
                </td>
              </tr>
            ) : (
              planes.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.id}</td>
                  <td>{plan.nombre}</td>
                  <td>${Number(plan.precio).toLocaleString('es-CL')}</td>
                  <td>{plan.duracionMeses === 0 ? '1 Día' : `${plan.duracionMeses} mes(es)`}</td>
                  <td>{plan.descripcion}</td>
                  <td>
                    <button
                      className="btn-editar"
                      disabled={procesando}
                      onClick={() => handleEditarPlan(plan)}
                    >
                      Editar
                    </button>{' '}
                    <button
                      className="btn-editar"
                      style={{ background: '#E80000', color: '#ffffff' }}
                      disabled={procesando}
                      onClick={() => handleEliminarPlan(plan)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tabla de usuarios */}
      <div className="seccion-tabla">
        <h2>Gestión de Usuarios</h2>

        <table className="tabla-admin">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Cliente</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody id="tabla-usuarios">
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usuarios.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nombre}</td>
                  <td>{user.correo}</td>
                  <td>{user.rol}</td>

                  <td>
                    <button
                      className="btn-editar"
                      disabled={procesando}
                      onClick={() => handleEditarUsuario(user)}
                    >
                      Editar
                    </button>{' '}
                    {user.rol?.toUpperCase() !== 'ADMIN' ? (
                      <button
                        className="btn-editar"
                        style={{
                          background: '#E80000',
                          color: '#ffffff',
                        }}
                        disabled={procesando}
                        onClick={() => handleEliminarUsuario(user)}
                      >
                        Eliminar
                      </button>
                    ) : (
                      <span
                        style={{
                          color: '#e9c009',
                          fontWeight: 'bold',
                          fontSize: '12px',
                        }}
                      ></span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}