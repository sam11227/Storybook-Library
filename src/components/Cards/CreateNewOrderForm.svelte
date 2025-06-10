<script>
	import { Card, Label } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import Input from '../Input/Input.svelte';
	import TicketSelector from './TicketSelector.svelte';

	export let customerName = '';
	export let customerEmail = '';
	export let tickets = [];
	export let errors = {};

	const dispatch = createEventDispatcher();

	function handleQuantityChange(event) {
		dispatch('quantityChange', event.detail);
	}

	$: console.log('Updated tickets:', JSON.stringify(tickets));
</script>

<Card size="xl">
	<div>
		<h2 class="text-xl font-normal text-gray-900 mb-4">Customer information</h2>
		<div class="grid grid-cols-2 gap-4 mb-2">
			<div>
				<div class="mb-6">
					<Label for="default-input" class="block mb-2">Customer name</Label>
					<Input
						className="font-normal text-sm text-gray-500"
						size="full"
						id="default-input"
						placeholder="John Doe"
						bind:value={customerName}
					/>
					{#if errors?.name}
						<p class="text-red-500 text-sm mt-1">{errors.name}</p>
					{/if}
				</div>
			</div>
			<div>
				<div class="mb-6 text-nowrap">
					<Label for="default-input" class="block mb-2">Customer email address</Label>
					<Input
						placeholder="john.doe@gmail.com"
						className="font-normal text-sm text-gray-500"
						id="email"
						name="email"
						type="email"
						size="full"
						bind:value={customerEmail}
					/>
					{#if errors?.email}
						<p class="text-red-500 text-sm mt-1">{errors.email}</p>
					{/if}
				</div>
			</div>
		</div>

		<h3 class="text-lg font-normal text-gray-900 mb-4">Select ticket type</h3>

		{#each tickets as ticket (ticket.ID)}
			<TicketSelector {ticket} on:quantityChange={handleQuantityChange} />
		{/each}
	</div>
</Card>
