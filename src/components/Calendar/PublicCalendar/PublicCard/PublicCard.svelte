<script>
  import { createEventDispatcher, onMount } from "svelte";
  import mockImg from "./../../../../assets/images/image.png";
  import TimeIcon from "./../../../../assets/svg/Vector.png";
  import { truncateTitle } from "../../../../utils/utils";

  export let events = [];
  export let view = "row";

  const dispatch = createEventDispatcher();
  let isSmallScreen = false;

  let options = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  onMount(() => {
    isSmallScreen = window.innerWidth < 768;
    window.addEventListener("resize", handleResize);
  });

  function handleResize() {
    isSmallScreen = window.innerWidth < 768;
  }

  function handleEventClick(event) {
    dispatch("eventClick", event);
  }
</script>

{#each events as event}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <section
    class={`grid event-view rounded-lg cursor-pointer gap overflow-hidden ${
      view === "col"
        ? "flex-col lg:w-[222px]"
        : "grid-cols-[200px_1fr] gap-2 sm:gap-4 relative p-2.5 w-full"
    }`}
    on:click={() => handleEventClick(event)}
  >
    <div
      class={`bg-Icon-Primary flex items-center justify-center overflow-hidden h-full ${view === "col" ? "relative w-[224px] h-[200px] rounded-lg" : "rounded-[8px] w-[200px] h-[200px] "}`}
    >
      <img
        src={event.image || mockImg}
        alt={event.name}
        class={`object-contain cursor-pointer h-full w-auto`}
      />
    </div>
    <div
      class={`flex h-full flex-col ${view === "col" ? "sm:p-1 gap-2" : "gap-1 sm:gap-2"}`}
    >
      {#if event.status}
        <div
          class={`bg-red-50 text-red-600 sm:h-[25px] ${view === "col" ? "w-20 sm:w-[120px]" : "sm:w-[133px] w-[100px]"} rounded`}
        >
          <div class="gap-2 flex items-center justify-center px-[6px] py-[2px]">
            <img
              src={TimeIcon}
              alt="Badge Icon"
              class="text-red-600 w-2 h-2 sm:w-4 sm:h-4"
            />
            <span
              class={`text-[10px] sm:text-[14px] font-medium leading-[21px]`}
            >
              {event.status}</span
            >
          </div>
        </div>
      {/if}
      <div
        class={`font-medium leading-[22px] text-Text-Primary ${
          view === "col"
            ? "text-[14px] font-medium leading-[21px] sm:text-[16px]"
            : "sm:text-2xl font-medium text-[14px] leading-[36px] max-sm:pr-7 max-sm:pt-[2px]"
        }`}
      >
        {event.name}
      </div>
      <div class={`flex flex-col ${view === "col" ? "gap-1" : "pb-2"}`}>
        <div
          class={` ${
            view === "col"
              ? "text-[10px] font-medium text-Text-Tartiary leading-[21px] sm:text-[14px]"
              : "text-Text-Primary text-[10px] sm:text-sm font-medium leading-[21px]"
          }`}
        >
          {new Date(event.date).toLocaleDateString("en-US", options)}
          • {event.timeline.split("-")[0]}
        </div>
      </div>
      {#if view === "row"}
        <p
          class={`text-Text-Tartiary ${
            view === "row"
              ? "text-[14px] sm:text-sm  leading-[21px] sm:leading-normal font-normal"
              : ""
          }`}
        >
          {isSmallScreen
            ? truncateTitle(event.description, 70)
            : event.description}
        </p>
      {/if}
    </div>
  </section>
{/each}

<style>
  .event-view {
    background-color: #ffffff;
    transition:
      box-shadow 0.3s ease-in-out,
      transform 0.3s ease-in-out;
  }
  .event-view:hover {
    background-color: #f7f7f8;
    transform: scale(1);
    box-shadow:
      0px 56px 16px 0px rgba(43, 43, 43, 0),
      0px 36px 14px 0px rgba(43, 43, 43, 0.01),
      0px 20px 12px 0px rgba(43, 43, 43, 0.05),
      0px 9px 9px 0px rgba(43, 43, 43, 0.09),
      0px 2px 5px 0px rgba(43, 43, 43, 0.1);
  }
  @media (max-width: 767px) {
    .event-view p {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
</style>
