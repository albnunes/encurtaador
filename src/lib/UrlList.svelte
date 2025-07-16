<script lang="ts">
  import { onMount } from 'svelte';
  import { urlAPI } from './api';
  import type { UrlResponse } from './api';
  import QRCodeDisplay from './QRCodeDisplay.svelte';

  let urls: UrlResponse[] = [];
  let loading = false;
  let error = '';
  let currentPage = 1;
  let totalPages = 1;
  let total = 0;
  let limit = 10;
  let expandedUrlId: string | null = null;

  async function loadUrls(page = 1) {
    loading = true;
    error = '';

    try {
      const response = await urlAPI.getUserUrls(page, limit);

      urls = response.urls;
      total = response.total;
      totalPages = Math.ceil(total / limit);
      currentPage = page;
    } catch (err: any) {
      error = err.response?.data?.message || 'Erro ao carregar URLs';
    } finally {
      loading = false;
    }
  }

  async function deleteUrl(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta URL?')) {
      return;
    }

    try {
      await urlAPI.deleteUrl(id);
      await loadUrls(currentPage);
    } catch (err: any) {
      error = err.response?.data?.message || 'Erro ao excluir URL';
    }
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

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  function toggleQRCode(urlId: string) {
    expandedUrlId = expandedUrlId === urlId ? null : urlId;
  }

  onMount(() => {
    loadUrls();
  });
</script>

<div class="url-list">
  <div class="header">
    <h2>Minhas URLs</h2>
    <p class="total">Total: {total} URLs</p>
  </div>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  {#if loading}
    <div class="loading">Carregando...</div>
  {:else if urls.length === 0}
    <div class="empty">
      <p>Você ainda não tem URLs encurtadas.</p>
      <p>Comece criando sua primeira URL!</p>
    </div>
  {:else}
    <div class="urls">
      {#each urls as url}
        <div class="url-card">
          <div class="url-info">
            <div class="original-url">
              <strong>URL Original:</strong>
              <a
                href={url.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {url.originalUrl}
              </a>
            </div>

            <div class="short-url">
              <strong>URL Encurtada:</strong>
              <div class="short-url-container">
                <span class="short-url-text">{url.shortUrl}</span>
                <button
                  type="button"
                  on:click={() => copyToClipboard(url.shortUrl)}
                  class="copy-btn"
                >
                  Copiar
                </button>
              </div>
            </div>

            <div class="url-stats">
              <span class="stat">
                <strong>Clicks:</strong>
                {url.clicks}
              </span>
              <span class="stat">
                <strong>Criada em:</strong>
                {formatDate(url.createdAt)}
              </span>
            </div>
          </div>

          <div class="url-actions">
            <button
              type="button"
              on:click={() => toggleQRCode(url.id)}
              class="qrcode-btn"
            >
              {expandedUrlId === url.id ? '🔽' : '📱'} QR Code
            </button>
            <button
              type="button"
              on:click={() => deleteUrl(url.id)}
              class="delete-btn"
            >
              Excluir
            </button>
          </div>
        </div>

        {#if expandedUrlId === url.id}
          <div class="qrcode-section">
            <QRCodeDisplay
              urlId={url.id}
              slug={url.slug}
              shortUrl={url.shortUrl}
              qrCode={url.qrCode}
              isPublic={false}
            />
          </div>
        {/if}
      {/each}
    </div>

    {#if totalPages > 1}
      <div class="pagination">
        <button
          type="button"
          on:click={() => loadUrls(currentPage - 1)}
          disabled={currentPage === 1}
          class="page-btn"
        >
          Anterior
        </button>

        <span class="page-info">
          Página {currentPage} de {totalPages}
        </span>

        <button
          type="button"
          on:click={() => loadUrls(currentPage + 1)}
          disabled={currentPage === totalPages}
          class="page-btn"
        >
          Próxima
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .url-list {
    max-width: 800px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .header h2 {
    margin: 0;
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .total {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .error {
    color: #dc2626;
    background: #fef2f2;
    border: 1px solid #fecaca;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }

  .empty {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
  }

  .empty p {
    margin: 0.5rem 0;
  }

  .urls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .url-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .url-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .original-url {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .original-url a {
    color: #3b82f6;
    text-decoration: none;
    word-break: break-all;
  }

  .original-url a:hover {
    text-decoration: underline;
  }

  .short-url {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .short-url-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .short-url-text {
    font-family: monospace;
    background: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .copy-btn {
    padding: 0.25rem 0.5rem;
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    transition: background-color 0.2s;
  }

  .copy-btn:hover {
    background: #4b5563;
  }

  .url-stats {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .stat {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .url-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .qrcode-btn {
    padding: 0.5rem 1rem;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
  }

  .qrcode-btn:hover {
    background: #059669;
  }

  .delete-btn {
    padding: 0.5rem 1rem;
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
  }

  .delete-btn:hover {
    background: #b91c1c;
  }

  .qrcode-section {
    margin-top: 0.5rem;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  .page-btn {
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .page-btn:hover:not(:disabled) {
    background: #2563eb;
  }

  .page-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .page-info {
    color: #6b7280;
    font-size: 0.875rem;
  }
</style>
