<script lang="ts">
  import { format, isBefore, startOfToday } from "date-fns";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let selectedDate: Date = new Date();
  export let label: string = "";
  export let onlyFutureDates: boolean = false;
  export let allowedWeekdays: number[];

  let showCalendar = false;
  let currentMonth = new Date();
  const today = startOfToday();

  $: formattedDate = format(selectedDate, "MMM dd, yyyy");

  function generateCalendarDays(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const startPadding = firstDay.getDay();

    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const thisDate = new Date(year, month, day);

      if (onlyFutureDates && isBefore(thisDate, today)) {
        days.push(null);
      } else {
        days.push(thisDate);
      }
    }

    return days;
  }

  $: calendarDays = generateCalendarDays(currentMonth);

  function previousMonth() {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1
    );
    if (!onlyFutureDates) {
      currentMonth = newDate;
      return;
    }

    const isSameOrAfterTodayMonth =
      newDate.getFullYear() > today.getFullYear() ||
      (newDate.getFullYear() === today.getFullYear() &&
        newDate.getMonth() >= today.getMonth());

    if (isSameOrAfterTodayMonth) {
      currentMonth = newDate;
    }
  }

  function nextMonth() {
    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1
    );
  }

  function selectDate(date: Date) {
    if (!date) return;

    if (allowedWeekdays && !allowedWeekdays.includes(date.getDay())) return;

    selectedDate = date;
    dispatch("change", { date });
    showCalendar = false;
  }

  function toggleCalendar() {
    showCalendar = !showCalendar;
  }

  function handleClickOutside(event: MouseEvent) {
    const inputElement = document.getElementById("date-picker");
    const calendarElement = document.querySelector(".calendar-container");

    if (
      inputElement &&
      !inputElement.contains(event.target as Node) &&
      calendarElement &&
      !calendarElement.contains(event.target as Node)
    ) {
      showCalendar = false;
    }
  }

  import { onMount, onDestroy } from "svelte";

  onMount(() => {
    document.addEventListener("mousedown", handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener("mousedown", handleClickOutside);
  });
</script>

<div class="relative">
  {#if label}
    <label
      for="date-picker"
      class="text-sm text-[#0D1526] leading-[14px] pb-2.5 block">{label}</label
    >
  {/if}

  <div class="relative">
    <input
      id="date-picker"
      type="text"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
      value={formattedDate}
      readonly
      on:click={toggleCalendar}
    />
  </div>

  {#if showCalendar}
    <div
      class="calendar-container absolute z-50 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-[280px]"
    >
      <div class="flex justify-between items-center mb-4">
        <button
          class="text-gray-600 hover:text-gray-800"
          on:click={previousMonth}>←</button
        >
        <span class="font-medium">{format(currentMonth, "MMMM yyyy")}</span>
        <button class="text-gray-600 hover:text-gray-800" on:click={nextMonth}
          >→</button
        >
      </div>

      <div class="grid grid-cols-7 gap-1 text-center mb-2">
        {#each ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as day}
          <div class="text-xs text-gray-500">{day}</div>
        {/each}
      </div>

      <div class="grid grid-cols-7 gap-1">
        {#each calendarDays as day}
          {#if day}
            <button
              class={`h-8 w-8 flex items-center justify-center rounded-full text-sm transition
                ${format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") ? "bg-blue-500 text-white" : ""}
                ${
                  !allowedWeekdays || allowedWeekdays.includes(day.getDay())
                    ? "text-gray-700 hover:bg-blue-50 cursor-pointer"
                    : "text-gray-400 opacity-30 cursor-not-allowed"
                }
              `}
              on:click={() => {
                if (
                  !allowedWeekdays ||
                  allowedWeekdays.includes(day.getDay())
                ) {
                  selectDate(day);
                }
              }}
              disabled={allowedWeekdays &&
                !allowedWeekdays.includes(day.getDay())}
            >
              {format(day, "d")}
            </button>
          {:else}
            <div></div>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</div>
