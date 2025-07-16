<script lang="ts">
  import { authStore } from './stores';
  import { onMount } from 'svelte';

  let currentUser: any = null;
  let isAuthenticated = false;

  onMount(() => {
    // Garantir que o store seja inicializado
    authStore.initialize();

    const unsubscribe = authStore.subscribe((state: any) => {
      currentUser = state.user;
      isAuthenticated = state.isAuthenticated;
    });
    return unsubscribe;
  });

  function logout() {
    authStore.logout();
  }
</script>

<nav>
  <a href="/" class="brand-link"><h1>Encurtaador</h1></a>
  <div class="nav-links">
    {#if currentUser && isAuthenticated}
      <span class="user-info">Olá, {currentUser.name}!</span>
      <a href="#/dashboard" class="nav-link">Dashboard</a>
      <button on:click={logout} class="logout-btn">Sair</button>
    {:else}
      <a href="#/login" class="nav-link">Entrar</a>
      <a href="#/register" class="nav-link register-link">Cadastrar</a>
    {/if}
  </div>
</nav>

<style>
  nav {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
  }

  .brand-link {
    text-decoration: none;
    color: inherit;
  }

  .brand-link h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-info {
    color: #6b7280;
    font-size: 0.875rem;
  }

  .nav-link {
    text-decoration: none;
    color: #374151;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background-color 0.2s;
  }

  .nav-link:hover {
    background: #f3f4f6;
  }

  .register-link {
    background: #3b82f6;
    color: white;
  }

  .register-link:hover {
    background: #2563eb;
  }

  .logout-btn {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background-color 0.2s;
  }

  .logout-btn:hover {
    background: #f3f4f6;
    color: #374151;
  }
</style>
