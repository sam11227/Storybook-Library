<script>
	import { createEventDispatcher } from 'svelte';
	import Button from '../Button/Button.svelte';

	export let show = false;
	export let title = 'Are you sure?';
	export let description = '';
	export let Actions = [];
	export let Items = [];
	export let PriceBreakdown = [];
	export let total = '';
	export let totalValue = '';
	export let modalClasses = '';
	export let hideBorder = false;

	const dispatch = createEventDispatcher();

	const handleAction = (action) => {
		action?.onClick?.();
		dispatch(action.label.toLowerCase());
	};

	const stopPropagation = (event) => event.stopPropagation();

	const closeModal = () => {
		show = false;
		dispatch('close');
	};
</script>

{#if show}
	<button
		type="button"
		class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 w-full ${hideBorder
			? ''
			: 'border-0'}"
		on:click={closeModal}
	>
		<button
			type="button"
			class={`bg-white rounded-lg shadow-lg w-96 max-w-md ${modalClasses} `}
			on:click={stopPropagation}
		>
			<div class="p-3">
				<div class="flex px-6 py-4 text-left">
					<h3 class="text-xl font-normal text-gray-800">{title}</h3>
				</div>
				<div class="px-6 py-0 text-left">
					{#if description}
						<p class="text-sm font-medium text-gray-500 mb-4">{description}</p>
					{/if}
					<slot />
				</div>
				<div class="flex justify-around gap-3 p-3 pt-4">
					{#each Actions as action}
						<Button
							size="full"
							{...action}
							beforeIcon={action.beforeIcon}
							afterIcon={action.lightbtn}
							on:click={() => handleAction(action)}
							danger={action.danger}
							strokebtn={action.class}
						>
							{action.label}
						</Button>
					{/each}
				</div>
			</div>
		</button>
	</button>
{/if}
