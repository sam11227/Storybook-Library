<script>
	import { loadStripe } from '@stripe/stripe-js';
	import { CloseButton, Drawer } from 'flowbite-svelte';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';
	import { Elements, PaymentElement } from 'svelte-stripe';
	import Input from '../../../Input/Input.svelte';
	import GooglePayIcon from './../../../../assets/icons/G-pay.png';
	import paypalIcon from './../../../../assets/icons/PayPal.png';
	import UPIcon from './../../../../assets/icons/chevron-down.svg';
	import crediCardIcon from './../../../../assets/images/Stripe-Logo.png';
	import Cancel from './../../../../assets/svg/cancel-upload.svg';
	import OrderSummary from './../SelectTicket/OrderSummary.svelte';

	export let goToCheckout;
	export let value = '';
	export let availableTickets = [];
	let InputValue = false;
	let selectedPayment = 'card';
	let selectedTickets = '';
	let cardNumber = '';
	let expiryDate = '';
	let cvv = '';
	let firstName = '';
	let lastName = '';
	let email = '';
	let confirmEmail = '';
	let keepMeUpdated = false;
	let ticketFirstName = '';
	let ticketLastName = '';
	let ticketEmail = '';
	let scrollContainer;
	let showScrollbar = false;
	let heading = '   Checkout';
	let timerDuration = 15 * 60;
	let Timing = `Time left ${formatTime(timerDuration)}`;
	let inputValue = value;
	const terms = [
		'All ticket sales are final and non-refundable unless the event is canceled or rescheduled by the organizer.',
		'Tickets are valid only for the event, date, time, and venue specified. Unauthorized resale of tickets is prohibited.',
		'The event organizer reserves the right to refuse entry or remove any individual from the venue without refund.',
		'Attendees must comply with all venue rules and regulations, including any age restrictions or dress codes.',
		'Photography and recording policies may vary; please check the event details for specific guidelines.'
	];

	const handleInput = (event) => {
		inputValue = event.target.value;
	};
	let tickets = [
		{
			name: 'Ticket 1',
			sameAsPersonal: false,
			firstName: '',
			lastName: '',
			email: ''
		},
		{
			name: 'Ticket 2',
			sameAsPersonal: false,
			firstName: '',
			lastName: '',
			email: ''
		},
		{
			name: 'Ticket 3',
			sameAsPersonal: false,
			firstName: '',
			lastName: '',
			email: ''
		}
	];
	let elements;
	function updateTicketDetails(index, sameAsPersonal) {
		tickets[index].sameAsPersonal = sameAsPersonal;

		if (sameAsPersonal) {
			tickets[index].firstName = firstName;
			tickets[index].lastName = lastName;
			tickets[index].email = email;
		} else {
			tickets[index].firstName = '';
			tickets[index].lastName = '';
			tickets[index].email = '';
		}

		tickets = [...tickets];
	}
	let hidden8 = true;
	let transitionParamsBottom = {
		y: 320,
		duration: 200
	};
	$: inputValue = value;
	$: processing = false;
	// Function to get the value of a cookie by name
	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
	}

	// Initialize quantities from the cookie or default values
	let quantities = JSON.parse(Cookies.get('checkout-quantities')) || {
		mezzanine: 0,
		general: 3,
		vip: 0
	};
	let cartId = Cookies.get('checkout-cartid');

	// Reactive statements to recalculate values
	$: subtotal = quantities.mezzanine * 34.48 + quantities.general * 24.48 + quantities.vip * 44.48;
	$: fees = (quantities.mezzanine + quantities.general + quantities.vip) * 4.48;
	$: taxes = subtotal * 0.08;
	$: total = subtotal + fees + taxes;

	$: emailMatchError = email !== confirmEmail && confirmEmail !== '';

	$: isAgreed = InputValue;
	const cardNumberPattern = /^\d{16}$/;

	$: cardNumberError =
		!cardNumber.replace(/\s+/g, '').match(cardNumberPattern) && cardNumber !== '';

	const cvvPattern = /^\d{3}$/;
	$: cvvError = !cvvPattern.test(cvv) && cvv !== '';

	function handelClicked() {
		window.location.href = '/showsandtickets';
	}

	function checkScrollable() {
		if (scrollContainer) {
			isScrollable = scrollContainer.scrollHeight > scrollContainer.clientHeight;
			showScrollbar = isScrollable;
		}
	}
	function handleScroll() {
		if (scrollContainer) {
			const atBottom =
				scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight;
			showScrollbar = isScrollable && !atBottom;
		}
	}

	let showProcessingOrder = false;
	function handlePlaceOrder() {
		if (isAgreed) {
			showProcessingOrder = true;
		}
	}
	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
	}
	$: paymentIntent = '';
	let purchaserIP = '';
	async function createPaymentIntent() {
		// strip the 0 value out of quantities
		quantities = Object.fromEntries(Object.entries(quantities).filter(([key, value]) => value > 0));
		const response = await fetch(
			'http://localhost:8080/api/public/create_payment_intent/' + cartId,
			{
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({ productQuantities: quantities, IP: purchaserIP })
			}
		);
		if (response.ok) {
			let clientSecret = await response.json();
			paymentIntent = clientSecret.client_secret;
			stripe = await loadStripe(
				'pk_test_51RJLygPlXDynGkUGKI0vaVT0DXCDdf2wLp3BVNGtdulddY8jG5qBlDUuQuArbTW1dPh19wfZngGeABvH35XIjjMz00NwnD7ydB'
			);
			return clientSecret;
		} else {
		}
	}
	$: isCompleteOrder = false;
	$: isInCompleteOrder = false;
	$: isCreatingOrder = false;
	async function executePurchase() {
		if (processing) return;
		processing = true;

		// confirm payment with stripe
		const result = await stripe.confirmPayment({
			elements,
			redirect: 'if_required'
		});

		// log results, for debugging

		if (result.error) {
			// payment failed, notify user
			error = result.error;
			processing = false;
		} else {
			const paymentPayload = {
				id: cartId,
				paymentIntentId: result.paymentIntent.id,
				tickets: quantities,
				firstName: firstName,
				lastName: lastName,
				email: confirmEmail,
				paymentMethod: 'credit-card',
				mailingList: keepMeUpdated,
				saleType: 'backend'
			};

			const paymentData = await fetch(
				'http://localhost:8080/api/public/validatePaymentIntent/' + cartId,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(paymentPayload)
				}
			);
			const paymentDataResponse = await paymentData.json();
			if (paymentDataResponse.status === 'Payment succeeded') {
				isCompleteOrder = true;
				goToCheckout();
			} else if (paymentDataResponse.status === 'Payment amount does not match the total price') {
				isInCompleteOrder = true;
				processing = false;
			}

			isCreatingOrder = false;
		}
	}
	let stripe = null;
	let error = null;
	onMount(async () => {
		createPaymentIntent();
		fetch('https://api.ipify.org?format=json')
			.then((response) => response.json())
			.then((data) => (purchaserIP = data.ip))
			.catch((error) => console.error('Error:', error));
		const interval = setInterval(() => {
			if (timerDuration > 0) {
				timerDuration -= 1;
				Timing = `Time left ${formatTime(timerDuration)}`;
			} else {
				clearInterval(interval);
				window.location.href = '/showsandtickets';
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="relative md:flex">
	<div class="flex justify-between w-full md:gap-4 sm:p-4 p-0 mb-10 lg:mb-0 md:p-8 gap-[64px]">
		<div class=" w-full md:border-[1px] border-[#D4D6D9] rounded-lg">
			<div class="flex justify-between p-5">
				<div class="gap-1">
					<h2 class="text-[18px] font-semibold leading-[27px] text-[#111928]">
						{heading}
					</h2>
					<p class="pt-1 text-[12px] font-[400] leading-[18px] text-[#E02424]">
						{Timing}
					</p>
				</div>
				<div>
					<img class="text-black" src={Cancel} alt="Close Icon" on:click={handelClicked} />
				</div>
			</div>
			<hr class="w-full border-1 border-[#D4D6D9]" />
			<form class="">
				<div class="p-5">
					<div class="space-y-4">
						<h2 class="text-[16px] font-[500] leading-6 text-[#111928]">Personal details</h2>
						<div class="grid grid-cols-2 pb-3 gap-4">
							<Input label="First name" size="full" type="text" bind:value={firstName} />
							<Input label="Last name" size="full" type="text" bind:value={lastName} />
							<div class="grid col-span-2 gap-4">
								<Input label="Email address" size="full" type="email" bind:value={email} />
								<Input label="Confirm email" size="full" type="email" bind:value={confirmEmail} />
								{#if email !== confirmEmail && confirmEmail !== ''}
									<p class="text-[12px] font-[400] leading-[18px] text-[#E02424]">
										Email doesn't match.
									</p>
								{/if}
							</div>
						</div>
						<label class="flex items-center space-x-2">
							<input
								bind:checked={keepMeUpdated}
								type="checkbox"
								class="rounded-[4px] size-4 border-[0.5px] solid border-[#D1D5DB]"
							/>
							<span class="text-[12px] font-[400] leading-[18px] text-[#6B7280]">
								Keep me updated on more shows and news from this organizer
							</span>
						</label>
					</div>
				</div>

				{#each tickets as ticket, index}
					<div class="p-5">
						<div class="grid grid-row-3 gap-3">
							<h2 class="text-[16px] font-[500] leading-6">{ticket.name}</h2>
							<label class="flex items-center gap-4">
								<input
									type="checkbox"
									class="rounded-[4px] size-4 border-[0.5px] solid border-[#D1D5DB]"
									bind:checked={ticket.sameAsPersonal}
									on:change={() => updateTicketDetails(index, ticket.sameAsPersonal)}
								/>
								<span class="text-[12px] font-[400] leading-[18px] text-[#6B7280]">
									Same as personal details
								</span>
							</label>
							<div class="grid grid-cols-2 gap-4">
								<div class="relative">
									<input
										type="text"
										bind:value={ticket.firstName}
										id="float"
										class="block w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
										placeholder=" "
									/>
									<label
										for="float"
										class="absolute text-sm text-gray-500 pb-1 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
										>First Name</label
									>
								</div>

								<div class="relative">
									<input
										type="text"
										bind:value={ticket.lastName}
										id="float"
										class="block w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
										placeholder=" "
									/>
									<label
										for="float"
										class="absolute text-sm text-gray-500 pb-1 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
										>Last Name</label
									>
								</div>
								<div class="grid col-span-2">
									<div class="relative">
										<input
											type="text"
											bind:value={ticket.email}
											id="float"
											class="block w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
											placeholder=" "
										/>
										<label
											for="float"
											class="absolute text-sm text-gray-500 pb-[2px] duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
											>Email</label
										>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</form>

			<div class="p-5">
				<h2 class="text-[12px] font-[400] leading-[18px] text-[#6B7280] pb-2">
					Terms and conditions
				</h2>
				<div class=" border-2 border-[#D4D6D9] rounded-lg overflow-hidden">
					<div
						bind:this={scrollContainer}
						on:scroll={handleScroll}
						use:checkScrollable
						class=" p-3 h-[80px] overflow-y-auto relative scroll-container"
					>
						<ol
							class=" text-[12px] font-[400] leading-[18px] text-[#6B7280] list-decimal gap-2 flex flex-col p-3"
						>
							{#each terms as term}
								<li>{term}</li>
							{/each}
						</ol>
					</div>

					{#if showScrollbar}
						<div class="absolute right-1 top-1 bottom-1 w-2">
							<div class="bg-gray-400 rounded-full w-full h-full opacity-50" />
						</div>
					{/if}
				</div>
				<div>
					<label class="flex items-center py-3 space-x-2">
						<input
							bind:checked={InputValue}
							type="checkbox"
							class="rounded-[4px] size-4 border-[0.5px] solid border-[#D1D5DB]"
						/>
						<span class="text-[12px] font-[400] leading-[18px] text-[#6B7280]"
							>I agree to the above terms and conditions.</span
						>
					</label>
				</div>
			</div>
			<div class="p-5">
				<h2 class="text-[16px] font-[500] py-3">Pay with</h2>

				<div class=" mx-auto border-[#D4D6D9] border-2 rounded-lg">
					<div class="flex flex-row pb-4 justify-between p-6">
						<div class="">
							<label class="flex items-center space-x-2 cursor-pointer">
								<input
									type="radio"
									bind:group={selectedPayment}
									value="card"
									class="form-radio"
									id="card-option"
								/>
								<span>Stripe</span>
							</label>
						</div>
						<div>
							<img src={crediCardIcon} alt="crediCardIcon" width="32px" />
						</div>
					</div>

					{#if stripe !== null}
						<Elements {stripe} clientSecret={paymentIntent} bind:elements>
							<form on:submit|preventDefault={executePurchase}>
								<PaymentElement />

								<button
									disabled={processing}
									class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 {processing
										? 'opacity-50 cursor-not-allowed'
										: ''}"
								>
									{#if processing}
										Processing...
									{:else}
										Pay
									{/if}
								</button>
							</form>
						</Elements>
					{/if}
					<div class="flex mt-5 border-t-2 border-[#D4D6D9] flex-col bor-2gap-8">
						<div class="flex flex-row p-6 justify-between">
							<div>
								<label class="flex items-center space-x-2 cursor-pointer">
									<input
										type="radio"
										bind:group={selectedPayment}
										value="paypal"
										class="form-radio"
										id="paypal-option"
									/>
									<span>PayPal</span>
								</label>
							</div>
							<div>
								<img sizes="4" src={paypalIcon} alt="paypalIcon" />
							</div>
						</div>
						<hr class="border-1 border-[#D1D5DB]" />

						<div class="flex flex-row justify-between p-6">
							<div>
								<label class="flex items-center space-x-2 cursor-pointer">
									<input
										type="radio"
										bind:group={selectedPayment}
										value="googlepay"
										class="form-radio"
										id="googlepay-option"
									/>
									<span>Google Pay</span>
								</label>
							</div>
							<div>
								<img src={GooglePayIcon} alt="paypalImg" sizes="4" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="lg:block hidden">
			<OrderSummary
				btnText="Place Order"
				eventTickets={availableTickets}
				checkoutTicket={goToCheckout}
				{quantities}
				{isAgreed}
			/>
		</div>
	</div>
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
			on:click={() => executePurchase()}
		>
			Place order
		</button>
	</div>
</div>
<Drawer
	placement="bottom"
	width="w-full"
	height="h-screen"
	transitionType="fly"
	transitionParams={transitionParamsBottom}
	bind:hidden={hidden8}
	id="sidebar8"
	class="block lg:hidden "
>
	<div class="w-full h-screen flex flex-col bg-[#FFF]">
		<div class="h-fit rounded-[8px] px-5 py-4 bg-[#FFF] md:border md:border-[#D4D6D9]">
			<div class="flex justify-between py-5 items-center">
				<h2 class="text-xl font-semibold">Order Summary</h2>
				<CloseButton on:click={() => (hidden8 = true)} class="text-gray-400" />
			</div>
			<hr />
			<div class="flex-1 overflow-y-auto px-4 text-[#666C79]" />
			{#if quantities.mezzanine > 0}
				<div class="flex justify-between py-2">
					<span>Mezzanine × {quantities.mezzanine}</span>
					<span>${(quantities.mezzanine * 34.48).toFixed(2)}</span>
				</div>
			{/if}
			{#if quantities.vip > 0}
				<div class="flex justify-between py-2">
					<span>VIP × {quantities.vip}</span>
					<span>${(quantities.vip * 44.48).toFixed(2)}</span>
				</div>
			{/if}
			{#if quantities.general > 0}
				<div class="flex justify-between py-2">
					<span>General Admission × {quantities.general}</span>
					<span>${(quantities.general * 20).toFixed(2)}</span>
				</div>
			{/if}
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
