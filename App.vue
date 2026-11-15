<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const enLinea = ref(navigator.onLine)
const actualizar = () => (enLinea.value = navigator.onLine)
onMounted(() => { addEventListener('online', actualizar); addEventListener('offline', actualizar) })
onUnmounted(() => { removeEventListener('online', actualizar); removeEventListener('offline', actualizar) })
</script>

<template>
  <a class="saltar" href="#contenido">Saltar al contenido</a>
  <header>
    <h1>Tareas</h1>
    <nav aria-label="Principal">
      <router-link to="/">Lista</router-link>
      <router-link to="/nueva">Nueva tarea</router-link>
    </nav>
  </header>
  <p v-if="!enLinea" class="aviso" role="status">Sin conexion: se muestran datos guardados y no se puede modificar.</p>
  <main id="contenido">
    <router-view :en-linea="enLinea" />
  </main>
</template>
