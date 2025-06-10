<script>
  import { getHours } from "date-fns";
  import Button from "../../Button/Button.svelte";
  import AddMainBlue from "./../../../assets/svg/add-main-blue.svg";
  import DatePicker from "@components/DatePicker/DatePickerOnly.svelte";
  import TimezoneSelect from "@components/TimezoneSelect/TimezoneSelect.svelte";
  import { sineIn } from "svelte/easing";
  import {
    Label,
    Input as FlowbiteInput,
    Checkbox,
    Drawer,
  } from "flowbite-svelte";
  import EventActionModal from "@components/EventActionModal/EventActionModal.svelte";
  import DateModal from "@components/EventActionModal/DateModal.svelte";
  import { formatEventButtonLabel } from "@utils/helper";

  // export let isScheduledBtn = false;
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

  let now = new Date();
  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, "0");

  let RescheduleDrawer;
  let startDateReschedule;
  let startTimeReschedule = `${hours}:${minutes}`;
  let endTimeReschedule = `${hours}:${minutes}`;
  let selectedTimezoneReschedule;
  let applyToMultiple;

  let hoursInDay = [];
  const isPastDateTime = (dateTimeString) => {
    if (!dateTimeString) return false;
    const blockDate = new Date(dateTimeString);
    const now = new Date();
    return blockDate < now;
  };

  $: {
    const today = new Date();

    hoursInDay = Array.from({ length: 24 }, (_, i) => {
      const hourDate = new Date(selectedDate);
      hourDate.setHours(i, 0, 0, 0);

      return {
        hour: i,
        dateTime: hourDate.toISOString(),
        isPast: hourDate < today,
        events: [],
      };
    });

    hoursInDay = hoursInDay.map((hour) => {
      hour.events = currentevents.filter((event) => {
        const eventDate = new Date(event?.events?.startDateTime);
        return (
          getHours(eventDate) === hour.hour &&
          eventDate.getUTCMonth() === selectedDate.getUTCMonth() &&
          eventDate.getUTCDay() === selectedDate.getUTCDay() &&
          eventDate.getUTCFullYear() === selectedDate.getUTCFullYear() &&
          eventDate.getUTCDate() === selectedDate.getUTCDate()
        );
      });
      return hour;
    });
  }

  function formatHour(hour) {
    const hour12 = hour % 12 || 12;
    const period = hour < 12 ? "AM" : "PM";
    const formattedHour = String(hour12).padStart(2, "0");
    return `${formattedHour}:00 ${period}`;
  }

  let hoveredDay = null;

  function handleHover(hour) {
    hoveredDay = hour;
  }

  function handleMouseLeave() {
    hoveredDay = null;
    selectedHourForModal = null;
    showEventActionModal = false;
  }

  $: formattedDay = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(selectedDate);
  $: formattedWeek = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    timeZone: "UTC",
  }).format(selectedDate);

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

  let showEventActionModal = false;
  let selectedHourForModal = null;
  let actionModalHour = null;
  let drawerMode = "schedule";
  let showDateModal = false;

  function openModalForHour(hour) {
    console.log('Opening modal for hour:', hour);
    selectedHourForModal = hour;
    showDateModal = true;
    showEventActionModal = false;
  }

  function closeModal() {
    console.log('Closing modal');
    selectedHourForModal = null;
    showDateModal = false;
    showEventActionModal = false;
  }

  function handleOpenActionModal() {
    console.log('Opening action modal');
    actionModalHour = selectedHourForModal;
    showEventActionModal = true;
  }

  function handleCloseActionModal() {
    showEventActionModal = false;
    actionModalHour = null;
    selectedHourForModal = null;
  }
</script>

