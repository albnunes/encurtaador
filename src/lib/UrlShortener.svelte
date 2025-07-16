<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { urlAPI } from './api';
  import type { UrlResponse } from './api';
  import QrCodeDisplay from './QRCodeDisplay.svelte';

  export let placeholder = 'Cole seu link aqui...';
  export let value = '';
  export let error = '';
  
  let shortUrl = '';
  let loading = false;
  let qrCode = true;
  let createdUrl: UrlResponse | null = null;

  const dispatch = createEventDispatcher<{
    input: string;
    submit: string;
    urlCreated: UrlResponse;
  }>();

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    dispatch('input', value);
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (isValidUrl(value)) {
      loading = true;
      error = '';

      try {
        const response = await urlAPI.createUrl(value, qrCode);


        createdUrl = response;
        shortUrl = response.shortUrl;

        dispatch('submit', value);
        dispatch('urlCreated', response);
      } catch (err: any) {
        console.error('Error creating URL:', err);
        error = err.response?.data?.message || 'Erro ao encurtar URL';
      } finally {
        loading = false;
      }
    } else {
      error = 'Por favor, insira uma URL válida';
    }
  }

  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(shortUrl);
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<div class="url-shortener">
  <form on:submit={handleSubmit} class="form">
    <div class="input-group">
      <input
        type="url"
        {value}
        {placeholder}
        on:input={handleInput}
        class="url-input {error ? 'error' : ''}"
      />

      {#if error}
        <p class="error-message">{error}</p>
      {/if}
    </div>

    <div class="options">
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={qrCode} />
        <span>Gerar QR Code</span>
      </label>
    </div>

    <button type="submit" class="submit-btn" disabled={loading}>
      {loading ? 'Encurtando...' : 'Encurtar URL'}
    </button>
  </form>

  {#if createdUrl}
    <div class="result">
      <h3>URL Encurtada</h3>

      <div class="url-info">
        <div class="info-row">
          <span class="label">URL Original:</span>
          <a
            href={createdUrl.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="original-url"
          >
            {createdUrl.originalUrl}
          </a>
        </div>

        <div class="info-row">
          <span class="label">URL Encurtada:</span>
          <div class="short-url-container">
            <input
              type="text"
              readonly
              value={shortUrl}
              class="short-url-input"
            />
            <button type="button" on:click={copyToClipboard} class="copy-btn">
              Copiar
            </button>
          </div>
        </div>

        <div class="info-row">
          <span class="label">Criada em:</span>
          <span>{formatDate(createdUrl.createdAt)}</span>
        </div>

        <div class="info-row">
          <span class="label">Clicks:</span>
          <span>{createdUrl.clicks}</span>
        </div>


      </div>

      {#if createdUrl.qrCode}
        <div class="qr-code">
          <h4>QR Code</h4>
          <QrCodeDisplay
            {qrCode}
            urlId={createdUrl.id}
            slug={createdUrl.slug}
            {shortUrl}
          />
        </div>

      {/if}
    </div>
  {/if}
</div>

<style>
  .url-shortener {
    max-width: 600px;
    margin: 0 auto;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .url-input {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    transition: border-color 0.2s;
  }

  .url-input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .url-input.error {
    border-color: #dc2626;
  }

  .error-message {
    color: #dc2626;
    font-size: 0.875rem;
  }

  .options {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    color: #374151;
  }

  .submit-btn {
    background: #3b82f6;
    color: white;
    padding: 1rem;
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

  .result {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }

  .result h3 {
    margin: 0 0 1rem 0;
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .url-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .label {
    font-weight: 500;
    color: #374151;
    min-width: 100px;
  }

  .original-url {
    color: #3b82f6;
    text-decoration: none;
    word-break: break-all;
  }

  .original-url:hover {
    text-decoration: underline;
  }

  .short-url-container {
    display: flex;
    gap: 0.5rem;
    flex: 1;
  }

  .short-url-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    font-family: monospace;
  }

  .copy-btn {
    padding: 0.5rem 1rem;
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
  }

  .copy-btn:hover {
    background: #4b5563;
  }

  .qr-code {
    margin-top: 1.5rem;
    text-align: center;
  }

  .qr-code h4 {
    margin: 0 0 1rem 0;
    color: #374151;
    font-size: 1rem;
    font-weight: 500;
  }

  .qr-code img {
    max-width: 200px;
    height: auto;
  }
</style>
