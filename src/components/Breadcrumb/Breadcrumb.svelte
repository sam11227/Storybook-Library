<script>
	import { HomeSolid } from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';

	export let data = [];

	const dispatch = createEventDispatcher();

	function handleClick(crumb) {
		dispatch('click', crumb);
	}
</script>

<div
	style="align-items:center;display:flex;flex-direction:row;color:#353b4b;font-size:12px;padding-bottom:16px;"
>
	{#each data as crumb, index}
		{#if index > 0}
			<!-- <AngleRightSolid size="xs" style="margin-right: 8px;" /> -->
		{/if}
		{#if index === 0}
			<HomeSolid size="xs" style="margin-right: 8px;" />
		{/if}
		{#if index === data.length - 1}
			<span style="margin-right: 8px;">{crumb.name}</span>
		{:else}
			<a style="margin-right: 8px;" href={crumb.href} on:click={() => handleClick(crumb)}>
				{crumb.name}
			</a>
		{/if}
	{/each}
</div>