<div class="overflow-hidden mx-auto w-ful">
  <div class="grid grid-cols-8 gap-0">
    <div class="empty-cell col-span-1" />
    <h2 class="text-left col-span-7 p-2">
      <span class="text-[#252B37] text-lg leading-[18px] font-normal"
        >{formattedWeek}</span
      >,
      <span class="text-[#666C79] text-sm font-normal">{formattedDay}</span>
    </h2>
  </div>
  <div
    class="grid grid-cols-8 gap-0 border-r-[0.5px] border-t-[0.5px] border-l-[0.5px] border-stroke-Primary b rounded-lg"
  >
    {#each hoursInDay as hourBlock}
      <div class="hour-cell flex justify-center items-center text-center py-4">
        {formatHour(hourBlock.hour)}
      </div>
      <div
        class="day-cell pb-3 flex sm:gap-3 text-center col-span-7 {isPastDateTime(
          hourBlock.dateTime
        )
          ? 'bg-[#F7F7F8]'
          : 'bg-white text-black'}"
        on:mouseenter={() => handleHover(hourBlock)}
        on:mouseleave={handleMouseLeave}
        role="gridcell"
        tabindex="0"
      >
        {#if hourBlock.events.length > 0}
          <div>
            <Button
              on:click={() => {
                openModalForHour(hourBlock);
              }}
              class="bg-[#FFF] border-2 border-blue-300 shadow-lg px-1 py-1 relative  top-3 rounded-lg text-[#252B37] font-normal text-sm"
            >
              {formatEventButtonLabel(
                hourBlock.events[0]?.events?.startDateTime
              )}
            </Button>
          </div>
        {/if}
        {#if hoveredDay === hourBlock && !isPastDateTime(hourBlock.dateTime)}
        <div class="mt-auto mx-auto space-y-2">
          <Button
            ScheduledBtn
            beforeIcon={AddMainBlue}
            on:click={() => {
              drawerMode = "schedule";
              RescheduleDrawer = false;
            }}>Schedule</Button
          >
        </div>
      {/if}
        {#if hourBlock.events.length > 0 && !isPastDateTime(hourBlock.dateTime)}
          {#if selectedHourForModal === hourBlock && showDateModal}
          <div class="absolute z-50 top-full left-18 text-start   mt-2 w-full">
            <DateModal
              open={true}
              startDateTime={formatEventButtonLabel(
                hourBlock.events[0]?.events?.startDateTime
              )}
              endDateTime={formatEventButtonLabel(
                hourBlock.events[0]?.events?.endDateTime
              )}
              on:close={closeModal}
              on:open-action-modal={handleOpenActionModal}
            />
          </div>

          {/if}
        {/if}
        {#if hoveredDay === hourBlock && !isPastDateTime(hourBlock.dateTime)}
          {#if showEventActionModal && selectedHourForModal === hourBlock}
          <div class="absolute z-50 top-full left-18   mt-2 w-full text-start">
            <EventActionModal
              show={true}
              fromDateTime={formatEventButtonLabel(
                hourBlock.events[0]?.events?.startDateTime
              )}
              toDateTime={formatEventButtonLabel(
                hourBlock.events[0]?.events?.endDateTime
              )}
              onReschedule={() => {
                drawerMode = "reschedule";
                RescheduleDrawer = false;
              }}
              on:close={handleCloseActionModal}
            />
      </div>

          {/if}
        {/if}
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
    <h2 class="text-xl font-normal text-[#0D1526]">  {drawerMode === "reschedule" ? "Reschedule" : "Schedule"}</h2>
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
  .hour-cell {
    border-bottom: 0.5px solid var(--Stroke-Primary, #d4d6d9);
    border-right: 0.5px solid var(--Stroke-Primary, #d4d6d9);
    color: var(--text-tartiary, #666c79);
    font-size: 14px;
  }

  .day-cell {
    font-size: 14px;
    border-bottom: 0.5px solid var(--Stroke-Primary, #d4d6d9);
    display: flex;
    align-items: flex-start;
    padding-left: 10px;
  }
  /* .image {
    border-radius: var(--rounded-sm, 2px);
    background: url(<path-to-image>) lightgray 50% / cover no-repeat;
    box-shadow:
      0px 20px 6px 0px rgba(0, 0, 0, 0),
      0px 13px 5px 0px rgba(0, 0, 0, 0.02),
      0px 7px 4px 0px rgba(0, 0, 0, 0.08),
      0px 3px 3px 0px rgba(0, 0, 0, 0.14),
      0px 1px 2px 0px rgba(0, 0, 0, 0.16);
  } */
  /* .timeline {
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
    .hour-cell,
    .day-cell {
      font-size: 12px;
      padding: 8px;
    }
  }

  @media (max-width: 768px) {
    .hour-cell,
    .day-cell {
      font-size: 10px;
      padding: 6px;
    }
  }

  @media (max-width: 640px) {
    .hour-cell,
    .day-cell {
      font-size: 8px;
      padding: 4px;
    }
    /* .embedCalendar {
      box-shadow: none;
    } */
    .day-cell {
      flex-direction: row;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
