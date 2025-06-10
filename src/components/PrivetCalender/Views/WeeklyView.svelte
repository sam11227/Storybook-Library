<script>
  import { addDays, startOfWeek, format, getHours } from "date-fns";
  import Badge from "../../Badges/Badge.svelte";
  import { truncateTitle } from "@lib/utils/utils";
  import Button from "./../../Button/Button.svelte";
  import AddMainBlue from "@assets/svg/add-main-blue.svg";
  import { getDay, getDaysInMonth, startOfMonth } from "date-fns";
  import DatePicker from "@components/DatePicker/DatePickerOnly.svelte";
  import TimezoneSelect from "@components/TimezoneSelect/TimezoneSelect.svelte";
  import { sineIn } from "svelte/easing";
  import {
    Label,
    Input as FlowbiteInput,
    Checkbox,
    Drawer,
    Modal,
    Dropdown,
    DropdownItem,
  } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import { Time } from "carbon-icons-svelte";
  import EventActionModal from "@components/EventActionModal/EventActionModal.svelte";
  import DateModal from "@components/EventActionModal/DateModal.svelte";
  import { formatEventButtonLabel } from "@utils/helper";

  // export let scheduleRecurring = false;
  // export let eventCalendar = false;
  // export let embedCalendar = false;
  export let currentevents = [];

  export let selectedDate;

  let transitionParams = {
    x: 320,
    duration: 200,
    easing: sineIn,
  };

  let weekDays = [];
  let loading = true;

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

  let showEventActionModal = false;
  let selectedDayForModal = null;
  let actionModalDay = null;
  let drawerMode = "schedule";
  let hoveredDay = null;
  let showDateModal = false;
  let selectedHourForModal = null;

  function handleDateChange(event) {
    startDateReschedule = event.detail.date;
  }

  function handleRescheduleTimezoneChange(event) {
    selectedTimezoneReschedule = event.detail.value;
  }

  function saveAndUpdateReschedule() {
    const formData = {
      startDateReschedule: startDateReschedule.toISOString().split("T")[0],
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

  $: weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(selectedDate, { weekStartsOn: 1 }), i)
  );

  function getEventsForDayAndHour(day, hour) {
  return currentevents.filter((event) => {
    const eventDate = new Date(event?.events?.startDateTime);
    
    // Use local date comparisons instead of UTC
    return (
      eventDate.getDate() === day.getDate() &&
      eventDate.getMonth() === day.getMonth() &&
      eventDate.getFullYear() === day.getFullYear() &&
      eventDate.getHours() === hour
    );
  });
}

  function handleHover(hour) {
    hoveredDay = hour;
  }

  function handleMouseLeave() {
    hoveredDay = null;
    selectedDayForModal = null;
    showEventActionModal = false;
    showDateModal = false;
  }

  function openModalForDay(day, hour, event) {
    console.log("Opening modal for day:", day, "hour:", hour, "event:", event);
    selectedHourForModal = { day, hour, event };
    showDateModal = true;
    showEventActionModal = false;
  }

  function closeModal() {
    console.log("Closing modal");
    selectedHourForModal = null;
    showDateModal = false;
    showEventActionModal = false;
  }

  function handleOpenActionModal() {
    console.log("Opening action modal");
    actionModalDay = selectedDayForModal;
    showEventActionModal = true;
  }

  function handleCloseActionModal() {
    showEventActionModal = false;
    actionModalDay = null;
    selectedDayForModal = null;
  }

  function formatTimeWithWeekdays(dateString) {
    const date = new Date(dateString);
    const time = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);

    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "long"
    }).format(date);

    return `${time} ${weekday.toUpperCase()}`;
  }
</script>

