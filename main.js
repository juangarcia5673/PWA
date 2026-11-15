import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import TareasView from './views/TareasView.vue'
import NuevaTareaView from './views/NuevaTareaView.vue'
import './style.css'

const router = createRouter({
  history: createWebHashHistory(),   // evita configurar el servidor para rutas SPA
  routes: [
    { path: '/', name: 'tareas', component: TareasView },
    { path: '/nueva', name: 'nueva', component: NuevaTareaView }
  ]
})
createApp(App).use(router).mount('#app')

// Service worker solo en produccion (en desarrollo interfiere con el hot reload)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'))
}
