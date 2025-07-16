<script lang="ts">
  import { onMount } from 'svelte';
  import QRCode from 'qrcode';

  export let urlId: string;
  export let slug: string;
  export let shortUrl: string;
  export let qrCode: boolean = false;
  export let isPublic = false;

  let qrCodeSvg: string = '';
  let loading = false;

  async function generateQRCode() {
    if (!qrCode || !shortUrl) return;

    loading = true;
    try {
      qrCodeSvg = await QRCode.toString(shortUrl, {
        type: 'svg',
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
    } finally {
      loading = false;
    }
  }

  function downloadQRCodeSVG() {
    if (!qrCodeSvg) return;

    const blob = new Blob([qrCodeSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode-${slug}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  onMount(() => {
    if (qrCode) {
      generateQRCode();
    }
  });

  $: if (qrCode && shortUrl) {
    generateQRCode();
  }
</script>

<div class="qrcode-container">
  <h3>QR Code</h3>

  {#if !qrCode}
    <div class="no-qrcode">
      <p>QR Code não foi habilitado para esta URL.</p>
      <p>Você pode habilitar o QR Code editando a URL.</p>
    </div>
  {:else if loading}
    <div class="loading">
      <p>Gerando QR Code...</p>
    </div>
  {:else if qrCodeSvg}
    <div class="qrcode-display">
      <div class="qrcode-content">
        {@html qrCodeSvg}
      </div>

      <div class="qrcode-actions">
        <button on:click={downloadQRCodeSVG} class="download-btn">
          📥 Baixar SVG
        </button>
      </div>

      <div class="url-info">
        <p><strong>URL:</strong> {shortUrl}</p>
        <button
          on:click={() => navigator.clipboard.writeText(shortUrl)}
          class="copy-btn"
        >
          📋 Copiar URL
        </button>
      </div>
    </div>
  {:else}
    <div class="error">
      <p>Erro ao gerar QR Code.</p>
    </div>
  {/if}
</div>

<style>
  .qrcode-container {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin: 1rem 0;
  }

  h3 {
    margin: 0 0 1rem 0;
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .no-qrcode,
  .loading,
  .error {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }

  .no-qrcode p,
  .loading p,
  .error p {
    margin: 0.5rem 0;
  }

  .qrcode-content {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
    min-height: 200px;
    align-items: center;
  }

  .qrcode-content :global(svg) {
    max-width: 200px;
    height: auto;
  }

  .qrcode-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .download-btn {
    background: #10b981;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
  }

  .download-btn:hover {
    background: #059669;
  }

  .url-info {
    text-align: center;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 6px;
  }

  .url-info p {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    color: #374151;
  }

  .copy-btn {
    background: #6b7280;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
  }

  .copy-btn:hover {
    background: #4b5563;
  }
</style>
