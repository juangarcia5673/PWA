import { describe, it, expect, vi, afterEach } from 'vitest'
import { listarTareas, crearTarea, ApiError } from '../src/services/api.js'

afterEach(() => vi.restoreAllMocks())
const respuesta = (estado, cuerpo) => ({ ok: estado >= 200 && estado < 300, status: estado, json: async () => cuerpo })

describe('servicio api', () => {
  it('devuelve el JSON cuando response.ok es true', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respuesta(200, [{ id: 1 }])))
    expect(await listarTareas('a')).toEqual([{ id: 1 }])
  })
  it('lanza ApiError con el mensaje del servidor si !ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respuesta(400, { error: { mensaje: 'Titulo invalido' } })))
    await expect(crearTarea('x')).rejects.toMatchObject({ estado: 400, message: 'Titulo invalido' })
  })
  it('traduce fallos de red a ApiError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fail')))
    await expect(listarTareas()).rejects.toBeInstanceOf(ApiError)
  })
  it('propaga AbortError sin convertirlo', async () => {
    const abort = Object.assign(new Error('x'), { name: 'AbortError' })
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abort))
    await expect(listarTareas('', undefined)).rejects.toMatchObject({ name: 'AbortError' })
  })
})
