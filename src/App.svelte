<script lang="ts">
  import Router from 'svelte-spa-router';
  import Navigation from './lib/Navigation.svelte';
  import Home from './pages/Home.svelte';
  import Login from './pages/Login.svelte';
  import Register from './pages/Register.svelte';
  import Dashboard from './pages/Dashboard.svelte';

  const routes = {
    '/': Home,
    '/login': Login,
    '/register': Register,
    '/dashboard': Dashboard,
  };
</script>

<Navigation />
<main class="main">
  <Router {routes} />
</main>

<style>
  .main {
    min-height: 93.3vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem 1rem;
  }
</style>
