<script>
  import { getDay, getDaysInMonth, startOfMonth } from "date-fns";
  import Button from "../Button/Button.svelte";
  import AddMainBlue from "../../assets/svg/add-main-blue.svg";
  import DatePicker from "@components/DatePicker/DatePickerOnly.svelte";
  import TimezoneSelect from "@components/TimezoneSelect/TimezoneSelect.svelte";
  import { sineIn } from "svelte/easing";
  import EventActionModal from "@components/EventActionModal/EventActionModal.svelte";
  import DateModal from "@components/EventActionModal/DateModal.svelte";
  import {
    Label,
    Input as FlowbiteInput,
    Checkbox,
    Drawer,
    Dropdown,
  } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import { formatLocalDate, formatEventButtonLabel } from "@utils/helper";

  let eventStart = "April 22, 2025 - 10:00 AM";
  let eventEnd = "April 22, 2025 - 12:00 PM";
  let startDateTime = "April 22, 2025 - 10:00 AM";
  let endDateTime = "April 22, 2025 - 12:00 PM";
  let showEventActionModal = false;
  let selectedDayForModal = null;
  let actionModalDay = null;

  let drawerMode = "schedule";

  function openModalForDay(day) {
    selectedDayForModal = day;
    showEventActionModal = false;
  }

  function closeModal() {
    selectedDayForModal = null;
    showEventActionModal = false;
  }
  function handleOpenActionModal() {
    actionModalDay = selectedDayForModal;
    showEventActionModal = true;
  }

  let dropdownOpen = true;

  function isPastDay(day) {
    const today = new Date();
    const dayDate = new Date(Date.UTC(currentYear, currentMonth, day));
    return (
      dayDate < today &&
      !(
        dayDate.getDate() === today.getDate() &&
        dayDate.getMonth() === today.getMonth() &&
        dayDate.getFullYear() === today.getFullYear()
      )
    );
  }

  let transitionParams = {
    x: 320,
    duration: 200,
    easing: sineIn,
  };

  // export let isScheduledBtn = false;
  // export let scheduleRecurring = false;
  // export let eventCalendar = false;
  // export let embedCalendar = false;
  let currentDate = new Date();
  export let currentYear = currentDate.getUTCFullYear();
  export let currentMonth = currentDate.getUTCMonth();
  export let currentevents = [];

  let selectedDate = new Date();
  $: {
    selectedDate = new Date(Date.UTC(currentYear, currentMonth, 1));
  }

  let daysInMonth = [];

  $: {
    const days = getDaysInMonth(selectedDate);
    const startDay = getDay(startOfMonth(selectedDate));
    daysInMonth = Array.from({ length: days }, (_, i) => {
      const dayNum = i + 1;
      const events = currentevents.filter((event) => {
        const eventDate = new Date(event?.events?.startDateTime);
        return (
          eventDate.getUTCFullYear() === currentYear &&
          eventDate.getUTCMonth() === selectedDate.getUTCMonth() &&
          eventDate.getUTCDate() === dayNum
        );
      });
      return {
        day: dayNum,
        startDay: startDay + i,
        events,
      };
    });
  }

  let hoveredDay = null;

  function handleHover(day) {
    hoveredDay = day;
  }

  function handleMouseLeave() {
    hoveredDay = null;
    selectedDayForModal = null;
    showEventActionModal = false;
  }

  function navigateToDay(day) {
    const dayString = String(day).padStart(2, "0");
    const monthString = String(selectedDate.getUTCMonth() + 1).padStart(2, "0");
    const route = `/daily/${currentYear}-${monthString}-${dayString}`;

    // console.log(route, "logs goto route");
    // goto(route); // Uncomment this when using SvelteKit routing
  }

  let now = new Date();
  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, "0");

  let RescheduleDrawer;
  let startDateReschedule;
  let startTimeReschedule = `${hours}:${minutes}`;
  let endTimeReschedule = `${hours}:${minutes}`;
  let selectedTimezoneReschedule;
  let applyToMultiple;

  const dispatch = createEventDispatcher();

  function handleRescheduleTimezoneChange(event) {
    selectedTimezoneReschedule = event.detail.value;
  }

  function saveAndUpdateReschedule() {
    const formData = {
      startDateReschedule: formatLocalDate(startDateReschedule),
      startTimeReschedule,
      endTimeReschedule,
      selectedTimezoneReschedule,
      applyToMultiple,
    };

    dispatch("save", formData);
    RescheduleDrawer = true;
    // console.log("Submitted reschedule data:", formData);
  }

  function closeDrawer() {
    RescheduleDrawer = true;
  }
