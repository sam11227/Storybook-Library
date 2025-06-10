<script>
	import AddLarge from 'carbon-icons-svelte/lib/AddLarge.svelte';
	import Subtract from 'carbon-icons-svelte/lib/Subtract.svelte';
	import { createEventDispatcher } from 'svelte';

	export let ticket = {
		id: '',
		name: '',
		price: 0,
		availability: 0,
		totalTickets: 0,
		color: '',
		quantity: 0
	};

	const dispatch = createEventDispatcher();
	$: quantity = ticket.quantity || 0;

	function increment() {
		if (quantity < ticket.availability) {
			quantity += 1;
			dispatch('quantityChange', { ticket, quantity });
		}
	}

	function decrement() {
		if (quantity > 0) {
			quantity -= 1;
			dispatch('quantityChange', { ticket, quantity });
		}
	}
</script>

<div class="grid grid-cols-12 gap-4 items-center mb-6">
	<div class="col-span-8 md:col-span-6 flex gap-4">
		<div class="flex items-center border rounded-lg h-9">
			<button
				class="w-8 h-9 flex items-center justify-center border-r rounded-l-lg bg-gray-100 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
				on:click={decrement}
				disabled={quantity === 0}
			>
				<Subtract class="w-4 h-4 text-gray-900" />
			</button>

			<span class="w-12 h-9 flex items-center justify-center text-gray-500 text-sm font-medium">
				{quantity}
			</span>

			<button
				class="w-8 h-9 flex items-center justify-center border-l rounded-r-lg bg-gray-100 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
				on:click={increment}
				disabled={quantity >= ticket.availability}
			>
				<AddLarge class="w-4 h-4 text-gray-900" />
			</button>
		</div>
		<div class="text-nowrap">
			<h2 class="font-semibold text-gray-900 text-sm md:text-base">
				{ticket.name}
			</h2>
			<h3 class="text-gray-500 text-xs md:text-sm font-medium">
				${ticket.price} each
			</h3>
		</div>
	</div>
	<div class="col-span-4 md:col-span-6 flex justify-end md:justify-end">
		<div class="w-24 md:w-56 text-right md:text-left">
			<p class="text-xs text-gray-500">
				{ticket.totalTickets - ticket.availability}/{ticket.totalTickets}
			</p>
			<div class="h-2 bg-gray-200 rounded">
				<div
					class="h-2 rounded-full"
					class:bg-red-500={ticket.color === 'red'}
					class:bg-yellow-500={ticket.color === 'yellow'}
					class:bg-green-500={ticket.color === 'green'}
					style="width: {(1 - ticket.availability / ticket.totalTickets) * 100}%"
				/>
			</div>
		</div>
	</div>
</div>
