<script lang="ts">

  import AuthForm from '../lib/AuthForm.svelte';

  function handleSuccess() {
    window.location.hash = '#/';
  }
</script>

<svelte:head>
  <title>Cadastro - Encurtaador</title>
</svelte:head>



<main class="main">
  <div class="container">
    <div class="auth-container">
      <h1>Cadastrar</h1>
      <p class="subtitle">Crie sua conta para gerenciar suas URLs</p>

      <AuthForm mode="register" on:success={handleSuccess} />

      <div class="auth-footer">
        <p>Já tem uma conta? <a href="#/login">Entrar</a></p>
      </div>
    </div>
  </div>
</main>

<style>
  .main {
    min-height: calc(100vh - 80px);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }

  .container {
    width: 100%;
    max-width: 500px;
  }

  .auth-container {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  h1 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
    font-size: 2rem;
    font-weight: 700;
  }

  .subtitle {
    margin: 0 0 2rem 0;
    color: #6b7280;
    font-size: 1rem;
  }

  .auth-footer {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .auth-footer p {
    margin: 0;
    color: #6b7280;
  }

  .auth-footer a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
  }

  .auth-footer a:hover {
    text-decoration: underline;
  }
</style>
