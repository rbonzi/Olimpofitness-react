
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { usuariosApi } from '../services/usuariosApi';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargarUsuarios = async () => {
      const token = sessionStorage.getItem('tokenOlimpo');

      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        // Verificar el usuario autenticado
        const perfil = await usuariosApi.miPerfil(token);

        if (perfil.rol?.toUpperCase() !== 'ADMIN') {
          throw new Error(
            'No tienes permisos para acceder al panel.'
          );
        }

        // Consultar usuarios reales desde MySQL
        const lista = await usuariosApi.listarUsuarios(token);

        if (activo) {
          if (!Array.isArray(lista)) {
            throw new Error(
              'El servidor no devolvió una lista válida.'
            );
          }

          setUsuarios(lista);
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

    cargarUsuarios();

    return () => {
      activo = false;
    };
  }, [navigate]);

  const handleEditarUsuario = async (user) => {
    const resultado = await Swal.fire({
      title: 'Editar usuario',
      html: `
        <input
          id="editar-nombre"
          class="swal2-input"
          placeholder="Nombre"
        >
        <input
          id="editar-correo"
          type="email"
          class="swal2-input"
          placeholder="Correo"
        >
      `,
      didOpen: () => {
        document.getElementById('editar-nombre').value =
          user.nombre;

        document.getElementById('editar-correo').value =
          user.correo;
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e9c009',
      background: '#1e1e1e',
      color: '#ffffff',
      preConfirm: () => {
        const nombre = document
          .getElementById('editar-nombre')
          .value.trim();

        const correo = document
          .getElementById('editar-correo')
          .value.trim();

        if (!nombre || !correo) {
          Swal.showValidationMessage(
            'Nombre y correo son obligatorios.'
          );
          return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
          Swal.showValidationMessage(
            'Ingresa un correo válido.'
          );
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
        actuales.map((u) =>
          u.id === user.id ? actualizado : u
        )
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

      setUsuarios((actuales) =>
        actuales.filter((u) => u.id !== user.id)
      );

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

  if (cargando) {
    return (
      <main className="contenedor-admin">
        <h1 className="titulo-admin">
          Cargando panel administrativo...
        </h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="contenedor-admin">
        <h1 className="titulo-admin">
          Acceso administrativo
        </h1>

        <p style={{ color: '#ff4d4d' }}>
          {error}
        </p>

        <button
          className="btn-editar"
          onClick={() => navigate('/perfil')}
        >
          Volver a mi perfil
        </button>
      </main>
    );
  }

  return (
    <main className="contenedor-admin">
      <h1 className="titulo-admin">
        Panel de Control General
      </h1>

      {/* Tarjetas de resumen */}
      <div className="tarjetas-resumen">
        <div className="tarjeta-dato">
          <h3>Ventas del Día</h3>
          <p className="numero-grande">—</p>
          <small>Pendiente de integración</small>
        </div>

        <div className="tarjeta-dato">
          <h3>Nuevas Matrículas</h3>
          <p className="numero-grande">—</p>
          <small>Pendiente de integración</small>
        </div>

        <div className="tarjeta-dato">
          <h3>Usuarios Registrados</h3>
          <p
            className="numero-grande"
            id="contador-usuarios"
          >
            {usuarios.length}
          </p>
        </div>
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
                <td
                  colSpan="5"
                  style={{ textAlign: 'center' }}
                >
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
                      onClick={() =>
                        handleEditarUsuario(user)
                      }
                    >
                      Editar
                    </button>

                    {' '}

                    
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
                      >
                        
                      </span>
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
