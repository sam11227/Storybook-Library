<script>
  import ShowTimeCard from "./ShowTimeCard.svelte";
  import ShareIcon from "./../../../../assets/svg/share.svg";
  import { formatDateTime, formatTimeline } from "./../../../../utils/utils";

  export let selectedEvent;
  export let showtimes;
</script>

<div
  class="h-fit rounded-[8px] px-5 py-4 bg-[#FFFFFF] md:border md:border-[#D4D6D9]"
>
  <div class="flex justify-between">
    <h1 class="w-full text-left font-semibold text-[24px]">
      {selectedEvent.detail.name}
    </h1>
    <div>
      <img
        src={ShareIcon}
        alt=""
        class="size-3.5 translate-y-2.5 cursor-pointer"
      />
    </div>
  </div>
  <h2 class="text-sm text-[#6B7280] py-2 mt-1">Date & time</h2>
  <p class="text-[16px] text-[#252B37]">
    {formatDateTime(selectedEvent.detail.startDateTime)} (Doors: {formatTimeline(
      selectedEvent.detail.doorsOpenTime
    )})
  </p>
  {#if showtimes}
    <div class="mt-3.5 mb-4">
      <h2 class="text-gray-500 font-medium text-sm mb-2">More showtimes</h2>
      <div class="flex flex-row gap-1">
        {#each showtimes as showtime}
          <ShowTimeCard
            day={selectedEvent.detail.day}
            date={showtime.date}
            time={selectedEvent.detail.time}
          />
        {/each}
      </div>
    </div>
  {/if}

  <div class="my-4">
    <h2 class="text-[#6B7280] text-sm mb-2">Location</h2>
    <p class="text-[16px] text-[#252B37] text-balance">
      {selectedEvent.detail.venue.name} - {selectedEvent.detail.stage.name}, {selectedEvent
        .detail.venue.address}, Los Angeles, CA 90046
    </p>
  </div>
  <h1
    class="w-full text-left font-semibold text-[16px] text-[#1C64F2] cursor-pointer"
  >
    Direction
  </h1>
</div>
