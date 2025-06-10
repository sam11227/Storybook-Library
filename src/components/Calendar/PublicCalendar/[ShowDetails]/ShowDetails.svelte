<script>
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';
	import Button from '../../../Button/Button.svelte';
	import Tab from '../../../Tab/Tab.svelte';
	import AboutShow from '../EventDetails/AboutShow.svelte';
	import Disclaimer from '../EventDetails/Disclaimer.svelte';
	import FAQs from '../EventDetails/FAQs.svelte';
	import ShowCard from '../EventDetails/ShowCard.svelte';
	import image1 from './../../../../assets/images/EventsImages/event-image1.png';
	import BackArrow from './../../../../assets/svg/back-arrow.svg';
	import MinusIcon from './../../../../assets/svg/minus-outline.svg';
	import PlusIcon from './../../../../assets/svg/plus-outline.svg';
	import shareIcon from './../../../../assets/svg/share.svg';
	export let selectedEvent;
	export let goBack;
	export let goToCheckout;

	let quantity = 1;
	$: totalPrice = quantity * selectedEvent.detail.price;

	const availableTickets = selectedEvent.detail.availableTickets;
	const totalRemainingCapacity = availableTickets.reduce(
		(acc, ticket) => acc + ticket.remainingCapacity,
		0
	);
	const purchasedTickets = selectedEvent.detail.purchasedTickets;

	let tabsData = [
		{
			id: 'about',
			label: 'About the show'
		},
		{
			id: 'faqs',
			label: 'FAQs'
		},
		{
			id: 'disclaimers',
			label: 'Disclaimers'
		}
	];

	let showtimes = [];

	function increment() {
		quantity += 1;
	}
	function decrement() {
		if (quantity > 1) {
			quantity -= 1;
		}
	}
	export let orderId = '';
	async function initiateOrder() {
		let purchaserIP = '';
		let result = '';
		fetch('https://api.ipify.org?format=json')
			.then((response) => response.json())
			.then((data) => (purchaserIP = data.ip))
			.catch((error) => console.error('Error:', error));
		const createOrderResponse = await fetch('http://localhost:8080/api/public/createOrder', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ purchaserIP })
		});

		if (createOrderResponse.ok) {
			result = await createOrderResponse.json();
			orderId = result.uuid;
			Cookies.set('checkout-cartid', orderId);
		} else {
			result = 'failure';
		}
	}

	onMount(async () => {
		if (orderId == '') {
			await initiateOrder();
		}
		// Parse the query parameters from the current URL

		const urlParams = new URLSearchParams(window.location.search);
		let utmSource = urlParams.get('utm_source');

		// If there is no utm_source query parameter, set utmSource to "Direct"
		if (!utmSource) {
			utmSource = 'Direct';
		}

		// Send a GET request to the specified endpoint
		const response = await fetch(
			`http://localhost:8080/api/public/increment/${selectedEvent.detail.eventID}/${utmSource}`
		);

		if (!response.ok) {
			console.error('Failed to increment UTM source');
		}
	});
</script>

<div class="grid md:grid-cols-3 my-4 gap-2">
	<div class="md:col-span-2">
		<div class="relative">
			{#if selectedEvent.detail.coverImage}
				<img src={image1 || ''} alt="" class="w-full" />
				<button
					class="bg-[#252B37] rounded-full size-[34px] sm:size-[40px] flex items-center justify-center absolute top-3 left-3"
					on:click={goBack}
				>
					<img src={BackArrow} alt="" class="size-3.5 sm:size-5" />
				</button>
			{/if}
		</div>

		<div class="md:hidden">
			<ShowCard {selectedEvent} {showtimes} {shareIcon} />
		</div>

		<div class="my-5 px-4">
			<Tab items={tabsData} />
		</div>

		<div id="about" class="my-8 px-4">
			<AboutShow
				ShowImage={selectedEvent.detail.coverImage}
				description={selectedEvent.detail.description}
				performers={selectedEvent.detail.performers}
			/>
		</div>

		<div id="faqs" class="my-8 px-4">
			<FAQs faqs={selectedEvent.detail.faqs} />
		</div>

		<div id="disclaimers" class="my-8 px-4">
			<Disclaimer disclaimer={selectedEvent.detail.disclaimer} />
		</div>
	</div>

	<section class="sticky bottom-0 sm:top-2 h-fit">
		<div class="max-md:hidden">
			<ShowCard {selectedEvent} {showtimes} {shareIcon} />
		</div>

		<div
			class="h-fit sm:rounded-[8px] p-5 bg-[#FFFFFF] max-sm:border-none max-sm:shadow-inner border border-[#D4D6D9] mt-5"
		>
			{#if selectedEvent.detail.availableTickets.length >= 1}
				<div class="flex items-center justify-between pb-5 z-50">
					<h2 class="text-sm text-[#6B7280]">Starts from</h2>
					<div class="flex items-center gap-2">
						<h1 class="text-[#111928] font-semibold text-[16px]">
							${selectedEvent.detail.price}
						</h1>
						<span class="text-[10px] text-[#6B7280] z-[999]">incl. $4.48 fee</span>
					</div>
				</div>
				{#if availableTickets === 0}
					<Button size="full" danger strokebtn>Sales Ended</Button>
				{:else if purchasedTickets >= totalRemainingCapacity}
					<Button size="full" className="cursor-not-allowed" strokebtn>Sold Out</Button>
				{:else}
					<Button size="full" className="text-white" on:click={goToCheckout}>Get tickets</Button>
				{/if}
			{:else}
				<div class="flex items-center justify-between pb-5">
					{#if availableTickets === 1}
						<h2 class="text-sm font-medium text-Text-Primary">General Admission</h2>
						<div class="flex items-center">
							<div class="border-brand-Primary border-2 rounded-l-lg">
								<Button class="px-3 py-3" on:click={decrement}
									><img src={MinusIcon} alt="icon here" /></Button
								>
							</div>
							<span class="px-3">{quantity}</span>

							<div class="border-brand-Primary border-2 rounded-r-lg">
								<Button class="px-3 py-3" on:click={increment}
									><img src={PlusIcon} alt="icon here" /></Button
								>
							</div>
						</div>
					{/if}
				</div>
				{#if availableTickets === 0}
					<Button size="full" isDisabled danger strokebtn>Sales Ended</Button>
				{:else if purchasedTickets >= availableTickets}
					<Button size="full" danger isDisabled strokebtn>Sold Out!</Button>
				{:else}
					<Button size="full" className="text-white" on:click={goToCheckout}>
						Checkout for ${totalPrice}</Button
					>
				{/if}
			{/if}
		</div>
	</section>
</div>
