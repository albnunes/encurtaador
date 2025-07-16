import './app.css'
import App from './App.svelte'
import { authStore } from './lib/stores'

// Inicializar o store de autenticação
authStore.initialize()

const app = new App({
  target: document.getElementById('app')!,
})

export default app
