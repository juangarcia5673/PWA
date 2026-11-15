# Tareas PWA (Vue 3)

SPA/PWA que consume una API REST de tareas.

## Ejecutar
```
npm install
npm run api      # terminal 1: API en http://localhost:3000
npm run dev      # terminal 2: aplicacion en http://localhost:5173
npm test         # pruebas del servicio HTTP
npm run build && npm run preview   # version de produccion (activa el service worker, http://localhost:4173)
```
Para usar otra API (por ejemplo la de la Unidad 2) cree `.env` con `VITE_API_URL=https://mi-api`.
Contrato esperado: GET/POST `/tareas`, PATCH/DELETE `/tareas/:id`, errores `{ "error": { "mensaje": "..." } }`.

## Estructura
- `src/services/api.js` unico punto de acceso HTTP
- `src/views/` pantallas (lista y formulario)
- `src/components/` TareaItem y EstadoVista (reutilizables)
- `public/sw.js`, `public/manifest.webmanifest` PWA
