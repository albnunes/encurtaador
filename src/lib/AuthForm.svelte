<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { authAPI } from './api';
  import { authStore } from './stores';
  import type { AuthResponse } from './api';
  export let mode: 'login' | 'register' = 'login';

  let email = '';
  let password = '';
  let name = '';
  let loading = false;
  let error = '';

  // Password validation
  let passwordErrors: string[] = [];
  let showPassword = false;

  function validatePassword(value: string): string[] {
    const errors: string[] = [];

    if (value.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (!/[A-Z]/.test(value)) {
      errors.push('Deve conter pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(value)) {
      errors.push('Deve conter pelo menos uma letra minúscula');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors.push('Deve conter pelo menos um caractere especial');
    }

    return errors;
  }

  function handlePasswordChange(event: Event) {
    const target = event.target as HTMLInputElement;
    password = target.value;
    passwordErrors = validatePassword(password);
  }

  const dispatch = createEventDispatcher<{
    success: void;
  }>();

  async function handleSubmit(event: Event) {
    event.preventDefault();

    // Validate password if in register mode
    if (mode === 'register') {
      passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        error = 'Por favor, corrija os erros na senha';
        return;
      }
    }

    loading = true;
    error = '';

    try {
      let response: AuthResponse;

      if (mode === 'register') {
        response = (await authAPI.register(
          email,
          password,
          name,
        )) as AuthResponse;
      } else {
        response = (await authAPI.login(email, password)) as AuthResponse;
      }

      authStore.login(response.user, response.accessToken);
      dispatch('success');
    } catch (err: any) {
      error = err.response?.data?.message || 'Erro na autenticação';
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-form">

  <form on:submit={handleSubmit} class="form">
    {#if mode === 'register'}
      <div class="form-group">
        <label for="name">Nome</label>
        <input
          type="text"
          id="name"
          bind:value={name}
          required
          placeholder="Seu nome completo"
        />
      </div>
    {/if}

    <div class="form-group">
      <label for="email">E-mail</label>
      <input
        type="email"
        id="email"
        bind:value={email}
        required
        placeholder="seu@email.com"
      />
    </div>

    <div class="form-group">
      <label for="password">Senha</label>
      <div class="password-input">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={password}
          on:input={handlePasswordChange}
          required
          placeholder="Sua senha"
        />
        <button
          type="button"
          class="toggle-password"
          on:click={() => (showPassword = !showPassword)}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>

      {#if mode === 'register' && password}
        <div class="password-requirements">
          <h4>Requisitos da senha:</h4>
          <ul>
            <li class={password.length >= 6 ? 'valid' : 'invalid'}>
              Pelo menos 6 caracteres
            </li>
            <li class={/[A-Z]/.test(password) ? 'valid' : 'invalid'}>
              Uma letra maiúscula
            </li>
            <li class={/[a-z]/.test(password) ? 'valid' : 'invalid'}>
              Uma letra minúscula
            </li>
            <li
              class={/[!@#$%^&*(),.?":{}|<>]/.test(password)
                ? 'valid'
                : 'invalid'}
            >
              Um caractere especial
            </li>
          </ul>
        </div>
      {/if}
    </div>

    {#if error}
      <div class="error">{error}</div>
    {/if}

    <button type="submit" disabled={loading} class="submit-btn">
      {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
    </button>
  </form>
</div>

<style>
  .auth-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }

  input {
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .password-input {
    position: relative;
    display: flex;
    align-items: center;
  }

  .password-input input {
    flex: 1;
    padding-right: 3rem;
  }

  .toggle-password {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    font-size: 1rem;
  }

  .password-requirements {
    margin-top: 0.5rem;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
  }

  .password-requirements h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    color: #374151;
  }

  .password-requirements ul {
    margin: 0;
    padding-left: 1rem;
    list-style: none;
  }

  .password-requirements li {
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
  }

  .password-requirements li::before {
    content: '✓';
    margin-right: 0.5rem;
    font-weight: bold;
  }

  .password-requirements li.valid {
    color: #059669;
  }

  .password-requirements li.valid::before {
    content: '✓';
    color: #059669;
  }

  .password-requirements li.invalid {
    color: #dc2626;
  }

  .password-requirements li.invalid::before {
    content: '✗';
    color: #dc2626;
  }

  .error {
    color: #dc2626;
    font-size: 0.875rem;
    text-align: center;
    padding: 0.5rem;
    background: #fef2f2;
    border-radius: 6px;
    border: 1px solid #fecaca;
  }

  .submit-btn {
    background: #3b82f6;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-btn:hover:not(:disabled) {
    background: #2563eb;
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
