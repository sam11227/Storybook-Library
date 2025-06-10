<script>
  import { formatHour } from "../../../../utils/utils";
  export let day;
  export let date;
  export let time;
  export let isSelected = false;

  const handleCardClick = () => {
    isSelected = !isSelected;
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:click={handleCardClick}
  class="border-2 w-[88px] h-[106px] rounded-[8px] bg-[#FFFFFF] flex flex-col justify-center items-center gap-1.5 cursor-pointer {isSelected
    ? 'border-brand-Primary'
    : 'border-[#D4D6D9]'}"
>
  <span class="font-medium text-sm text-[#666C79]">{day}</span>
  <span
    class="font-medium text-[16px] {isSelected
      ? 'text-[#1C64F2]'
      : 'text-[#0D1526]'}">{date}</span
  >
  <span class="font-medium text-sm text-[#666C79]">{formatHour(time)}</span>
</div>

<style>
  .cursor-pointer {
    transition: border-color 0.3s ease-in-out;
  }
</style>
