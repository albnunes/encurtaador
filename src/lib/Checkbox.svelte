<script lang="ts">
  export let checked: boolean = false;
  export let label: string = "";
  export let id: string = "";
</script>

<label for={id}>
  <input {id} type="checkbox" bind:checked />
  {label}
</label>
