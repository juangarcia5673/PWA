// API REST minima (Node, sin dependencias) con el contrato que usa la SPA.
// Puede reemplazarse por la API de la Unidad 2 si expone las mismas rutas.
import { createServer } from 'node:http'

let tareas = [
  { id: 1, titulo: 'Leer documentacion de Vue 3', completada: true },
  { id: 2, titulo: 'Crear el service worker', completada: false },
  { id: 3, titulo: 'Escribir el informe tecnico', completada: false }
]
let siguiente = 4

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}
const enviar = (res, estado, cuerpo) => {
  res.writeHead(estado, { 'Content-Type': 'application/json', ...cors })
  res.end(cuerpo === undefined ? '' : JSON.stringify(cuerpo))
}
const error = (res, estado, mensaje) => enviar(res, estado, { error: { mensaje } }) // formato uniforme de errores
const leerJson = (req) => new Promise((ok) => {
  let b = ''
  req.on('data', (c) => (b += c))
  req.on('end', () => { try { ok(JSON.parse(b || '{}')) } catch { ok(null) } })
})

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const m = url.pathname.match(/^\/tareas(?:\/(\d+))?$/)
  if (req.method === 'OPTIONS') return enviar(res, 204)
  if (!m) return error(res, 404, 'Ruta no encontrada')
  const id = m[1] ? Number(m[1]) : null

  if (req.method === 'GET' && !id) {
    const q = (url.searchParams.get('q') || '').toLowerCase()
    await new Promise((r) => setTimeout(r, 400)) // latencia simulada: permite ver el estado "cargando"
    return enviar(res, 200, tareas.filter((t) => t.titulo.toLowerCase().includes(q)))
  }
  if (req.method === 'POST' && !id) {
    const d = await leerJson(req)
    if (!d || typeof d.titulo !== 'string' || d.titulo.trim().length < 3)
      return error(res, 400, 'El titulo es obligatorio (minimo 3 caracteres)')
    const t = { id: siguiente++, titulo: d.titulo.trim(), completada: false }
    tareas.push(t)
    return enviar(res, 201, t)
  }
  const t = tareas.find((x) => x.id === id)
  if (!t) return error(res, 404, 'Tarea no encontrada')
  if (req.method === 'PATCH') {
    const d = await leerJson(req)
    if (!d || typeof d.completada !== 'boolean') return error(res, 400, 'Campo "completada" invalido')
    t.completada = d.completada
    return enviar(res, 200, t)
  }
  if (req.method === 'DELETE') { tareas = tareas.filter((x) => x.id !== id); return enviar(res, 204) }
  return error(res, 405, 'Metodo no permitido')
}).listen(3000, () => console.log('API en http://localhost:3000/tareas'))
