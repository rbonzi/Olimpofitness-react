
const API_URL = '/api/usuarios';

async function peticion(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...opciones.headers,
    },
  });

  const texto = await respuesta.text();
  let datos = null;

  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = { mensaje: texto };
    }
  }

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      throw new Error(
        ruta === '/login'
          ? 'Correo o contraseña incorrectos.'
          : 'Tu sesión ha vencido. Inicia sesión nuevamente.'
      );
    }

    if (respuesta.status === 403) {
      throw new Error(
        'No tienes permisos para realizar esta operación.'
      );
    }

    throw new Error(
      datos?.error ||
      datos?.mensaje ||
      `Error del servidor (${respuesta.status})`
    );
  }

  return datos;
}

function autorizacion(token) {
  if (!token) {
    throw new Error('Debes iniciar sesión.');
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export const usuariosApi = {
  registrar: (nombre, correo, contrasena) =>
    peticion('/registro', {
      method: 'POST',
      body: JSON.stringify({
        nombre,
        correo,
        contrasena,
      }),
    }),

  login: (correo, contrasena) =>
    peticion('/login', {
      method: 'POST',
      body: JSON.stringify({
        correo,
        contrasena,
      }),
    }),

  miPerfil: (token) =>
    peticion('/me', {
      headers: autorizacion(token),
    }),

  listarUsuarios: (token) =>
    peticion('/admin', {
      headers: autorizacion(token),
    }),

  obtenerUsuario: (id, token) =>
    peticion(`/admin/${id}`, {
      headers: autorizacion(token),
    }),

  actualizarUsuario: (id, nombre, correo, token) =>
    peticion(`/admin/${id}`, {
      method: 'PUT',
      headers: autorizacion(token),
      body: JSON.stringify({
        nombre,
        correo,
      }),
    }),

  eliminarUsuario: (id, token) =>
    peticion(`/admin/${id}`, {
      method: 'DELETE',
      headers: autorizacion(token),
    }),
};