<div class=" mx-auto overflow-hidden w-full">
  <!-- Modal Container -->
  <div class="modal-container fixed top-0 left-0 w-full z-50"></div>

  <div
    class="grid grid-cols-8 gap-0 text-center text-sm font-semibold border-t border-r border-l border-stroke-Primary rounded-t-lg"
  >
    <div class="time-header"></div>
    {#each weekDays as day}
      <div>
        <div
          class="day-header flex flex-col gap-2 border-l border-stroke-Primary uppercase"
        >
          <span class="text-[#666C79] text-sm leading-[14px] font-normal">
            {format(day, "EEE")}
          </span>
          <span class="text-[18px] text-[#0D1526] font-normal leading-[18px]">
            {format(day, "dd")}
          </span>
        </div>
      </div>
    {/each}
  </div>
  <div
    class="grid grid-cols-8 gap-0 border-x border-stroke-Primary rounded-b-lg overflow-hidden"
  >
    {#each Array(24)
      .fill()
      .map((_, i) => i) as hour}
      <div class="hour-cell flex justify-center items-center py-4 text-center">
        {format(new Date().setHours(hour), "h:00 a")}
      </div>
      {#each weekDays as day}
        <div
          class="day-cell group p- border-b border-l border-stroke-Primary"
          class:bg-[#F7F7F8]={new Date(day).setHours(hour) <
            new Date().getTime()}
          on:mouseenter={() => handleHover(hour)}
          on:mouseleave={handleMouseLeave}
          role="gridcell"
          tabindex="0"
        >
          {#if new Date(day).setHours(hour) >= new Date().getTime()}
            <div class="mt-[9px] mx-auto">
              <div class="hidden group-hover:block">
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
            </div>
          {/if}

          {#if getEventsForDayAndHour(day, hour).length > 0}
            <div class="">
              <Button
                on:click={() =>
                  openModalForDay(
                    day,
                    hour,
                    getEventsForDayAndHour(day, hour)[0]
                  )}
                class="bg-[#FFF] border-2 border-blue-300 shadow-lg px-2 py-0.5 mb-2 rounded-lg text-[#252B37] font-normal text-sm"
              >
                {formatTimeWithWeekdays(
                  getEventsForDayAndHour(day, hour)[0]?.events?.startDateTime
                )}...
              </Button>

              {#if showDateModal && selectedHourForModal?.hour === hour && selectedHourForModal?.day.getTime() === day.getTime()}
                <div
                class="absolute z-50 top-full mt-2 max-w-sm text-start"
                class:left-18={![0, 6].includes(day.getDay())}  
                class:right-96={[0, 6].includes(day.getDay())}
                >
                  <DateModal
                    open={true}
                    startDateTime={formatEventButtonLabel(
                      selectedHourForModal.event.events.startDateTime
                    )}
                    endDateTime={formatEventButtonLabel(
                      selectedHourForModal.event.events.endDateTime
                    )}
                    on:close={closeModal}
                    on:open-action-modal={handleOpenActionModal}
                  />
                </div>
              {/if}

              {#if showEventActionModal && selectedHourForModal?.hour === hour && selectedHourForModal?.day.getTime() === day.getTime()}
              <div
              class="absolute z-50 top-full mt-2 max-w-sm text-start"
              class:left-18={![0, 6].includes(day.getDay())}  
              class:right-96={[0, 6].includes(day.getDay())}
              >
                  <EventActionModal
                    show={true}
                    fromDateTime={formatEventButtonLabel(
                      selectedHourForModal.event.events.startDateTime
                    )}
                    toDateTime={formatEventButtonLabel(
                      selectedHourForModal.event.events.endDateTime
                    )}
                    dayOfWeek={day.startDay % 7}
                    onReschedule={() => {
                      drawerMode = "reschedule";
                      RescheduleDrawer = false;
                    }}
                    on:close={handleCloseActionModal}
                  />
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
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
            on:change={handleDateChange}
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
  .grid {
    width: 100%;
  }

  .day-header {
    font-size: 14px;
    font-weight: normal;
  }

  .time-header,
  .day-header {
    padding: 12px;
    border-bottom: 1px solid var(--stroke-primary, #d4d6d9);
    color: var(--text-primary, #0d1526);
  }

  .hour-cell {
    background-color: var(--bg-secondary, #ffffff);
    color: var(--text-tartiary, #666c79);
    font-size: 14px;
    border-bottom: 1px solid var(--Stroke-Primary, #d4d6d9);
  }

  .day-cell {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  /* .event-badge {
    background-color: hsla(0, 0%, 100%, 1);
    color: hsla(220, 20%, 18%, 1);
    padding: 2px 4px;
    border-radius: 4px;
    font-weight: 400;
  }
  .image {
    border-radius: var(--rounded-sm, 2px);
    background: url(<path-to-image>) lightgray 50% / cover no-repeat;
    box-shadow:
      0px 20px 6px 0px rgba(0, 0, 0, 0),
      0px 13px 5px 0px rgba(0, 0, 0, 0.02),
      0px 7px 4px 0px rgba(0, 0, 0, 0.08),
      0px 3px 3px 0px rgba(0, 0, 0, 0.14),
      0px 1px 2px 0px rgba(0, 0, 0, 0.16);
  }
  .timeline {
    color: #666c79;
    font-size: 8px;
    font-style: italic;
    font-weight: 300;
    line-height: 8px;
    letter-spacing: -0.4px;
    text-align: center;
  }
  .embedCalendar {
    box-shadow:
      0px 56px 16px 0px rgba(43, 43, 43, 0),
      0px 36px 14px 0px rgba(43, 43, 43, 0.01),
      0px 20px 12px 0px rgba(43, 43, 43, 0.05),
      0px 9px 9px 0px rgba(43, 43, 43, 0.09),
      0px 2px 5px 0px rgba(43, 43, 43, 0.1);
  }
  .embedCalendar .desc {
    color: #0d1526;
    text-align: center;
    font-size: 8px;
    font-style: normal;
    font-weight: 500;
    line-height: 10px;
    letter-spacing: -0.16px;
  } */

  @media (max-width: 1024px) {
    .time-header,
    .day-header,
    .hour-cell,
    .day-cell {
      font-size: 12px;
      padding: 8px;
    }
  }

  @media (max-width: 768px) {
    .time-header,
    .day-header,
    .hour-cell,
    .day-cell {
      font-size: 10px;
      padding: 6px;
    }
  }

  @media (max-width: 640px) {
    .time-header,
    .day-header,
    .hour-cell,
    .day-cell {
      font-size: 8px;
      padding: 4px;
    }
    /* .embedCalendar {
      box-shadow: none;
    } */
  }
</style>
