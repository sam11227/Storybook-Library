<script>
	export let quantities;
	export let checkoutTicket;
	export let eventTickets;
	export let isAgreed = true;
	export let btnText = 'Checkout';

	let subtotal = 0;
	let fees = 0;
	let taxes = 0;
	let total = 0;

	$: subtotal = Object.keys(quantities).reduce((acc, key) => {
		const ticket = eventTickets.find((t) => t.ID == key);
		if (!ticket) {
			return acc;
		}
		return acc + quantities[key] * ticket.price;
	}, 0);

	$: fees = Object.keys(quantities).reduce((acc, key) => {
		return acc + quantities[key] * 4.48;
	}, 0);

	$: taxes = subtotal * 0.08;

	$: total = subtotal + fees + taxes;
</script>

<div class="w-96 h-[31vh]">
	<div class="h-fit rounded-[8px] px-5 py-4 bg-[#FFFFFF] md:border md:border-[#D4D6D9]">
		<h2 class="text-xl font-semibold p-4">Order summary</h2>
		<hr />

		<div class="px-4 text-[#666C79]">
			{#each Object.keys(quantities) as key}
				{#if quantities[key] > 0}
					{#each eventTickets as ticket}
						{#if ticket.ID == key}
							<div class="flex justify-between py-2">
								<span>{ticket.name} × {quantities[key]}</span>
								<span>${(quantities[key] * ticket.price).toFixed(2)}</span>
							</div>
						{/if}
					{/each}
				{/if}
			{/each}
			<hr />
			<div class="flex justify-between mt-4 mb-2">
				<span>Subtotal</span>
				<span>${subtotal.toFixed(2)}</span>
			</div>
			<div class="flex justify-between mb-2">
				<span>Fees</span>
				<span>${fees.toFixed(2)}</span>
			</div>
			<div class="flex justify-between mb-4">
				<span>Taxes</span>
				<span>${taxes.toFixed(2)}</span>
			</div>
			<hr />
			<div class="flex justify-between py-4">
				<span>Promo code discounts</span>
				<span>-</span>
			</div>
			<hr />
			{#if Object.values(quantities).some((qty) => qty > 0) && isAgreed}
				<div class="flex justify-between items-center font-semibold py-4">
					<span>Total</span>
					<span>${total.toFixed(2)}</span>
				</div>

				<button
					class="w-full py-2.5 px-5 rounded-lg h-[40px]
          {isAgreed ? 'bg-[#1A56DB] text-white' : 'bg-gray-400 text-gray-300 cursor-not-allowed'}"
					on:click={checkoutTicket}
				>
					{btnText}
				</button>
			{/if}
		</div>
	</div>
</div>
