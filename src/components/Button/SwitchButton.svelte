<script lang="ts">
  import { writable } from "svelte/store";

  export let options: { key: string; label: string }[] = [];
  export let activeKey: string = "";
  export let onToggle: (key: string) => void = () => {};

  const active = writable(activeKey);

  function toggle(key: string) {
    active.set(key);
    onToggle(key);
  }
</script>

<div
  class="flex border border-gray-300 rounded-[8px] overflow-hidden shadow-sm"
>
  {#each options as option, index}
    <button
      on:click={() => toggle(option.key)}
      class="flex-1 py-2 text-center text-xs font-medium transition-colors duration-200 px-2 whitespace-nowrap"
      class:border-r={index < options.length - 1}
      class:bg-blue-600={activeKey === option.key}
      class:text-white={activeKey === option.key}
      class:text-gray-500={activeKey !== option.key}
    >
      {option.label}
    </button>
  {/each}
</div>
