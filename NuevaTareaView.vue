<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { crearTarea } from '../services/api.js'

defineProps({ enLinea: Boolean })
const router = useRouter()
const titulo = ref('')
const error = ref('')
const enviando = ref(false)

async function guardar() {
  error.value = ''
  if (titulo.value.trim().length < 3) { error.value = 'Escriba al menos 3 caracteres'; return }
  enviando.value = true
  try { await crearTarea(titulo.value.trim()); router.push('/') }
  catch (e) { error.value = e.message }
  finally { enviando.value = false }
}
</script>

<template>
  <section>
    <h2>Nueva tarea</h2>
    <form @submit.prevent="guardar" novalidate>
      <label for="titulo">Titulo</label>
      <input id="titulo" v-model="titulo" type="text" :aria-invalid="!!error" aria-describedby="err" />
      <p id="err" class="error" role="alert">{{ error }}</p>
      <button type="submit" :disabled="enviando || !enLinea">{{ enviando ? 'Guardando...' : 'Guardar' }}</button>
      <p v-if="!enLinea" class="aviso">Sin conexion: no se puede guardar.</p>
    </form>
  </section>
</template>
