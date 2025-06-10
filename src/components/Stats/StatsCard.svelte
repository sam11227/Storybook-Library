<script>
  export let stats = [];
</script>

{#each stats as stat}
  <div class="bg-white rounded-[16px] p-6 flex items-center stat">
    <div class="mr-3">
      <img src={stat.icon} alt="" />
    </div>
    <div>
      <p class="text-base font-normal text-Text-Tartiary">{stat.name}</p>
      <p class="text-2xl font-normal text-Text-Secondary">{stat.value}</p>
    </div>
  </div>
{/each}

<style>
  .stat {
    box-shadow:
      0px 1px 3px 0px rgba(0, 0, 0, 0.1),
      0px 1px 2px -1px rgba(0, 0, 0, 0.1);
  }
</style>
