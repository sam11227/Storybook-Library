<script>
  import SearchIcon from "carbon-icons-svelte/lib/Search.svelte";
  export let availableTickets = [];
  export let selectedTickets = [];

  let searchTerm = "";

  function toggleTicket(ticketName) {
    if (selectedTickets.includes(ticketName)) {
      selectedTickets = selectedTickets.filter(
        (name) => name.ID !== ticketName
      );
    } else {
      selectedTickets = [...selectedTickets, ticketName];
    }
  }

  $: filteredTickets = availableTickets?.filter((ticket) =>
    ticket?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
</script>

<div class="space-y-3">
  <div>
    <div
      class="flex items-center gap-10 px-3 py-2 bg-gray-100 font-semibold text-sm border rounded-t"
    >
      <div class="w-6 mr-4"></div>
      <div class="w-32">Ticket type</div>
      <div class="w-24 text-right">Price</div>
    </div>

    {#if filteredTickets.length > 0}
      {#each filteredTickets as ticket}
        <label
          class="flex items-center gap-10 px-3 py-2 border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
        >
          <div class="w-6 mr-4">
            <input
              type="checkbox"
              checked={selectedTickets.includes(ticket.name)}
              on:change={() => toggleTicket(ticket.ID)}
              class="w-4 h-4 rounded-sm"
            />
          </div>
          <div class="w-32">{ticket.name}</div>
          <div class="w-24 text-right">${ticket.price}</div>
        </label>
      {/each}
    {:else}
      <div class="text-center text-gray-500 py-4">No available tickets</div>
    {/if}
  </div>
</div>
