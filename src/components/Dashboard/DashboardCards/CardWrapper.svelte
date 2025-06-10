<script lang="ts">
	import SwitchButton from '../../Button/SwitchButton.svelte';

	export let cardTitle: string = 'Title';
	export let cardSubtitle: string = '';
	export let linkHref: string = '';
	export let linkText: string = 'See all';
	export let showToggle: boolean = false;
	export let isEvent: boolean = false;

	let toggleOptions: { key: string; label: string }[] = [
		{ key: 'ticketSales', label: 'Ticket Sales' },
		{ key: 'revenue', label: 'Revenue' }
	];
	let activeToggleKey: string = 'revenue';
	const onToggle = (key: string) => {
		activeToggleKey = key;
	};
</script>

<div class="space-y-3 bg-white lg:p-6 p-4 rounded-lg overflow-hidden shadow-md w-full">
	<div class="flex justify-between items-start flex-wrap gap-2">
		<div>
			<h2
				class="lg:font-normal lg:text-xl lg:leading-7 font-medium text-base leading-6 whitespace-nowrap"
				class:w-[150px]={isEvent}
			>
				{cardTitle}
			</h2>
			{#if cardSubtitle}
				<p class="text-xs leading-5 text-gray-500 lg:block hidden">
					{cardSubtitle}
				</p>
			{/if}
		</div>

		{#if linkHref}
			<div>
				<a href={linkHref} class="font-medium text-sm text-blue-600 hover:underline">
					{linkText}
				</a>
			</div>
		{/if}

		{#if showToggle}
			<div>
				<SwitchButton options={toggleOptions} activeKey={activeToggleKey} {onToggle} />
			</div>
		{/if}
	</div>

	<slot />
</div>
