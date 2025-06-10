<script>
	import { goto } from '$app/navigation';
	import { loadStripe } from '@stripe/stripe-js';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { z } from 'zod';

	import AlertIcon from '../../../assets/svg/Alert-icon.svg';
	import leftArrow from '../../../assets/svg/arrow-left.svg';
	import CheckMarked from '../../../assets/svg/checkmark.svg';
	import Breadcrumb from '../../Breadcrumb/Breadcrumb.svelte';
	import CreateNewOrderForm from '../../Cards/CreateNewOrderForm.svelte';
	import OrderSummary from '../../Cards/OrderSummary.svelte';
	import Payment from '../../Cards/Payment.svelte';
	import OrderPopup from '../../Orders/OrderPopup.svelte';
	import StepperNavigation from './StepperNavigation.svelte';
	export let eventID;
	export let venueID;
	let formState = {
		customer: {
			name: '',
			email: ''
		},
		tickets: {
			selectedTickets: {},
			quantities: {}
		},
		payment: {
			method: '',
			creditCard: {
				cardholderName: '',
				cardNumber: '',
				expiryDate: '',
				cvv: '',
				zipCode: ''
			}
		},
		promoCode: ''
	};
	let isCreatingOrder = false;
	let isCompleteOrder = false;
	let isInCompleteOrder = false;

	const CustomerSchema = z.object({
		customer: z.object({
			name: z.string().min(1, 'Name is required'),
			email: z.string().email('Invalid email address')
		})
	});

	const TicketSchema = z.object({
		tickets: z.object({
			selectedTickets: z.record(z.string(), z.number().min(0)),
			quantities: z.record(z.string(), z.number().min(1, 'Quantity must be at least 1'))
		})
	});

	const CreditCardSchema = z.object({
		cardholderName: z.string().min(1, 'Cardholder name is required'),
		cardNumber: z
			.string()
			.min(19, 'Invalid card number')
			.regex(/^(\d{4}\s){3}\d{4}$/, 'Invalid card number format'),
		expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Invalid expiry date format'),
		cvv: z
			.string()
			.length(3, 'CVV must be 3 digits')
			.regex(/^\d{3}$/, 'CVV must contain only numbers'),
		zipCode: z
			.string()
			.length(5, 'ZIP code must be 5 digits')
			.regex(/^\d{5}$/, 'ZIP code must contain only numbers')
	});

	const PaymentSchema = z.object({
		payment: z.object({
			method: z.string().min(1, 'Payment method is required'),
			creditCard: CreditCardSchema.optional()
		})
	});

	let errors = {
		customer: {},
		tickets: {},
		payment: {
			creditCard: {}
		}
	};
	let steps = ['Tickets', 'Payment'];
	let currentStep = 1;
	let loading = true;
	let events = [];

	const paymentMethods = [
		{ id: 'complimentary', label: 'Complimentary' },
		{ id: 'cash', label: 'Cash' },
		{ id: 'gift-card', label: 'Gift Card' },
		{ id: 'paid-online', label: 'Paid Online' },
		{ id: 'credit-card', label: 'Credit Card', icons: true }
	];

	$: orderId = '';
	$: tax_amount_exclusive = 0;
	$: userInfo = formState.customer.name && formState.customer.email ? true : false;
	$: orderSummary = calculateOrderSummary(formState.tickets, tax_amount_exclusive);
	function validateCustomerInfo() {
		try {
			CustomerSchema.parse(formState);
			errors.customer = {};
			return true;
		} catch (error) {
			errors.customer = error.formErrors.fieldErrors.customer || {};
			return false;
		}
	}

	function validatePayment() {
		try {
			PaymentSchema.parse(formState);
			if (formState.payment.method === 'credit-card') {
				CreditCardSchema.parse(formState.payment.creditCard);
			}

			errors.payment = {};
			return true;
		} catch (error) {
			if (formState.payment.method !== 'credit-card') {
				return true;
			}
			if (error.formErrors?.fieldErrors?.payment) {
			}
			if (formState.payment.method === 'credit-card' && error.formErrors?.fieldErrors) {
				errors.payment.creditCard = error.formErrors.fieldErrors;
			}

			return false;
		}
	}

	function handleSelectionChange(value) {
		formState.payment.method = value.detail;
		errors.payment = {};
	}

	function handleCreditCardChange(event) {
		const { type, creditCard } = event.detail.detail;
		if (type === 'creditCard') {
			formState.payment.creditCard = creditCard;
			errors.payment.creditCard = {};
		}
	}

	function handleTicketChange(event) {
		const { ticket, quantity } = event.detail;
		formState.tickets.selectedTickets[ticket.id] = ticket;
		formState.tickets.quantities[ticket.id] = quantity;
		errors.tickets = {};
	}
	$: paymentIntent = '';
	function startCheckout() {
		if (currentStep == 2) {
			createPaymentIntent();
		}
	}
	$: tax_amount = 0;
	$: tax_rate = 0;
	async function createPaymentIntent() {
		let localIP = '';
		await fetch('https://api.ipify.org?format=json')
			.then((response) => response.json())
			.then(async (data) => {
				const response = await fetch(
					'http://localhost:8080/api/public/create_payment_intent/' + orderId,
					{
						method: 'POST',
						headers: {
							'content-type': 'application/json'
						},
						body: JSON.stringify({ productQuantities: formState.tickets.quantities, IP: data.ip })
					}
				);
				if (response.ok) {
					let clientSecret = await response.json();
					paymentIntent = clientSecret.client_secret;
					tax_amount_exclusive = clientSecret.tax_amount_exclusive;
					tax_rate = clientSecret.tax_rate;
				} else {
				}
			})
			.catch((error) => console.error('Error:', error));
	}

	function calculateOrderSummary(ticketState, tax_amount_exclusive) {
		const subtotal = Object.entries(ticketState.quantities).reduce((total, [id, quantity]) => {
			const ticket = ticketState.selectedTickets[id];
			return total + (ticket?.price || 0) * quantity;
		}, 0);

		const tax = tax_amount_exclusive || 0;
		let serviceFee = 0;

		if (Object.keys(ticketState.quantities).length > 0) {
			if (serviceFeeChargeType === 'cents') {
				serviceFee = Object.entries(ticketState.quantities).reduce(
					(total, [id, quantity]) => total + quantity * serviceFeeCents,
					0
				); // Calculate total service fee in dollars
			} else if (serviceFeeChargeType === 'percentage') {
				serviceFee = subtotal * (serviceFeePercentage * 0.01); // Calculate percentage-based service fee
			}
		} else {
			serviceFee = 0; // No service fee if there are no ticket quantities
		}
		const taxInDollars = tax / 100;
		const total =
			subtotal + taxInDollars + (serviceFeeChargeType === 'cents' ? serviceFee / 100 : serviceFee);
		let dataToReturn = {
			tickets: Object.entries(ticketState.quantities).map(([id, quantity]) => {
				const ticket = ticketState.selectedTickets[id];
				return {
					type: ticket?.name || '',
					quantity,
					price: ticket?.price || 0
				};
			}),
			subtotal,
			tax: taxInDollars,
			serviceFee,
			total
		};

		return dataToReturn;
	}
	function transformTickets(purchasedTickets) {
		const ticketMap = {
			'General Admission': '2',
			VIP: '3',
			Mezzanine: '4'
		};

		return purchasedTickets.reduce((acc, ticket) => {
			const ticketId = ticketMap[ticket.type];
			if (ticketId) {
				acc[ticketId] = ticket.quantity;
			}
			return acc;
		}, {});
	}
	let purchaserIP = '';

	async function handlePlaceOrder() {
		isCreatingOrder = true;
		if (!validatePayment()) return;

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
		const payload = {
			firstName: formState.customer.name.split(' ')[0],
			lastName: formState.customer.name.split(' ').slice(1).join(' '),
			email: formState.customer.email,
			price: orderSummary.total,
			// purchasedTickets: orderSummary.tickets,
			purchasedTickets: null,
			paymentMethod: formState.payment.method,
			billingZIP: formState.payment.creditCard?.zipCode || '',
			phone: '',
			notes: '',
			paymentIntentId: '',
			paymentStatus: 'pending',
			purchaserIP: purchaserIP,
			refundRequested: false,
			refundMessage: '',
			refundAmount: 0,
			source: 'web'
		};

		try {
			const orderData = await fetch('http://localhost:8080/api/public/createOrder', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const paymentMethodId = await orderData.json();
			if (paymentMethodId.uuid) {
				const paymentPayload = {
					id: paymentMethodId.uuid,
					paymentIntentId: 'pi_3PfY8CJ3w04AV8CH1tBhHVzu',
					tickets: formState.tickets.quantities,
					firstName: payload.firstName,
					lastName: payload.lastName,
					email: payload.email,
					paymentMethod: formState.payment.method,
					saleType: 'backend',
					mailingList: true
				};
				const paymentData = await fetch(
					'http://localhost:8080/api/public/validatePaymentIntent/' + paymentMethodId.uuid,
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
				} else if (paymentDataResponse.status === 'Payment amount does not match the total price') {
					isInCompleteOrder = true;
				}

				isCreatingOrder = false;
			}
			if (!orderData.ok) {
				const errorData = await orderData.json().catch(() => ({}));
				throw new Error(errorData.message || 'Failed to create order');
			}
		} catch (error) {
			isCreatingOrder = false;
			console.error('Error creating order:', error);
		}
	}

	function handleTransactionSucceeded() {
		isCompleteOrder = true;
		isInCompleteOrder = false;
	}

	function handleTransactionFailed() {
		isInCompleteOrder = true;
		isCompleteOrder = false;
	}
	$: serviceFeePercentage = 0;
	$: serviceFeeCents = 0;

	$: serviceFeeChargeType = '';
	async function getVenueData() {
		const response = await fetch('http://localhost:8080/api/public/getVenue/' + venueID, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		let result = null;
		if (response.ok) {
			result = await response.json();
			serviceFeePercentage = result.serviceFeePercentage;
			serviceFeeCents = result.serviceFeeCents;
			serviceFeeChargeType = result.serviceFeeChargeType;
			// format result.startDateTime to look like Fri, Nov 19, 2023, 8:00 PM
		} else {
			result = 'failure';
		}
	}
	let stripe = null;
	let error = null;
	$: eventName = '';
	onMount(async () => {
		await getVenueData();

		await getTransferAll();
		stripe = await loadStripe(
			'pk_test_51RJLygPlXDynGkUGKI0vaVT0DXCDdf2wLp3BVNGtdulddY8jG5qBlDUuQuArbTW1dPh19wfZngGeABvH35XIjjMz00NwnD7ydB'
		);
		// Parse the query parameters from the current URL
		const urlParams = new URLSearchParams(window.location.search);
		let utmSource = urlParams.get('utm_source');

		// Send a GET request to the specified endpoint
		const response = await fetch(`http://localhost:8080/api/public/increment/${eventID}/Backend`);

		if (!response.ok) {
			console.error('Failed to increment UTM source');
		}
	});
	let quantities = {};
	$: ticketParsed = [];

	async function getTransferAll() {
		try {
			const response = await fetch('http://localhost:8080/api/public/getEvent/' + eventID, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			});

			if (response.ok) {
				events = await response.json();
				let ticketTemp = [];
				eventName = events.title;
				eventID = events.ID;

				events.availableTickets.forEach((ticket) => {
					quantities[ticket.ID] = 0;
					ticketTemp.push({
						id: ticket.ID,
						ID: ticket.ID,
						name: ticket.name,
						quantity: 0,
						availability: ticket.remainingCapacity,
						totalTickets: ticket.quantity,
						price: ticket.price,
						color: 'green'
					});
				});
				const stripeConnectionResponse = await fetch(
					'http://localhost:8080/api/protected/stripe-connections/' + events.venueId,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer a'
						},
						credentials: 'include'
					}
				);
				if (stripeConnectionResponse.ok) {
					const stripeConnectionData = await stripeConnectionResponse.json();
					if (stripeConnectionData.stripeConnected) {
						stripe = await loadStripe(stripeConnectionData.token);
					} else {
						error = 'Stripe connection not found for this venue.';
					}
				} else {
					error = 'Failed to fetch Stripe connection data.';
				}

				ticketParsed = ticketTemp;
			} else {
				events = [];
			}
		} catch (error) {
			console.error('Failed to load events:', error);
		} finally {
			loading = false;
		}
		let purchaserIP = '';
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
			let createOrderResult = await createOrderResponse.json();
			orderId = createOrderResult.uuid;
		} else {
		}
	}
	let processing = false;
	let returnPaymentIntentID = '';

	const breadcrumbData = [
		{ name: 'Home', href: '/' },
		{
			name: eventName,
			href: '/operator/venues/' + venueID + '/' + eventID
		},
		{ name: 'Orders', href: '/operator/venues/' + venueID + '/' + eventID + '/orders' },
		{ name: 'New order', href: '' }
	];
