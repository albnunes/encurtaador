<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Checkbox from "./Checkbox.svelte";

  export let placeholder = "Cole seu link aqui...";
  export let value = "";
  export let error = "";

  let shortUrl = "";
  let loading = false;
  let showQr = false;
  let qrCodeDataUrl = "";

  const dispatch = createEventDispatcher<{
    input: string;
    submit: string;
  }>();

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    dispatch("input", value);
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (isValidUrl(value)) {
      loading = true;
      error = "";

      try {
        const response = await fetch("/api/shorten", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: value, generateQr: showQr }),
        });

        const data = await response.json();

        if (response.ok) {
          shortUrl = data.shortUrl;
          qrCodeDataUrl = data.qrCodeDataUrl || "";
          dispatch("submit", value);
        } else {
          error = data.error || "Erro ao encurtar URL";
        }
      } catch (err) {
        error = "Erro ao encurtar URL";
      } finally {
        loading = false;
      }
    } else {
      error = "Por favor, insira uma URL válida";
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
</script>

<form on:submit={handleSubmit} class="w-full mx-auto">
  <div>
    <input
      type="url"
      {value}
      {placeholder}
      on:input={handleInput}
      class="px-8 py-6 text-2xl border-2 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors
      {error ? 'border-red-500' : 'border-gray-300'}"
    />

    {#if error}
      <p class="mt-2 text-base text-red-500">{error}</p>
    {/if}
  </div>
  <br />

  <div class="mb-4">
    <Checkbox bind:checked={showQr} label="Gerar QR Code" id="show-qr" />
  </div>
  <br />

  <button
    type="submit"
    class="mt-2 w-full bg-blue-500 text-white py-4 px-8 text-xl rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
    disabled={loading}
  >
    {loading ? "Encurtando..." : "Encurtar"}
  </button>

  {#if shortUrl}
    <div class="mt-6 p-4 bg-gray-100 rounded-lg">
      <p class="text-lg mb-2">URL encurtada:</p>
      <div class="flex flex-col gap-2">
        <input
          type="text"
          readonly
          value={shortUrl}
          class="px-4 py-2 text-lg border rounded-lg bg-white"
        />
        <button
          type="button"
          on:click={copyToClipboard}
          class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Copiar
        </button>
      </div>
      <br />
      {#if showQr && qrCodeDataUrl}
        <div class="mt-4 flex justify-center">
          {#if qrCodeDataUrl.trim().startsWith("<svg")}
            <!-- Renderiza SVG inline -->
            {@html qrCodeDataUrl}
          {:else}
            <!-- Caso seja um data URL ou outro formato, usa <img> -->
            <img src={qrCodeDataUrl} alt="QR Code da URL encurtada" />
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</form>

<style>
  input {
    width: 100%;
    height: 1.5rem;
  }

  input::placeholder {
    color: #9ca3af;
  }
</style>
