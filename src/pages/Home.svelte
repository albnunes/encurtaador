<script lang="ts">
  import UrlShortener from '../lib/UrlShortener.svelte';
  import { authStore } from '../lib/stores';
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
</script>

<div class="hero">
  <h1>Encurtaador</h1>
  <p class="subtitle">Encurte suas URLs de forma rápida e segura</p>
  {#if currentUser && isAuthenticated}
    <p class="welcome">Bem-vindo de volta, {currentUser.name}!</p>
  {:else}
    <p class="info">
      Crie URLs curtas sem se cadastrar ou faça login para gerenciar suas URLs
    </p>
  {/if}
</div>
<div class="content">
  <UrlShortener />
</div>
{#if currentUser && isAuthenticated}
  <div class="dashboard-link">
    <a href="#/dashboard" class="dashboard-btn">Ver minhas URLs</a>
  </div>
{:else}
  <div class="auth-links">
    <p>Já tem uma conta?</p>
    <div class="auth-buttons">
      <a href="#/login" class="auth-btn login-btn">Entrar</a>
      <a href="#/register" class="auth-btn register-btn">Cadastrar</a>
    </div>
  </div>
{/if}

<style>
  .hero {
    text-align: center;
    margin-bottom: 3rem;
    color: white;
  }

  .hero h1 {
    font-size: 3rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .subtitle {
    font-size: 1.25rem;
    margin: 0 0 1rem 0;
    opacity: 0.9;
  }

  .welcome {
    font-size: 1.125rem;
    margin: 0;
    opacity: 0.8;
  }

  .info {
    font-size: 1rem;
    margin: 0;
    opacity: 0.8;
  }

  .content {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .dashboard-link {
    text-align: center;
    margin-top: 2rem;
  }

  .dashboard-btn {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 500;
    transition: background-color 0.2s;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .dashboard-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .auth-links {
    text-align: center;
    margin-top: 2rem;
    color: white;
  }

  .auth-links p {
    margin: 0 0 1rem 0;
    opacity: 0.9;
  }

  .auth-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  .auth-btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
  }

  .login-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .login-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .register-btn {
    background: white;
    color: #667eea;
  }

  .register-btn:hover {
    background: #f8fafc;
  }

  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }

    .content {
      padding: 1.5rem;
      margin: 0 1rem;
    }

    .auth-buttons {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