</script>

<div class="max-w-[1600px] py-4 px-1 w-full bg-BG-Primary mb-10">
  <div
    class="calendar w-full mx-auto grid rounded-lg border border-stroke-Primary"
  >
    {#each ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as dayName}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span
        class="flex p-3 items-center justify-center gap-3 bg-BG-Primary text-Text-Tartiary leading-[18px] font-normal text-[14px] sm:text-lg border-l first:border-l-0 border-stroke-Primary"
      >
        {dayName}
      </span>
    {/each}
    {#each Array(daysInMonth[0]?.startDay || 0)
      .fill()
      .map(() => "") as _}
      <div></div>
    {/each}
    {#each daysInMonth as day}
      <!-- svelte-ignore missing-declaration -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="relative day-container text-[#252B37] flex flex-col items-center {isPastDay(
          day.day
        )
          ? 'bg-[#F7F7F8]'
          : ''}"
        on:click={() => navigateToDay(day.day)}
        on:mouseenter={() => handleHover(day)}
        on:mouseleave={handleMouseLeave}
      >
        <div class="my-1.5 w-full h-full flex flex-col items-center gap-2">
          <span class="day {isPastDay(day.day) ? 'text-gray-400' : ''}"
            >{day.day}</span
          >

          <!-- {#if isScheduledBtn && hoveredDay === day}
              <div class="mt-auto mx-auto">
                <Button ScheduledBtn beforeIcon={AddMainBlue}>Schedule</Button>
              </div>
            {/if} -->

          {#if hoveredDay === day && !isPastDay(day.day)}
            <div class="mt-auto mx-auto space-y-2">
              <Button
                ScheduledBtn
                beforeIcon={AddMainBlue}
                on:click={() => {
                  drawerMode = "schedule";
                  RescheduleDrawer = false;
                }}
              >
                Schedule
              </Button>
            </div>
          {/if}
          {#if day.events.length > 0}
            <div>
              <Button
                on:click={() => openModalForDay(day.day)}
                class="bg-[#FFF] border-2 border-blue-300 shadow-lg px-1 py-1 rounded-lg text-[#252B37] font-normal text-sm"
              >
                {formatEventButtonLabel(day.events[0]?.events?.startDateTime)}
              </Button>
            </div>
          {/if}
          {#if day.events.length > 0 && !isPastDay(day.day)}
            {#if selectedDayForModal === day.day}
              <DateModal
                open
                startDateTime={formatEventButtonLabel(
                  day.events[0]?.events?.startDateTime
                )}
                endDateTime={formatEventButtonLabel(
                  day.events[0]?.events?.endDateTime
                )}
                on:close={closeModal}
                on:open-action-modal={handleOpenActionModal}
              />
            {/if}
          {/if}
          {#if hoveredDay === day && !isPastDay(day.day)}
            {#if showEventActionModal && selectedDayForModal === day.day}
              <EventActionModal
                show
                fromDateTime={formatEventButtonLabel(
                  day.events[0]?.events?.startDateTime
                )}
                toDateTime={formatEventButtonLabel(
                  day.events[0]?.events?.endDateTime
                )}
                dayOfWeek={day.startDay % 7}
                onReschedule={() => {
                  drawerMode = "reschedule";
                  RescheduleDrawer = false;
                }}
                on:close={() => {
                  showEventActionModal = false;
                  actionModalDay = null;
                }}
              />
            {/if}
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<Drawer
  placement="right"
  transitionType="fly"
  {transitionParams}
  bind:hidden={RescheduleDrawer}
  id="sidebar4"
>
  <div class="relative h-full p-1 overflow-auto">
    <h2 class="text-xl font-normal text-[#0D1526]">
      {drawerMode === "reschedule" ? "Reschedule" : "Schedule"}
    </h2>
    <p
      class="text-[#666C79] font-normal text-sm leading-[22px] border-b border-[#D4D6D9] pb-4 pt-2"
    >
      Choose a new start date and time for this occurrence
    </p>

    <form>
      <div class="space-y-6 pt-4">
        <div>
          <Label
            for="startDate"
            class="text-sm text-[#0D1526] leading-[14px] pb-2.5"
            >Start Date</Label
          >
          <DatePicker
            bind:selectedDate={startDateReschedule}
            on:change={(e) => (selectedDate = e.detail.date)}
          />
        </div>

        <div class="flex gap-4">
          <div class="flex-1">
            <Label
              for="startTime"
              class="text-sm text-[#0D1526] leading-[14px] pb-2.5"
              >Start time</Label
            >
            <FlowbiteInput
              id="startTime"
              type="time"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
              bind:value={startTimeReschedule}
            />
          </div>
          <div class="flex-1">
            <Label
              for="endTime"
              class="text-sm text-[#0D1526] leading-[14px] pb-2.5"
              >End time</Label
            >
            <FlowbiteInput
              id="endTime"
              type="time"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700"
              bind:value={endTimeReschedule}
            />
          </div>
        </div>

        <div class="w-full">
          <TimezoneSelect
            customClass="w-[279px]"
            value={selectedTimezoneReschedule}
            label="Time Zone"
            on:change={handleRescheduleTimezoneChange}
          />
        </div>

        <div class="flex gap-2">
          <Checkbox
            type="checkbox"
            id="applyMultiple"
            class="h-4 w-4 border-[#666C79] rounded focus:ring-[#0284FE]"
            bind:checked={applyToMultiple}
          />
          <Label
            for="applyMultiple"
            class="text-sm text-[#252B37] leading-[14px] font-normal pb-3"
          >
            Apply to multiple occurrences
          </Label>
        </div>
      </div>
    </form>

    <div class="absolute bottom-1 left-0 w-full flex justify-between gap-4">
      <Button
        type="button"
        class="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white"
        on:click={closeDrawer}
      >
        Cancel
      </Button>
      <Button
        type="button"
        class="flex-1 py-2.5 px-4 border border-transparent rounded-lg font-medium text-white bg-blue-500"
        on:click={saveAndUpdateReschedule}
      >
        Save
      </Button>
    </div>
  </div>
</Drawer>

<style>
  .calendar {
    display: grid;
    grid-template-columns: repeat(7, minmax(100px, 1fr));
    grid-template-rows: auto;
    grid-auto-rows: minmax(158px, auto);
  }

  .day-container {
    padding: 8px;
    gap: 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
  }

  .calendar > .day-container,
  .calendar > div {
    border-top: 1px solid #d4d6d9;
  }

  .calendar > .day-container:not(:nth-child(7n + 1)),
  .calendar > div:not(:nth-child(7n + 1)) {
    border-left: 1px solid #d4d6d9;
  }

  .calendar > .day-container:nth-last-child(-n + 7),
  .calendar > div:nth-last-child(-n + 7) {
    border-bottom: 1px solid #d4d6d9;
  }
  .calendar > .day-container:last-of-type {
    border-right: 1px solid #d4d6d9;
  }

  .day {
    font-size: 18px;
    color: #0d1526;
    font-weight: 400;
    line-height: 18px;
    font-style: normal;
  }

  @media (max-width: 1024px) {
    .calendar {
      grid-template-columns: repeat(7, minmax(100px, 1fr));
    }

    .day {
      font-size: 16px;
    }
  }

  @media (max-width: 768px) {
    .calendar {
      grid-template-columns: repeat(7, minmax(70px, 1fr));
    }

    .day {
      font-size: 14px;
    }

    .day-container {
      padding: 6px 4px;
    }
  }

  @media (max-width: 640px) {
    .calendar {
      grid-template-columns: repeat(7, minmax(30px, 1fr));
    }

    .day {
      font-size: 12px;
    }
  }
</style>
