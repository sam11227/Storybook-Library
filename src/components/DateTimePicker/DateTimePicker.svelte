<script>
  import { writable } from "svelte/store";
  import { createEventDispatcher, onMount } from "svelte";
  import Button from "../Button/Button.svelte";

  import CalendarIcon from "../../assets/icons/calendar-month.svg";
  import ArrowLeft from "../../assets/icons/arrow-left.svg";
  import ArrowRight from "../../assets/icons/arrow-right.svg";

  export let id = "";
  export let name = "";
  export let required = false;
  export let value = "";
  export let min = "";
  export let className = "";

  const dispatch = createEventDispatcher();

  let selectedDate = writable("");
  let selectedHour = writable("01");
  let selectedMinute = writable("00");
  let selectedMeridiem = writable("AM");
  let inputValue = writable("");
  let inputElement;
  let pickerContainer;

  let hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  let isDatePickerOpen = writable(false);

  let currentMonth = writable(new Date().getMonth());
  let currentYear = writable(new Date().getFullYear());

  const now = new Date();
  const formattedDate = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}/${now.getFullYear()}`;
  const hoursNow = String(now.getHours() % 12 || 12).padStart(2, "0");
  const minutesNow = String(now.getMinutes()).padStart(2, "0");
  const meridiemNow = now.getHours() >= 12 ? "PM" : "AM";

  onMount(() => {
    const handleClickOutside = (event) => {
      if (
        pickerContainer &&
        !pickerContainer.contains(event.target) &&
        !inputElement.contains(event.target)
      ) {
        isDatePickerOpen.set(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  $: {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        selectedDate.set(
          `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`
        );
        selectedHour.set(String(date.getHours() % 12 || 12).padStart(2, "0"));
        selectedMinute.set(String(date.getMinutes()).padStart(2, "0"));
        selectedMeridiem.set(date.getHours() >= 12 ? "PM" : "AM");
        updateInputValue(false);
      }
    } else {
      selectedDate.set(formattedDate);
      selectedHour.set(hoursNow);
      selectedMinute.set(minutesNow);
      selectedMeridiem.set(meridiemNow);
      updateInputValue(false);
    }
  }

  $: minDate = min ? new Date(min) : null;

  function toggleDatePicker() {
    isDatePickerOpen.update((state) => !state);
  }

  function openDatePicker() {
    isDatePickerOpen.set(true);
  }

  function selectDate(date) {
    if (date === "Today") {
      selectedDate.set(formattedDate);
      selectedHour.set(hoursNow);
      selectedMinute.set(minutesNow);
      selectedMeridiem.set(meridiemNow);
    } else {
      selectedDate.set(date);
    }
    updateInputValue();
  }

  function selectHour(hour) {
    selectedHour.set(hour);
    updateInputValue();
  }

  function selectMinute(minute) {
    selectedMinute.set(minute);
    updateInputValue();
  }

  function selectMeridiem(meridiem) {
    selectedMeridiem.set(meridiem);
    updateInputValue();
  }

  function formatDateTime(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function updateInputValue(dispatchEvents = true) {
    const [month, day, year] = $selectedDate.split("/");

    let hours24 = parseInt($selectedHour);
    if ($selectedMeridiem === "PM" && hours24 < 12) {
      hours24 += 12;
    } else if ($selectedMeridiem === "AM" && hours24 === 12) {
      hours24 = 0;
    }

    const dateObj = new Date(
      year,
      parseInt(month) - 1,
      day,
      hours24,
      parseInt($selectedMinute)
    );
    const formattedDateTime = formatDateTime(dateObj);

    inputValue.set(formattedDateTime);

    value = formattedDateTime;

    if (dispatchEvents) {
      dispatch("input", formattedDateTime);
      dispatch("change", formattedDateTime);
    }
  }

  function handleInputChange(e) {
    const newValue = e.target.value;
    inputValue.set(newValue);
    value = newValue;

    if (newValue) {
      const date = new Date(newValue);
      if (!isNaN(date.getTime())) {
        selectedDate.set(
          `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`
        );
        selectedHour.set(String(date.getHours() % 12 || 12).padStart(2, "0"));
        selectedMinute.set(String(date.getMinutes()).padStart(2, "0"));
        selectedMeridiem.set(date.getHours() >= 12 ? "PM" : "AM");

        currentMonth.set(date.getMonth());
        currentYear.set(date.getFullYear());
      }
    }

    dispatch("input", newValue);
  }

  function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  function firstDayOfMonth(month, year) {
    return new Date(year, month, 1).getDay();
  }

  function prevMonth() {
    currentMonth.update((month) => {
      if (month === 0) {
        currentYear.update((year) => year - 1);
        return 11;
      }
      return month - 1;
    });
  }

  function nextMonth() {
    currentMonth.update((month) => {
      if (month === 11) {
        currentYear.update((year) => year + 1);
        return 0;
      }
      return month + 1;
    });
  }

  function isDateDisabled(year, month, day) {
    if (!minDate) return false;

    const currentDate = new Date(year, month, day);
    return currentDate < minDate;
  }

  function applySelection() {
    updateInputValue();
    toggleDatePicker();
  }

  function clearSelection() {
    inputValue.set("");
    value = "";
    toggleDatePicker();
    dispatch("input", "");
    dispatch("change", "");
  }

  $: daysArray = Array.from(
    { length: daysInMonth($currentMonth, $currentYear) },
    (_, i) => i + 1
  );

  $: leadingBlanks = Array(firstDayOfMonth($currentMonth, $currentYear)).fill(
    null
  );
</script>

<div class="relative w-full {className}">
  <div class="flex items-center">
    <input
      type="datetime-local"
      {id}
      {name}
      {required}
      {min}
      class="w-full bg-[#F9FAFB] border border-[#D1D5DB] rounded-lg px-4 py-3 text-[#6B7280] text-sm leading-[17.5px]"
      on:input={handleInputChange}
      on:click={openDatePicker}
      bind:value={$inputValue}
      bind:this={inputElement}
    />

    <button
      type="button"
      class="absolute right-2 p-2"
      on:click={toggleDatePicker}
    >
      <img src={CalendarIcon} alt="Calendar Icon" />
    </button>
  </div>

  {#if $isDatePickerOpen}
    <div
      class="absolute top-12 md:left-1 left-[-9rem] w-[350px] md:w-[500px] bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-10"
      bind:this={pickerContainer}
    >
      <div class="flex justify-between items-center">
        <div>
          <div>
            <div class="flex items-center justify-between px-1 pb-2">
              <button type="button" on:click={prevMonth}>
                <img src={ArrowLeft} alt="Left Icon" />
              </button>
              <span class="text-gray-900 text-[12px] font-bold leading-[18px]">
                {new Date($currentYear, $currentMonth).toLocaleString(
                  "default",
                  {
                    month: "long",
                  }
                )}{" "}
                {$currentYear}
              </span>
              <button type="button" on:click={nextMonth}>
                <img src={ArrowRight} alt="Right icon" />
              </button>
            </div>

            <div
              class="grid grid-cols-7 gap-1 text-center text-sm leading-[18px] font-normal text-gray-900"
            >
              <div class="text-[#6B7280] mt-2 mb-2 ml-1 mr-1">Sun</div>
              <div class="text-[#6B7280] mt-2 mb-2 ml-1 mr-1">Mon</div>
              <div class="text-[#6B7280] mt-2 mb-2 ml-1 mr-1">Tue</div>
              <div class="text-[#6B7280] mt-2 mb-2 ml-1 mr-1">Wed</div>
              <div class="text-[#6B7280] mt-2 mb-2 ml-1 mr-1">Thu</div>
              <div class="text-[#6B7280] mt-2 mb-2 ml-1 mr-1">Fri</div>
              <div class="text-[#6B7280] mt-2 mb-2 ml-1 mr-1">Sat</div>

              {#each leadingBlanks as _}
                <div></div>
              {/each}

              {#each daysArray as day}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  class="cursor-pointer p-2 rounded-lg {isDateDisabled(
                    $currentYear,
                    $currentMonth,
                    day
                  )
                    ? 'text-gray-300 cursor-not-allowed'
                    : $selectedDate ===
                        `${String($currentMonth + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}/${$currentYear}`
                      ? 'bg-[#0284fe] text-white'
                      : 'hover:bg-blue-100'}"
                  on:click={() => {
                    if (!isDateDisabled($currentYear, $currentMonth, day)) {
                      selectDate(
                        `${String($currentMonth + 1).padStart(2, "0")}/${String(
                          day
                        ).padStart(2, "0")}/${$currentYear}`
                      );
                    }
                  }}
                >
                  {day}
                </div>
              {/each}
            </div>
          </div>
          <div class="gap-1 flex justify-between items-end mt-4">
            <Button
              type="button"
              size="full"
              on:click={() => selectDate("Today")}
              disabled={minDate && minDate > new Date()}
            >
              Today
            </Button>
            <Button
              type="button"
              strokebtn
              size="full"
              on:click={clearSelection}
            >
              Clear
            </Button>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 ml-4 -translate-y-0.5">
          <div
            class="overflow-auto h-full text-[12px] text-center leading-[18px] font-normal"
          >
            <!-- Hour Picker -->
            {#each hours as hour}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div
                class="cursor-pointer p-2 rounded-lg {$selectedHour === hour
                  ? 'bg-[#0284fe] text-white text-[12px] font-medium leading-[18px] text-center'
                  : 'hover:bg-blue-100'}"
                on:click={() => selectHour(hour)}
              >
                {hour}
              </div>
            {/each}
          </div>

          <div
            class="text-[12px] text-center leading-[18px] font-normal"
          >
            <!-- Minute Picker -->
            {#each ["00", "15", "30", "45"] as minute}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div
                class="cursor-pointer p-2 rounded-lg {$selectedMinute === minute
                  ? 'bg-[#0284fe] text-white text-[12px] font-medium leading-[18px] text-center'
                  : 'hover:bg-blue-100'}"
                on:click={() => selectMinute(minute)}
              >
                {minute}
              </div>
            {/each}
          </div>

          <div
            class=" text-[12px] text-center leading-[18px] font-normal"
          >
            {#each ["AM", "PM"] as meridiem}
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                class="cursor-pointer p-2 rounded-lg {$selectedMeridiem ===
                meridiem
                  ? 'bg-[#0284fe] text-white text-[12px] font-medium leading-[18px] text-center'
                  : 'hover:bg-blue-100'}"
                on:click={() => selectMeridiem(meridiem)}
              >
                {meridiem}
              </div>
            {/each}
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-4">
        <Button type="button" on:click={applySelection}>Apply</Button>
      </div>
    </div>
  {/if}
</div>

<style>
  .overflow-auto {
    overflow-y: auto;
    max-height: 250px;
  }
  .overflow-auto::-webkit-scrollbar {
    width: 0px;
  }
</style>
