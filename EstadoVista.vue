<script setup>
// Muestra UNO de los estados: cargando | error | vacio. Si no aplica, muestra el contenido (slot).
defineProps({ cargando: Boolean, error: String, vacio: Boolean })
defineEmits(['reintentar'])
</script>

<template>
  <div aria-live="polite">
    <p v-if="cargando" class="estado">Cargando...</p>
    <div v-else-if="error" class="estado error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="$emit('reintentar')">Reintentar</button>
    </div>
    <p v-else-if="vacio" class="estado">No hay tareas para mostrar.</p>
    <slot v-else />
  </div>
</template>
