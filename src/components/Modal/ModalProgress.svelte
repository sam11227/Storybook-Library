<script>
  import { createEventDispatcher } from "svelte";

  export let show = false;
  export let isProcessing = false;
  export let isSuccess = false;
  const dispatch = createEventDispatcher();

  const resetModal = () => {
    dispatch("cancel");
    show = false;
  };
</script>

{#if show}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-2 sm:p-4"
    on:click={resetModal}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl max-w-md w-full modal-box"
      class:small-modal={isProcessing || isSuccess}
      on:click|stopPropagation
    >
      <slot name="header"></slot>
      <slot name="body"></slot>
      <div class="w-full flex justify-between md:justify-end">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-box {
    max-width: 512px;
  }

  .small-modal {
    max-width: 350px;
  }
</style>
