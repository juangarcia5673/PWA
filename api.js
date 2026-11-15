// Servicio HTTP central: TODA peticion de la app pasa por request().
export const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000'

export class ApiError extends Error {
  constructor(mensaje, estado) { super(mensaje); this.name = 'ApiError'; this.estado = estado }
}

async function request(ruta, { metodo = 'GET', cuerpo, signal } = {}) {
  let resp
  try {
    resp = await fetch(API_URL + ruta, {
      method: metodo,
      signal,                                           // permite cancelar la peticion
      headers: cuerpo ? { 'Content-Type': 'application/json' } : undefined,
      body: cuerpo ? JSON.stringify(cuerpo) : undefined
    })
  } catch (e) {
    if (e.name === 'AbortError') throw e               // cancelacion: no es un error para el usuario
    throw new ApiError('Sin conexion con el servidor', 0)
  }
  if (!resp.ok) {                                       // validar response.ok
    let msg = `Error ${resp.status}`
    try { msg = (await resp.json()).error?.mensaje || msg } catch { /* sin cuerpo JSON */ }
    throw new ApiError(msg, resp.status)
  }
  return resp.status === 204 ? null : resp.json()
}

export const listarTareas = (q = '', signal) => request(`/tareas?q=${encodeURIComponent(q)}`, { signal })
export const crearTarea = (titulo) => request('/tareas', { metodo: 'POST', cuerpo: { titulo } })
export const cambiarEstado = (id, completada) => request(`/tareas/${id}`, { metodo: 'PATCH', cuerpo: { completada } })
export const eliminarTarea = (id) => request(`/tareas/${id}`, { metodo: 'DELETE' })
