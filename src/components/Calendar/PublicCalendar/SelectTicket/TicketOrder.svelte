<script>
	import Cancel from './../../../../assets/svg/cancel-upload.svg';
	import Input from './../../../Input/Input.svelte';
	import OrderSummary from './OrderSummary.svelte';
	import TicketSection from './TicketSection.svelte';

	import { CloseButton, Drawer } from 'flowbite-svelte';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';
	import { formatDateTime, formatTimeline } from '../../../../utils/utils';
	import UPIcon from './../../../../assets/icons/chevron-down.svg';

	export let selectedEvent;
	export let goToCheckout;

	let hidden8 = true;
	let transitionParamsBottom = {
		y: 320,
		duration: 200
	};
	$: subtotal = quantities.mezzanine * 34.48 + quantities.general * 24.48 + quantities.vip * 44.48;
	$: fees = (quantities.mezzanine + quantities.general + quantities.vip) * 4.48;
	$: taxes = subtotal * 0.08;
	$: total = subtotal + fees + taxes;

	let selectedTickets = '';
	let isAgreed = false;

	let lowestPrice = 0;
	let highestPrice = 0;
	function findLowestAndHighestPrices(tickets) {
		if (!tickets || tickets.length === 0) return;
		const prices = tickets.map((ticket) => parseFloat(ticket.price));
		lowestPrice = Math.min(...prices);
		highestPrice = Math.max(...prices);
	}
	$: quantities = {};

	const handleQuantityChange = (type, delta) => {
		quantities[type] += delta;
		if (quantities[type] < 0) quantities[type] = 0;
		quantities = { ...quantities };

		Cookies.set('checkout-quantities', JSON.stringify(quantities));
	};
	onMount(() => {
		findLowestAndHighestPrices(selectedEvent.detail.availableTickets);

		selectedEvent.detail.availableTickets.forEach((ticket) => {
			quantities[ticket.ID] = 0;
		});
	});
</script>

<div class="w-full mx-auto md:p-4 flex gap-5 flex-wrap">
	<div class="flex-1">
		<div class="bg-white rounded-[8px] shadow-sm md:border-[1px] border-[#E5E7EB] py-3">
			<div class="flex justify-between items-center px-4 py-2">
				<h1 class="text-2xl font-semibold">{selectedEvent.detail.name}</h1>
				<button class="text-gray-400">
					<img
						src={Cancel}
						alt="Cancel"
						on:click={() =>
							(window.location.href = 'http://localhost:8080/ticketing/venues/1/showsandtickets')}
					/>
				</button>
			</div>

			<div class="px-4 text-xs">
				<p class="text-gray-600 mb-4">
					{formatDateTime(selectedEvent.detail.startDateTime)} (Doors: {formatTimeline(
						selectedEvent.detail.doorsOpenTime
					)})
				</p>
			</div>
			<hr />
			<div class="p-4">
				<Input
					controlled={true}
					buttonText="Apply"
					size="full"
					placeholder="Enter promo code"
					errorText="Invalid promo code"
				/>
			</div>
			<div class="space-y-3 px-3">
				{#each selectedEvent.detail.availableTickets as ticket}
					<div class="rounded-[8px]">
						<TicketSection
							title={ticket.name}
							description={ticket.description}
							price={ticket.price}
							quantity={quantities[ticket.ID]}
							soldOut={ticket.soldOut}
							on:increment={() => handleQuantityChange(ticket.ID, 1)}
							on:decrement={() => handleQuantityChange(ticket.ID, -1)}
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="lg:block hidden">
		<OrderSummary
			btnText="Checkout"
			checkoutTicket={goToCheckout}
			{quantities}
			eventTickets={selectedEvent.detail.availableTickets}
		/>
	</div>
	<Drawer
		placement="bottom"
		width="w-full"
		height="h-screen"
		transitionType="fly"
		transitionParams={transitionParamsBottom}
		bind:hidden={hidden8}
		id="sidebar8"
		class="block lg:hidden"
	>
		<div class="w-full h-screen flex flex-col bg-[#FFF]">
			<div class="h-fit rounded-[8px] px-5 py-4 bg-[#FFF] md:border md:border-[#D4D6D9]">
				<div class="flex justify-between py-5 items-center">
					<h2 class="text-xl font-semibold">Order Summary</h2>
					<CloseButton on:click={() => (hidden8 = true)} class="text-gray-400" />
				</div>
				<hr />
				<div class="flex-1 overflow-y-auto px-4 text-[#666C79]" />
				{#each Object.keys(quantities) as key}
					{#if quantities[key] > 0}
						{#each selectedEvent.detail.availableTickets as ticket}
							{#if ticket.name === key}
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
				{#if quantities.general > 0 || (quantities.mezzanine > 0 && isAgreed)}
					<div class="flex justify-between items-center font-semibold py-4">
						<span>Total</span>
						<span>${total.toFixed(2)}</span>
					</div>
				{/if}
			</div>
		</div>
	</Drawer>
</div>
<div class="md:hidden flex flex-row border-t border-[#E5E7EB] px-6 pt-4 pb-6 justify-between gap-6">
	<div class="flex flex-col justify-between gap-1 w-[165px]">
		<button
			class="flex gap-1"
			on:click={() =>
				(selectedTickets = selectedTickets === 'tickets' ? '' : 'tickets')((hidden8 = false))}
		>
			<span class="text-[10px] font-[400] leading-[15px] text-[#6B7280]">
				{quantities.mezzanine + quantities.general + quantities.vip}
				<span>
					{quantities.mezzanine + quantities.general + quantities.vip > 1 ? 'Tickets' : 'Ticket'}
				</span>
			</span>
			<img class="my-auto" src={UPIcon} alt="sort-icon" />
		</button>
		<span class="text-[16px] font-semibold leading-[20px] text-[#111928]">
			${total.toFixed(2)}
		</span>
	</div>

	<div>
		<button
			class="py-2.5 px-5 rounded-lg h-[40px] w-[165px] bg-[#1A56DB] text-white"
			on:click={goToCheckout}
		>
			Checkout
		</button>
	</div>
</div>
