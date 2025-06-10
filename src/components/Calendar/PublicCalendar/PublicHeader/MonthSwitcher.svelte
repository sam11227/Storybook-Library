<script>
  export let currentYear;
  export let currentMonth;
  export let handleNext;
  export let handlePrev;

  import LeftArrow from "./../../../../assets/svg/arrow-Left-01.svg";
  import RightArrow from "./../../../../assets/svg/arrow-right-01.svg";
</script>

<header class="w-full flex items-center justify-between px-2 mx-auto max-w-6xl">
  <div class="flex items-center h-full">
    <button
      class="border cursor-pointer outline-none border-stroke-Primary rounded-full p-2"
      on:click={handlePrev}
    >
      <img class="w-5 h-5" src={LeftArrow} alt="Previous" />
    </button>
  </div>
  <h2
    class="text-[#0D1526] pb-5 pt-5 text-center text-xl leading-[20px] font-normal"
  >
    {new Intl.DateTimeFormat("en", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(currentYear, currentMonth)))}
  </h2>
  <div class="flex items-center justify-center">
    <button
      class="border cursor-pointer outline-none border-stroke-Primary rounded-full p-2"
      on:click={handleNext}
    >
      <img class="w-5 h-5" src={RightArrow} alt="Next" />
    </button>
  </div>
</header>
