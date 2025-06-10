<script>
    import { createEventDispatcher } from 'svelte';
    import Button from "./../Button/Button.svelte";
  
    export let open = false;
    export let startDateTime = "";
    export let endDateTime = "";
  
    const dispatch = createEventDispatcher();
  
    function handleActionClick() {
      dispatch('open-action-modal');
    }
  </script>
  
  {#if open}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="absolute top-[140px] left-0 z-50 mt-2 pb-4 w-52 cursor-pointer" on:click={handleActionClick}>
      <div class="bg-white ml-2 p-3 rounded-lg shadow-lg w-full flex flex-col gap-3 max-w-56 border-2 border-blue-300">
        <div>
          <p class="text-sm font-normal text-Text-Secondary whitespace-nowrap">
            {startDateTime} -
          </p>
        </div>
        <div>
          <p class="text-sm font-normal text-Text-Secondary">
            {endDateTime}
          </p>
        </div>
  
        
      </div>
    </div>
  {/if}
  