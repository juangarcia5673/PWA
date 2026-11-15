<script setup>
// Componente "tonto": recibe datos por props y avisa con eventos. No llama a la API ni muta props.
defineProps({ tarea: { type: Object, required: true }, deshabilitado: Boolean })
defineEmits(['alternar', 'eliminar'])
</script>

<template>
  <li :class="{ hecha: tarea.completada }">
    <label>
      <input type="checkbox" :checked="tarea.completada" :disabled="deshabilitado"
             @change="$emit('alternar', tarea)" />
      <span>{{ tarea.titulo }}</span>
    </label>
    <button type="button" :disabled="deshabilitado" :aria-label="`Eliminar ${tarea.titulo}`"
            @click="$emit('eliminar', tarea)">Eliminar</button>
  </li>
</template>
