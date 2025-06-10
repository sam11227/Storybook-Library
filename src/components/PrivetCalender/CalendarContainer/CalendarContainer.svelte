<script>
  import { writable } from "svelte/store";
  import LeftArrow from "@assets/svg/arrow-Left-01.svg";
  import RightArrow from "@assets/svg/arrow-right-01.svg";
  import CaretDown from "carbon-icons-svelte/lib/CaretDown.svelte";
  import DailyView from "../Views/DailyView.svelte";
  import WeeklyView from "../Views/WeeklyView.svelte";
  import Calendar from "../Calendar.svelte";
  import { onMount } from "svelte";
  import SkeletonLoader from "../../SkeletonLoader/SkeletonLoader.svelte";
  import Button from "@components/Button/Button.svelte";
  import { getDateOfMonth } from "@utils/utils";

  export let events;
  export let loading;

  let date = new Date(
    Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate()
    )
  );
  let today = new Date();

  let options = [
    { id: 0, text: "Day" },
    { id: 1, text: "Week" },
    { id: 2, text: "Month" },
  ];

  let isDatePickerOpen = writable(false);
  let currentView = writable(options[2].text);
  let currentYear = writable(date.getUTCFullYear());
  let currentMonth = writable(date.getUTCMonth());
  let currentQuarter = writable(Math.ceil((date.getUTCMonth() + 1) / 3));
  let selectedDate = writable(date);

  function toggleDatePicker() {
    isDatePickerOpen.update((state) => !state);
  }

  function selectOption(option) {
    currentView.set(option.text);
    isDatePickerOpen.set(false);
  }

  function handleNext() {
    if ($currentView === "Day") {
      selectedDate.update(
        (d) =>
          new Date(
            Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)
          )
      );
    } else if ($currentView === "Week") {
      selectedDate.update(
        (d) =>
          new Date(
            Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 7)
          )
      );
    } else if ($currentView === "Month") {
      currentMonth.update((month) => {
        if (month === 11) {
          currentYear.update((year) => year + 1);
          return 0;
        }
        return month + 1;
      });
    } else if ($currentView === "Quarter") {
      currentQuarter.update((quarter) => {
        let newQuarter = quarter + 1;
        if (newQuarter > 4) {
          newQuarter = 1;
          currentYear.update((year) => year + 1);
        }
        return newQuarter;
      });
    } else if ($currentView === "Year") {
      currentYear.update((year) => year + 1);
    }
  }

  function handlePrev() {
    if ($currentView === "Day") {
      selectedDate.update((d) => {
        const prevDate = new Date(
          Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 1)
        );
        const todayDate = new Date(
          Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
        );

        if (prevDate >= todayDate) {
          return prevDate;
        }
        return d;
      });
    } else if ($currentView === "Week") {
      selectedDate.update((d) => {
        const prevWeek = new Date(
          Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - 7)
        );
        const todayDate = new Date(
          Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
        );
        if (prevWeek >= todayDate) {
          return prevWeek;
        }
        return d;
      });
    } else if ($currentView === "Month") {
      currentMonth.update((month) => {
        const current = new Date(Date.UTC($currentYear, month, 1));
        const todayDate = new Date(
          Date.UTC(today.getFullYear(), today.getMonth(), 1)
        );
        if (current > todayDate) {
          if (month === 0) {
            currentYear.update((year) => year - 1);
            return 11;
          }
          return month - 1;
        }
        return month;
      });
    }
  }

  let formtEventevents = [];
  function convertToCustomDateTimeFormat(isoDateString) {
    const date = new Date(isoDateString);
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes()
      )
    );
  }

  function convertToCustomDateFormat(isoDateString) {
    const date = new Date(isoDateString);
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours()
      )
    );
  }

  function formatTimeRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    function formatTime(date) {
      let hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutesStr = minutes < 10 ? "0" + minutes : minutes;
      return hours + ":" + minutesStr + " " + ampm;
    }
    const startTime = formatTime(start);
    const endTime = formatTime(end);
    return `${startTime} - ${endTime}`;
  }

  const fetchEvents = async () => {
    try {
      const setData = events.map((c) => {
        let startTime = convertToCustomDateTimeFormat(c.startDateTime);
        let endTime = convertToCustomDateTimeFormat(c.endDateTime);
        return {
          name: c.title,
          date: convertToCustomDateFormat(c.startDateTime),
          startDateTime: c.startDateTime,
          description: c.description,
          location: c.venue.address,
          dateOfMonth: getDateOfMonth(c.startDateTime),
          availableTickets: c.availableTickets,
          doorsOpenTime: c.doorsOpenTime,
          venue: c.venue,
          stage: c.stage,
          events: c.venue.Events,
          performers: c.performers,
          ticketType: c.ticketType,
          purchasedTickets: c.purchasedTickets,
          ShowImage: c.image,
        };
      });
      formtEventevents = setData;
    } catch (error) {
      console.error("Unable to  fetching events:", error);
    }
  };
  onMount(() => {
    fetchEvents();
  });

  function handleToday() {
    const today = new Date();
    const utcToday = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
    );

    selectedDate.set(utcToday);

    currentYear.set(today.getFullYear());
    currentMonth.set(today.getMonth());
    currentQuarter.set(Math.ceil((today.getMonth() + 1) / 3));
  }
</script>

<div
  class="max-w-[1600px] w-full h-screen overflow-x-hidden border-none rounded-lg bg-BG-Primary"
