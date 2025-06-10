<script lang="ts">
  import { Skeleton } from "flowbite-svelte";

  export let rows: number = 5;
  export let columns: number = 5;
</script>

<div class="overflow-x-auto">
  <table class="table-auto w-full text-left text-sm text-gray-500">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        {#each Array(columns) as _, colIndex}
          <th scope="col" class="px-4">
            <Skeleton divClass="w-2/4 h-3" />
          </th>
        {/each}
      </tr>
    </thead>

    <tbody>
      {#each Array(rows) as _, rowIndex}
        <tr class={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
          {#each Array(columns) as _, colIndex}
            <td class="px-4 py-1">
              <Skeleton divClass="w-full h-1/4" />
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
