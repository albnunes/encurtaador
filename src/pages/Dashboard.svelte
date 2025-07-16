<script lang="ts">
  import { onMount } from 'svelte';
  import Navigation from '../lib/Navigation.svelte';
  import UrlShortener from '../lib/UrlShortener.svelte';
  import UrlList from '../lib/UrlList.svelte';
  import { authStore } from '../lib/stores';

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
</script>

<svelte:head>
  <title>Dashboard - Encurtaador</title>
</svelte:head>

<main class="main">
  {#if !isAuthenticated}
    <div class="unauthorized">
      <h1>Acesso Negado</h1>
      <p>Você precisa estar logado para acessar esta página.</p>
      <a href="#/login" class="login-link">Fazer Login</a>
    </div>
  {:else}
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo, {currentUser?.name}!</p>
      </div>

      <div class="dashboard-content">
        <div class="section">
          <h2>Criar Nova URL</h2>
          <UrlShortener />
        </div>

        <div class="section">
          <UrlList />
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  .main {
    min-height: calc(100vh - 80px);
    background: #f8fafc;
    padding: 2rem 1rem;
  }

  .unauthorized {
    text-align: center;
    padding: 4rem 2rem;
    max-width: 500px;
    margin: 0 auto;
  }

  .unauthorized h1 {
    color: #1f2937;
    font-size: 2rem;
    margin: 0 0 1rem 0;
  }

  .unauthorized p {
    color: #6b7280;
    margin: 0 0 2rem 0;
  }

  .login-link {
    display: inline-block;
    background: #3b82f6;
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .login-link:hover {
    background: #2563eb;
  }

  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
  }

  .dashboard-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .dashboard-header h1 {
    color: #1f2937;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  .dashboard-header p {
    color: #6b7280;
    font-size: 1.125rem;
    margin: 0;
  }

  .dashboard-content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .section {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .section h2 {
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
  }

  @media (max-width: 768px) {
    .dashboard-header h1 {
      font-size: 2rem;
    }

    .section {
      padding: 1.5rem;
    }
  }
</style>