>
  <header class="h-16 flex items-center w-full">
    <nav
      class="w-full sm:max-w-[1600px] flex items-center justify-between px-2"
    >
      <div class="flex items-center gap-5 h-full">
        <button
          class="border cursor-pointer outline-none border-stroke-Primary rounded-full p-3"
          on:click={handlePrev}
        >
          <img class="w-5 h-5" src={LeftArrow} alt="Previous" />
        </button>
      </div>

      <h2
        class="text-[#252B37] mb-2 mt-5 pl-1 md:pl-28 rounded-lg text-center text-xl leading-[14px] font-medium"
      >
        {#if $currentView === "Day"}
          {new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
          }).format($selectedDate)}
        {:else if $currentView === "Week"}
          {new Intl.DateTimeFormat("en", {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          }).format($selectedDate)}
        {:else if $currentView === "Month"}
          {new Intl.DateTimeFormat("en", {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          }).format(new Date(Date.UTC($currentYear, $currentMonth)))}
        {:else if $currentView === "Quarter"}
          {$currentYear}
        {:else if $currentView === "Year"}
          {$currentYear}
        {/if}
      </h2>

      <div class=" flex items-center justify-center gap-1.5">
        <div class="md:flex items-center justify-center gap-1.5 hidden">
          <div>
            <Button
              on:click={handleToday}
              strokebtn
              class="rounded-lg  h-[34px] px-4 border border-[#D4D6D9] text-[#0D1526] font-medium text-sm leading-[14px]"
            >
              Today
            </Button>
          </div>
          <div class="relative">
            <button
              class="w-auto border-[1px] border-stroke-Primary rounded-full pl-4 pr-3 py-3 flex items-center text-black/70 text-sm leading-[17.5px]"
              on:click={toggleDatePicker}
            >
              {$currentView}
              <CaretDown class="ml-2" />
            </button>

            <!-- <Button
          on:click={handleMonthView}
          strokebtn
          class="rounded-lg h-[34px] px-4 border border-[#D4D6D9] text-[#0D1526] font-medium text-sm leading-[14px]"
        >
          Month View
        </Button> -->

            {#if $isDatePickerOpen}
              <div
                class="absolute top-12 right-0 w-[190px] bg-white rounded-lg shadower border shadow-3xl z-10 py-2"
              >
                {#each options as option}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <div
                    class="py-2 px-4 hover:bg-gray-100 cursor-pointer text-sm w-full hover:no-underline text-black/70 bg-white flex justify-between items-center"
                    on:click={() => selectOption(option)}
                  >
                    <span>{option.text}</span>
                    <span class="text-xs">{option.text.charAt(0)}</span>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
        <button
          class="border cursor-pointer outline-none border-stroke-Primary rounded-full p-3"
          on:click={handleNext}
        >
          <img class="w-5 h-5" src={RightArrow} alt="Next" />
        </button>
      </div>
    </nav>
  </header>

  <div class="md:hidden flex items-center justify-center gap-1.5 pb-2">
    <div>
      <Button
        on:click={handleToday}
        strokebtn
        class="rounded-lg  h-[34px] px-4 border border-[#D4D6D9] text-[#0D1526] font-medium text-sm leading-[14px]"
      >
        Today
      </Button>
    </div>
    <div class="relative">
      <button
        class="w-auto border-[1px] border-stroke-Primary rounded-full pl-4 pr-3 py-3 flex items-center text-black/70 text-sm leading-[17.5px]"
        on:click={toggleDatePicker}
      >
        {$currentView}
        <CaretDown class="ml-2" />
      </button>

      {#if $isDatePickerOpen}
        <div
          class="absolute top-12 right-0 w-[190px] bg-white rounded-lg shadower border shadow-3xl z-10 py-2"
        >
          {#each options as option}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              class="py-2 px-4 hover:bg-gray-100 cursor-pointer text-sm w-full hover:no-underline text-black/70 bg-white flex justify-between items-center"
              on:click={() => selectOption(option)}
            >
              <span>{option.text}</span>
              <span class="text-xs">{option.text.charAt(0)}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <main class=" max-w-[1600px]">
    {#if $currentView === "Day"}
      {#if loading}
        <SkeletonLoader type="daily" />
      {:else}
        <DailyView
          selectedDate={$selectedDate}
          embedCalendar
          currentevents={events}
        />
      {/if}
    {:else if $currentView === "Week"}
      {#if loading}
        <SkeletonLoader type="weekly" />
      {:else}
        <WeeklyView
          selectedDate={$selectedDate}
          embedCalendar
          currentevents={events}
        />
      {/if}
    {:else if $currentView === "Month"}
      {#if loading}
        <SkeletonLoader type="monthly" />
      {:else}
        <Calendar
          embedCalendar
          currentYear={$currentYear}
          currentMonth={$currentMonth}
          currentevents={events}
        />
      {/if}
    {:else if $currentView === "Quarter"}
      {#if loading}
        <SkeletonLoader type="quarter" />
      {:else}{/if}
    {:else if $currentView === "Year"}
      {#if loading}
        <SkeletonLoader type="yearly" />
      {:else}
        <!-- <YearlyView currentYear={$currentYear} currentevents={events} /> -->
      {/if}
    {/if}
  </main>
</div>

<style>
  .shadower {
    box-shadow:
      0 3px 5px -1px rgba(0, 0, 0, 0.2),
      0 6px 10px 0 rgba(0, 0, 0, 0.14),
      0 1px 18px 0 rgba(0, 0, 0, 0.12);
  }
</style>
