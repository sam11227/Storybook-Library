<script>
  import { Card, Button } from "flowbite-svelte";
  export let salesTypes = [];
  export let statuses = [];
  export let onSalesTypeChange = (selectedTypes) => {};
  export let onStatusChange = (selectedStatuses) => {};
  export let onReset = () => {};
  export let selectedSalesTypes = [];
  export let selectedStatuses = [];
  export let resultsCount = 0;

  const toggleSelection = (array, item, onChange) => {
    const newSelection = array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
    onChange(newSelection);
  };

  const isSelected = (array, item) => array.includes(item);
</script>

<Card size="xl">
  <h5 class="mb-6 text-base font-medium text-gray-500 dark:text-gray-400">
    Filter
  </h5>
  <div class="flex items-baseline dark:text-white">
    <div>
      <div class="mb-6">
        <h3 class="text-sm font-medium mb-3 text-gray-900">Sales Type</h3>
        <div class="space-y-3">
          {#each salesTypes as type}
            <Button
              class="w-full text-sm font-medium text-gray-500 border hover:bg-gray-100 
                  {isSelected(selectedSalesTypes, type)
                ? 'bg-gray-200 font-semibold'
                : 'bg-gray-50'}"
              on:click={() =>
                toggleSelection(selectedSalesTypes, type, onSalesTypeChange)}
            >
              {type}
            </Button>
          {/each}
        </div>
      </div>
      <div class="mb-6">
        <h3 class="text-sm font-medium mb-3 text-gray-900">Status</h3>
        <div class="space-y-2">
          {#each statuses as stat}
            <Button
              class="w-full text-sm font-medium text-gray-500 border hover:bg-gray-100 
                  {isSelected(selectedStatuses, stat)
                ? 'bg-gray-200 font-semibold'
                : 'bg-gray-50'}"
              on:click={() =>
                toggleSelection(selectedStatuses, stat, onStatusChange)}
            >
              {stat}
            </Button>
          {/each}
        </div>
      </div>
      <div class="mb-4">
        <Button
          class="w-full text-gray-900 text-sm font-medium"
          color="light"
          on:click={onReset}
        >
          Reset
        </Button>
      </div>
      <div>
        <Button class="w-full text-sm font-medium">
          Show {resultsCount} Results
        </Button>
      </div>
    </div>
  </div>
</Card>