</script>

<div class="w-full mx-auto px-4">
	<nav class="py-4">
		<Breadcrumb data={breadcrumbData} />
	</nav>

	<div class="flex justify-between flex-wrap items-center">
		<h4 class="font-bold text-3xl text-gray-900 py-4 flex-grow sm:flex-grow-0">Create new order</h4>

		<div class="w-full sm:w-auto flex justify-end">
			<StepperNavigation {steps} {currentStep} />
		</div>
	</div>

	<div class="flex items-center cursor-pointer pb-8 pt-2 sm:hidden">
		<img class="h-5 w-5 text-primary-500" src={leftArrow} alt="note-edit" />
		<p class="ml-2 text-primary-500 text-sm font-medium">Go Back</p>
	</div>

	<div class="grid grid-cols-12 gap-5">
		<div class="col-span-12 md:col-span-8">
			{#if currentStep === 1}
				<CreateNewOrderForm
					bind:customerName={formState.customer.name}
					bind:customerEmail={formState.customer.email}
					tickets={ticketParsed}
					on:quantityChange={handleTicketChange}
					errors={errors.customer}
				/>
			{/if}

			{#if currentStep === 2}
				<Payment
					{eventID}
					{venueID}
					paymentIntentId={paymentIntent}
					{paymentMethods}
					bind:selectedPaymentMethod={formState.payment.method}
					bind:creditCardInfo={formState.payment.creditCard}
					on:selectionChange={handleSelectionChange}
					on:creditCardChange={handleCreditCardChange}
					on:transactionSucceeded={handleTransactionSucceeded}
					on:transactionFailed={handleTransactionFailed}
					errors={errors.payment}
					firstName={formState.customer.name.split(' ')[0]}
					lastName={formState.customer.name.split(' ').slice(1).join(' ')}
					email={formState.customer.email}
					quantities={formState.tickets.quantities}
					{orderId}
				/>
			{/if}

			<div class="mt-6 justify-between space-x-6 align-middle items-end hidden sm:flex">
				<div class="col-span-10 w-full">
					<Label for="promo-code" class="block mb-2 text-sm font-medium text-gray-900">
						Promo code
					</Label>
					<Input id="promo-code" bind:value={formState.promoCode} placeholder="" />
				</div>
				<div>
					<Button color="blue">Apply</Button>
				</div>
			</div>

			<button
				class="items-center cursor-pointer mt-3 md:mt-10 md:pb-2 hidden sm:flex"
				on:click={() => {
					if (currentStep === 2) {
						currentStep = 1;
					} else if (currentStep === 1) {
						goto('/operator/venues/' + venueID + '/' + eventID + '/orders');
					}
				}}
				type="button"
			>
				<img class="h-5 w-5 text-primary-500" src={leftArrow} alt="note-edit" />
				<p class="ml-2 text-primary-500 text-sm font-medium">Go Back</p>
			</button>
		</div>

		<div class="col-span-12 md:col-span-4">
			<OrderSummary
				ordersSummary={orderSummary}
				paymentMethod={formState.payment.method}
				{serviceFeeCents}
				{serviceFeePercentage}
				{serviceFeeChargeType}
				taxRate={tax_rate}
				onClickButton={() => {
					if (currentStep === 1) {
						if (validateCustomerInfo()) {
							currentStep = 2;
							startCheckout();
						}
					} else if (currentStep === 2) {
						handlePlaceOrder();
					}
				}}
				buttonClass={(userInfo && currentStep == 1) || formState.payment.method
					? 'bg-primary-500'
					: 'bg-gray-400'}
				buttonText={isCreatingOrder
					? 'Loading ...'
					: currentStep === 2
					? 'Place order'
					: 'Next: Payment' || 'Next: Payment'}
			/>
		</div>
	</div>

	<OrderPopup
		isOpen={isCompleteOrder}
		title="Order successful"
		confirmText="Back to Orders"
		onCancel={() => {
			isCompleteOrder = false;
			goto('/operator/venues/' + venueID + '/' + eventID + '/orders');
		}}
		onConfirm={() => {
			isCompleteOrder = false;
			goto('/operator/venues/' + venueID + '/' + eventID + '/orders');
		}}
		icon={CheckMarked}
	/>

	<OrderPopup
		isOpen={isInCompleteOrder}
		title="Order failed"
		message="This order did not complete successfully.
Please try again."
		confirmText="Ok"
		onCancel={() => {
			isInCompleteOrder = false;
			currentStep = 1;
			goto('/operator/venues/' + venueID + '/' + eventID + '/orders');
		}}
		onConfirm={() => {
			isInCompleteOrder = false;
			currentStep = 1;
			goto('/operator/venues/' + venueID + '/' + eventID + '/orders');
		}}
		icon={AlertIcon}
	/>
</div>
