<script>
  import { Card } from "flowbite-svelte";

  export let transferData;
</script>

<div class="w-full">
  <Card
    class="bg-white-100 border border-gray-300 rounded-2xl w-full "
    size="auto"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-2 pb-1">
      {#each transferData as transfer}
        {#if transfer.title}
          <div>
            <p class="text-sm font-normal text-Text-Tartiary pb-1">
              {transfer.label}:
            </p>
            <p class="text:sm md:text-xl font-normal text-Text-Primary pb-1">
              {transfer.title}
            </p>
            <p class="text-sm font-normal text-Text-Tartiary pb-1">
              {transfer.date}
            </p>
          </div>
        {/if}
      {/each}
    </div>
  </Card>
</div>
