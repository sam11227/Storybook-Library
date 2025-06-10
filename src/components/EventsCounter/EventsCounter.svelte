<script>
  import Button from "@components/Button/Button.svelte";
  import { Input as FlowbiteInput } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";

  export let count = 1;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  function increment() {
    const newCount = count + 1;
    dispatch("update", { count: newCount });
  }

  function decrement() {
    if (count > 1) {
      const newCount = count - 1;
      dispatch("update", { count: newCount });
    }
  }
</script>

<div class="flex items-center gap-0 rounded overflow-hidden border border-gray-300">
  <Button
    type="button"
    class="px-3 py-1.5 bg-[#D4D6D9] text-gray-700 border-r border-gray-300"
    on:click={decrement}
    disabled={disabled}
  >
    −
  </Button>

  <FlowbiteInput
    type="text"
    class="w-full px-3 py-1.5 text-center bg-[#F7F7F8] text-[#09090a] font-normal text-sm  border-none"
    bind:value={count}
    disabled
  />

  <Button
    type="button"
    class="px-3 py-1.5   bg-[#D4D6D9] text-gray-700 border-l border-gray-300"
    on:click={increment}
    disabled={disabled}
  >
    +
  </Button>
</div>
