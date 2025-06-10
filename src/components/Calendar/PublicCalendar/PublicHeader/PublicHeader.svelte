<script>
  import { createEventDispatcher } from "svelte";
  import SearchIcon from "./../../../../assets/svg/searchIcon.png";
  import Button from "../../../Button/Button.svelte";

  export let PublicOptions = [];
  export let publicView;
  export let selectOption = () => {};

  let searchQuery = "";
  let isDropdownVisible = false;
  let isSearchDisabled = true;
  const dispatch = createEventDispatcher();

  $: selectedOption = PublicOptions.find((option) => option.id === $publicView);

  function toggleDropdown() {
    isDropdownVisible = !isDropdownVisible;
  }

  function hideDropdown() {
    isDropdownVisible = false;
  }

  function handleSelect(option) {
    selectOption(option);
    hideDropdown();
  }

  function handleInput(event) {
    searchQuery = event.target.value;
    isSearchDisabled = searchQuery.trim() === "";
  }

  function handleSearch() {
    dispatch("search", { query: searchQuery });
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      if (isSearchDisabled) {
        searchQuery = "";
        dispatch("search", { query: "" });
      } else {
        handleSearch();
      }
    }
  }
</script>

<header class="w-full mt-2 relative">
  <nav
    class="w-full sm:max-w-6xl mx-auto flex gap-2 items-center justify-between py-2"
  >
    <div class="relative w-full">
      <img
        class="size-4 absolute top-[19.5px] left-4"
        src={SearchIcon}
        alt="Search"
      />
      <input
        type="text"
        class="pl-10 pr-24 h-[56px] rounded-lg bg-BG-Primary border border-stroke-Primary w-full focus:outline-none focus:ring-0"
        placeholder="Search show title"
        bind:value={searchQuery}
        on:input={handleInput}
        on:keydown={handleKeyDown}
      />
      <div class="absolute top-[9px] right-4">
        <Button size="full" disabled={isSearchDisabled} on:click={handleSearch}>
          Search
        </Button>
      </div>
    </div>
    <button
      on:click={toggleDropdown}
      class="size-[56px] bg-BG-Primary rounded-lg flex items-center justify-center border {isDropdownVisible
        ? 'border-[#1C64F2]'
        : 'border-stroke-Primary'}"
    >
      <img
        src={selectedOption?.icon}
        class="w-[22px] object-cover"
        alt="Selected Option Icon"
      />
    </button>
  </nav>

  <div
    class={`absolute bg-BG-Primary flex items-center justify-center rounded-lg right-2 -translate-y-1 w-[200px] h-[151px] shadow-lg ${isDropdownVisible ? "block z-30" : "hidden"}`}
  >
    <div class="flex flex-col space-y-[20px]">
      {#each PublicOptions as option}
        <button
          class="rounded-full cursor-pointer flex items-center gap-2.5"
          on:click={() => handleSelect(option)}
        >
          <input
            type="radio"
            class="appearance-none size-[16px] border border-[#D1D5DB] bg-[#F9FAFB] rounded-full checked:bg-BG-Primary checked:border-[3px] checked:border-indigo-600"
            checked={$publicView === option.id}
            on:change={() => handleSelect(option)}
          />
          <div class="flex items-center gap-2">
            <img class="size-[12px]" src={option.icon} alt={option.text} />
            <h1 class="font-medium leading-[21px] text-gray-900 text-[14px]">
              {option.text}
            </h1>
          </div>
        </button>
      {/each}
    </div>
  </div>
</header>
