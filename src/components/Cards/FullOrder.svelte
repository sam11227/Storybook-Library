<script>
  export let image = "";
  export let title = "";
  export let date = "";
  export let day = "";
  export let startTime = "";
  export let club = "";
  export let capacity = "";
  export let capacityPercentage = 0;
  const color =
    capacityPercentage < 30
      ? "bg-red-500"
      : capacityPercentage < 70
        ? "bg-yellow-500"
        : "bg-green-500";

  export let onSelectCheckBox;
</script>

<div class=" items-start p-4 bg-white border-b border-gray-200 shadow-sm">
  <div class="flex-shrink-0 flex space-x-4">
    <input
      type="radio"
      on:click={onSelectCheckBox}
      name="event"
      class="mr-2 mt-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
    />
    <img src={image} alt={title} class="w-10 h-10 rounded" />
    <h3 class="text-sm font-normal text-Text-Secondary mt-2">{title}</h3>
  </div>

  <div class="flex mt-2">
    <div class="grid grid-cols-2 gap-6 mt-5">
      <div>
        <div class="font-semibold text-xs text-gray-500">Date</div>
        <div class="text-sm font-normal text-text-tartiary">{date}</div>
        <div class="text-gray-400 font-normal text-sm">{day}</div>
      </div>
      <div class="pl-12">
        <div class="text-gray-500 font-semibold text-xs">Start date</div>
        <div class="text-sm font-normal text-text-tartiary">
          {startTime}
        </div>
      </div>
      <div>
        <div class="text-gray-500 font-semibold text-xs">Club</div>
        <div class="text-sm font-normal text-gray-400">{club}</div>
      </div>
      <div class="pl-12">
        <div class="text-gray-500 font-semibold text-xs">Capacity</div>
        <div class="text-xs font-normal text-gray-500">
          {capacity}
        </div>
        <div class="gap-2 w-full">
          <div class="h-2 w-full bg-gray-200 rounded-full">
            <div
              class="h-2 {color} rounded-full"
              style="width: {capacityPercentage}%"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
