const PLANES_URL = 'http://localhost:8080/api/planes'; // <-- Verifica que sea el puerto de microservicio-planes

export const planesApi = {
  async listarPlanes() {
    const res = await fetch(PLANES_URL);
    if (!res.ok) throw new Error('Error al obtener los planes.');
    return res.json();
  },

  async crearPlan(plan, token) {
    const res = await fetch(PLANES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(plan),
    });
    if (!res.ok) throw new Error('No se pudo crear el plan. Verifica tu sesión de Admin.');
    return res.json();
  },

  async actualizarPlan(id, plan, token) {
    const res = await fetch(`${PLANES_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(plan),
    });
    if (!res.ok) throw new Error('No se pudo actualizar el plan.');
    return res.json();
  },

  async eliminarPlan(id, token) {
    const res = await fetch(`${PLANES_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('No se pudo eliminar el plan.');
    return true;
  },
};