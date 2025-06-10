<script>
	import Icon from '../Icons/Icon.svelte';
	let searchQuery = '';
	let items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
	let filteredItems = items;

	function handleInput() {
		filteredItems = items.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
	}
</script>

<div class="relative w-full max-w-[400px]">
	<div
		class="w-full bg-BG-Secondary dark:bg-BG-darkSecondary border border-stroke-Primary dark:border-stroke-darkPrimary rounded-lg flex flex-row items-center px-3"
	>
		<Icon name="search" size="20" />
		<input
			type="text"
			placeholder="Search"
			bind:value={searchQuery}
			on:input={handleInput}
			class="w-full bg-transparent border-none p-2 focus:ring-0 focus:outline-none"
		/>
	</div>

	{#if searchQuery.trim() !== ''}
		<ul
			class="w-full absolute bg-BG-Secondary dark:bg-BG-darkSecondary border border-stroke-Primary dark:border-stroke-darkPrimary p-3 rounded-lg"
		>
			{#each filteredItems as item}
				<li>{item}</li>
			{/each}
		</ul>
	{/if}
</div>
