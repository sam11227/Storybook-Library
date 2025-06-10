<script>
  import Button from "@components/Button/Button.svelte";
  import { createEventDispatcher } from "svelte";

  export let show = false;
  export let size = "md";

  export let icon = null;
  export let title = "";
  export let message = "";
  export let okLabel = "Ok";

  const dispatch = createEventDispatcher();

  const handleOk = () => {
    dispatch("close", { action: "ok" });
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      dispatch("close", { action: "backdrop" });
    }
  };
</script>

{#if show}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-full"
  >
    <div
      class="bg-white rounded-lg shadow-lg max-w-md w-full min-h-[322px] p-6"
      style="max-width: {size === 'sm'
        ? '320px'
        : size === 'md'
          ? '394px'
          : '640px'}"
    >
      <div class="flex flex-col justify-center gap-6 items-center text-center">
        {#if icon}
          <img src={icon} alt="icon" class=" w-14 h-14" />
        {/if}

        {#if title}
          <p class="text-[#0D1526] text-[20px] font-normal">{title}</p>
        {/if}

        {#if message}
          <span class="text-sm font-normal text-[#666C79]">{message}</span>
        {/if}
        <Button
          class="w-full bg-[#0284FE] hover:bg-[#0284FE] text-white py-3 rounded-lg"
          on:click={handleOk}
        >
          {okLabel}
        </Button>
      </div>
    </div>
  </div>
{/if}
