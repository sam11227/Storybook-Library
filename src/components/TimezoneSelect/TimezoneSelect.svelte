<script>
  import { createEventDispatcher } from "svelte";

  export let id = "timezones";
  export let name = "timezone";
  export let value = "America/New_York";
  export let required = false;
  export let label = "Time zone";
  export let showLabel = true;
  export let customClass = "";

  const timezones = [
    { value: "America/New_York", label: "EST - GMT-5 (New York)" },
    { value: "America/Los_Angeles", label: "PST - GMT-8 (Los Angeles)" },
    { value: "Europe/London", label: "GMT - GMT+0 (London)" },
    { value: "Europe/Paris", label: "CET - GMT+1 (Paris)" },
    { value: "Asia/Tokyo", label: "JST - GMT+9 (Tokyo)" },
    { value: "Australia/Sydney", label: "AEDT - GMT+11 (Sydney)" },
    { value: "Canada/Mountain", label: "MST - GMT-7 (Canada)" },
    { value: "Canada/Central", label: "CST - GMT-6 (Canada)" },
    { value: "Canada/Eastern", label: "EST - GMT-5 (Canada)" },
    { value: "Europe/Berlin", label: "CET - GMT+1 (Berlin)" },
    { value: "Asia/Dubai", label: "GST - GMT+4 (Dubai)" },
    { value: "Asia/Singapore", label: "SGT - GMT+8 (Singapore)" },
    {
      value: "California USA",
      label: "(GMT -0800) Los Angeles, California USA",
    },
  ];

  const dispatch = createEventDispatcher();

  function handleChange(event) {
    value = event.target.value;
    dispatch("change", { value });
  }
</script>

<div class="timezone-select-container w-full md:w-1/2 mt-2">
  {#if showLabel}
    <label
      for={id}
      class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
    >
      {label}
      {#if required}<span style="color: red;">*</span>{/if}
    </label>
  {/if}

  <select
    {id}
    {name}
    {required}
    {value}
    on:change={handleChange}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 {customClass}"
  >
    {#each timezones as timezone}
      <option value={timezone.value} selected={value === timezone.value}>
        {timezone.label}
      </option>
    {/each}
  </select>
</div>

<style>
  select {
    appearance: auto;
    -webkit-appearance: auto;
    -moz-appearance: auto;
  }
</style>
