export async function reservasApi(ruta, metodo = 'GET') {
  // Asegúrate de que 'tokenOlimpo' sea la misma clave que usa usuariosApi.js al hacer login
  const token = sessionStorage.getItem('tokenOlimpo');
  
  // Agregamos la URL absoluta hacia el puerto 8083
  const respuesta = await fetch('http://localhost:8083/api/reservas' + ruta, {
    method: metodo,
    headers: token ? { Authorization: 'Bearer ' + token } : {}
  });
  
  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}));
    throw new Error(datos.message || 'No se pudo consultar Reservas.');
  }
  
  if (metodo === 'GET') return respuesta.json();
}