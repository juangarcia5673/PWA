<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import EstadoVista from '../components/EstadoVista.vue'
import TareaItem from '../components/TareaItem.vue'
import { listarTareas, cambiarEstado, eliminarTarea } from '../services/api.js'

defineProps({ enLinea: Boolean })
const tareas = ref([])
const q = ref('')
const cargando = ref(false)
const error = ref('')
const mensaje = ref('')          // estado de exito
let controlador = null           // AbortController de la peticion en curso

async function cargar() {
  controlador?.abort()           // cancela la peticion anterior: evita condiciones de carrera
  controlador = new AbortController()
  const miControlador = controlador
  cargando.value = true; error.value = ''
  try {
    const datos = await listarTareas(q.value, miControlador.signal)
    tareas.value = datos
  } catch (e) {
    if (e.name === 'AbortError') return   // fue cancelada por otra mas nueva
    error.value = e.message
  } finally {
    if (controlador === miControlador) cargando.value = false
  }
}

let temporizador
watch(q, () => { clearTimeout(temporizador); temporizador = setTimeout(cargar, 300) })  // debounce
onMounted(cargar)
onBeforeUnmount(() => { controlador?.abort(); clearTimeout(temporizador) })

async function alternar(t) {
  try { await cambiarEstado(t.id, !t.completada); mensaje.value = 'Tarea actualizada'; await cargar() }
  catch (e) { error.value = e.message }
}
async function eliminar(t) {
  try { await eliminarTarea(t.id); mensaje.value = 'Tarea eliminada'; await cargar() }
  catch (e) { error.value = e.message }
}
</script>

<template>
  <section>
    <h2>Mis tareas</h2>
    <label class="buscador">Buscar <input v-model="q" type="search" placeholder="Titulo..." /></label>
    <p v-if="mensaje" class="exito" role="status">{{ mensaje }}</p>
    <EstadoVista :cargando="cargando" :error="error" :vacio="!tareas.length" @reintentar="cargar">
      <ul class="lista">
        <TareaItem v-for="t in tareas" :key="t.id" :tarea="t" :deshabilitado="!enLinea"
                   @alternar="alternar" @eliminar="eliminar" />
      </ul>
    </EstadoVista>
  </section>
</template>
