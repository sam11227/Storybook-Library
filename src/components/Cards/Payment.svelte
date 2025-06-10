<script>
	import { loadStripe } from '@stripe/stripe-js';
	import { Checkbox } from 'flowbite-svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	import { Elements, PaymentElement } from 'svelte-stripe';
	import Visa from '../../assets/icons/Internat.svg';
	import Mastercard from '../../assets/icons/International.svg';
	import Discover from '../../assets/icons/International1.png';
	import Atmcard from '../../assets/icons/International6.svg';
	export let paymentIntentId = '';
	export let paymentMethods = [];
	export let quantities = {};
	export let firstName = '';
	export let lastName = '';
	export let email = '';
	export let orderId = '';
	export let returnPaymentIntentID = '';
	export let selectedPaymentMethod = '';
	export let venueID = '';
	export let creditCardInfo = {
		cardholderName: '',
		cardNumber: '',
		expiryDate: '',
		cvv: '',
		zipCode: ''
	};
	export let eventID = '';
	export let errors = {};
	let elements;
	let mailingList = false;
	let stripe = null;
	let error = null;
	let processing = false;
	const dispatch = createEventDispatcher();
	async function submit() {
		// avoid processing duplicates
		if (processing) return;
		processing = true;
		dispatch('startTransaction', 'credit-card');
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
			returnPaymentIntentID = result.paymentIntent.id;

			// payment succeeded, redirect to "thank you" page

			const internalResponse = await fetch(
				'http://localhost:8080/api/public/validatePaymentIntent/' + orderId,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						paymentIntentId: returnPaymentIntentID,
						tickets: quantities,
						firstName: firstName,
						lastName: lastName,
						email: email,
						mailingList: mailingList,
						paymentMethod: selectedPaymentMethod,
						saleType: 'backend'
					})
				}
			);

			if (internalResponse.ok) {
				let internalResult = await internalResponse.json();
				error = 'success';
				processing = false;
				dispatch('transactionSucceeded', 'credit-card');
			} else {
				error = 'failure';
				processing = false;
				dispatch('transactionFailed', 'credit-card');
			}
			//goto('/examples/payment-element/thanks');
		}
		processing = false;
	}
	function handleSelection(value) {
		selectedPaymentMethod = value;
		dispatch('selectionChange', value);
	}

	function handleCreditCardInfoChange(updatedInfo) {
		creditCardInfo = updatedInfo;
		dispatch('creditCardChange', {
			detail: {
				type: 'creditCard',
				creditCard: creditCardInfo
			}
		});
	}

	onMount(async () => {
		stripe = await loadStripe(
			'pk_test_51RJLygPlXDynGkUGKI0vaVT0DXCDdf2wLp3BVNGtdulddY8jG5qBlDUuQuArbTW1dPh19wfZngGeABvH35XIjjMz00NwnD7ydB'
		);
	});
</script>

<div class="p-6 bg-white border rounded-lg shadow-md mx-auto w-full">
	<h2 class="text-xl font-normal text-gray-900 mb-4">Payment Method</h2>

	<form class="space-y-4">
		{#each paymentMethods as method}
			<label
				class="flex items-center py-6 px-2 border rounded-lg cursor-pointer hover:bg-primary-50 transition {selectedPaymentMethod ===
					method.id && method.label === 'Credit Card'
					? 'border !rounded-b-none bg-primary-50 border-primary-300'
					: ''}"
			>
				<input
					type="radio"
					name="payment"
					on:change={() => handleSelection(method.id)}
					value={method.id}
					class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
					checked={selectedPaymentMethod === method.id}
				/>
				<span class="ml-3 text-sm font-normal text-gray-500">{method.label}</span>

				{#if method.icons}
					<div class="ml-auto flex space-x-2">
						<img src={Mastercard} alt="Mastercard" class="h-5" />
						<img src={Visa} alt="Visa" class="h-5" />
						<img src={Discover} alt="Discover" class="h-4 w-9 pt-0.5" />
						<img src={Atmcard} alt="ATM card" class="h-5 w-8" />
					</div>
				{/if}
			</label>

			{#if selectedPaymentMethod === method.id && method.label === 'Credit Card'}
				<Elements {stripe} clientSecret={paymentIntentId} bind:elements>
					<form on:submit|preventDefault={submit}>
						<Checkbox bind:checked={mailingList} style="margin-bottom:8px;">
							Join our mailing list</Checkbox
						>
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
		{/each}
	</form>

	{#if errors?.method}
		<p class="text-red-500 text-sm mt-1">{errors.method}</p>
	{/if}
</div>
