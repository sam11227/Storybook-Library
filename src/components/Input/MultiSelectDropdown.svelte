<script>
	import { createEventDispatcher } from 'svelte';

	const dispatcher = createEventDispatcher();

	export let availableOptions = [];
	export let placeholder = 'Search or add...';
	export let selectedOptions = [];
	let inputValue = '';
	let filteredOptions = [];
	let isOpen = false;

	const removeOption = (option) => {
		selectedOptions = selectedOptions.filter((item) => item !== option);
	};

	const addOption = (option) => {
		if (!selectedOptions.includes(option)) {
			selectedOptions = [...selectedOptions, option];
			inputValue = '';
			filteredOptions = [];
			dispatcher('change', { selectedOptions });
		}
	};

	const toggleDropdown = () => {
		isOpen = !isOpen;
		if (isOpen) {
			filteredOptions = availableOptions.filter((option) => !selectedOptions.includes(option));
		}
	};

	const handleOutsideClick = (event) => {
		if (!event.target.closest('.multi-select-dropdown')) {
			isOpen = false;
		}
	};

	//   window.addEventListener("click", handleOutsideClick);
</script>

<div
	class="flex items-center flex-wrap gap-2 bg-[#F7F7F8] border border-gray-300 rounded-md p-2 ring-1 ring-gray-400"
>
	<!-- Selected tags -->
	{#each selectedOptions as option}
		<div class="bg-white flex items-center px-2 py-1 rounded-md border-2 border-gray-300">
			<span class="mr-2">{option}</span>
			<button
				class="text-gray-500 hover:text-gray-700 focus:outline-none"
				on:click={() => removeOption(option)}
			>
				✕
			</button>
		</div>
	{/each}

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore missing-declaration -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="bg-[#F7F7F8] border-none focus:ring-0 outline-none p-1 flex-grow cursor-pointer"
		on:click={toggleDropdown}
	>
		{placeholder}
	</div>
</div>

<!-- Autocomplete dropdown -->
{#if isOpen}
	<ul class="dropdown-menu border border-gray-300 rounded-lg mt-2 max-h-40 overflow-y-auto">
		{#each availableOptions as option}
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li class="p-2 hover:bg-gray-100 cursor-pointer" on:click={() => addOption(option)}>
				{option}
			</li>
		{/each}
	</ul>
{/if}

<style>
	input::placeholder {
		color: #a0aec0; /* Tailwind's gray-400 */
	}

	.dropdown-menu::-webkit-scrollbar {
		display: none;
	}
</style>
