const planesIniciales = [
  { id: 1, nombre: 'Plan Musculación', precio: 29990, categoria: 'Planes', descripcion: 'Acceso completo a máquinas' },
  { id: 2, nombre: 'Plan Personalizado', precio: 49990, categoria: 'Planes', descripcion: 'Incluye entrenador personal' },
  { id: 3, nombre: 'Plan Crossfit', precio: 34990, categoria: 'Planes', descripcion: 'Clases guiadas en grupo' }
];

// Inicializar la base de datos
export const inicializarBD = () => {
  if (!localStorage.getItem('planes')) {
    localStorage.setItem('planes', JSON.stringify(planesIniciales));
  }
};

// Obtener todos los planes
export const obtenerPlanes = () => {
  inicializarBD();
  return JSON.parse(localStorage.getItem('planes')) || [];
};

// Agregar un nuevo plan
export const agregarPlan = (nuevoPlan) => {
  const planes = obtenerPlanes();
  const planConId = { ...nuevoPlan, id: Date.now() };
  planes.push(planConId);
  localStorage.setItem('planes', JSON.stringify(planes));
  return planConId;
};

// Eliminar plan
export const eliminarPlan = (id) => {
  let planes = obtenerPlanes();
  planes = planes.filter(p => p.id !== Number(id));
  localStorage.setItem('planes', JSON.stringify(planes));
};