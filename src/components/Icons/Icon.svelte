<script>
  import { iconMap } from "./iconMap";

  export let name;
  export let size = "20";
  export let color = "currentColor";

  let Component;

  $: Component = iconMap[name] || null;
</script>

{#if Component}
  <svelte:component this={Component} {size} {color} />
{:else}
  <span>Icon "{name}" not found.</span>
{/if}
