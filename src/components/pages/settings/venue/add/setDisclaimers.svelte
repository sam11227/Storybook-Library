<svelte:options accessors={true} />

<script>
	import { Checkbox, Label, Textarea } from 'flowbite-svelte';
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { z } from 'zod';
	import CustomMesageImage from '../../../../../assets/images/custom_message_popup.png';
	import DisclaimerImage from '../../../../../assets/images/disclamier-popup.png';
	import FAQImage from '../../../../../assets/images/faq-popup.png';
	import ErrorMessage from '../../../../../components/Input/ErrorMessage.svelte';
	import Input from '../../../../../components/Input/Input.svelte';
	import CustomModal from '../../../../../components/Modal/CustomModal.svelte';

	const dispatch = createEventDispatcher();
	export let askForPhoneAtCheckout = false;
	export let requiredPhoneAtCheckout = false;
	export let hasCustomEmail = false;
	export let hasCustomCheckout = false;
	export let showEnableCalendarModal = false;

	export let formData = {
		question_prompt: '',
		selected_question_type: '',
		questions: ['', ''],
		disclaimer: '',
		faq: '',
		request_notification: '',
		booking_notification: '',
		email_message: '',
		avails_email_request: '',
		inlcude_booking_emails: '',
		venue_faqs: ''
	};

	// Emit an event every quarter second with all the data
	const interval = setInterval(() => {
		dispatch('updateDisclaimersData', {
			askForPhoneAtCheckout,
			requiredPhoneAtCheckout,
			hasCustomEmail,
			hasCustomCheckout,
			showEnableCalendarModal,
			formData
		});
	}, 250);

	// Clear the interval when the component is destroyed
	onDestroy(() => {
		clearInterval(interval);
	});
	let disclaimerPopup = false;
	let faqPopup = false;
	let customMessagePopup = false;

	let textareaprops = {
		id: 'description',
		name: 'description',
		label: 'Your description',
		rows: 4,
		placeholder: 'Write text here...'
	};

	// Zod schema for form validation
	const schema = z.object({});

	let formErrors = {};

	let questions_type = [
		{ value: 'mc', name: 'Multiple choice' },
		{ value: 'yn', name: 'Yes/No' },
		{ value: 'txt', name: 'Text' }
	];

	function addQuestion() {
		formData.questions = [...formData.questions, ''];
	}

	function updateQuestion(index, value) {
		formData.questions[index] = value;
	}

	function deleteOption(index) {
		formData.questions = formData.questions.filter((_, i) => i !== index);
	}

	function validateForm() {
		formErrors = {}; // Reset errors
		try {
			schema.parse(formData); // Zod validation
		} catch (error) {
			formErrors = error.formErrors.fieldErrors;
		}

		// Return whether the form is valid or not
		return Object.keys(formErrors).length === 0;
	}

	function handleSubmit(event) {
		event.preventDefault();
		if (validateForm()) {
			dispatch('submit', formData);
		} else {
		}
	}

	const handleAction = (value) => {};
</script>

<div class="p-4">
	<form class="my-5" on:submit={handleSubmit}>
		<div class="w-full mx-auto my-5 rounded-lg">
			<div class="mb-6">
				<Label for="description" class="flex mb-2">
					<span class="my-auto">Disclaimer</span>
					<button
						class="ml-2 my-auto p-1"
						on:click|preventDefault={() => (disclaimerPopup = !disclaimerPopup)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
							/>
						</svg>
					</button>
				</Label>
				<Textarea {...textareaprops} bind:value={formData.disclaimer} />
				<ErrorMessage message={formErrors.disclaimer} />
			</div>

			<div class="mb-6">
				<Label for="description" class="flex mb-2">
					<span class="my-auto">Venue FAQs</span>
					<button class="ml-2 my-auto p-1" on:click|preventDefault={() => (faqPopup = !faqPopup)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
							/>
						</svg>
					</button>
				</Label>
				<Textarea {...textareaprops} bind:value={formData.venue_faqs} />
				<ErrorMessage message={formErrors.venue_faqs} />
			</div>
			<div class="mb-6">
				<Label for="description" class="block mb-2">
					<Checkbox bind:checked={hasCustomCheckout}>
						Custom email signup message on checkout page
					</Checkbox>
				</Label>
				{#if hasCustomCheckout}
					<Input
						size="full"
						placeholder="Join the mailing list for updates"
						bind:value={formData.email_message}
						controlled
					/>
					<ErrorMessage message={formErrors.email_message} />
				{/if}
			</div>
			<div class="mb-6">
				<Label for="description" class="flex mb-2">
					<Checkbox class="my-auto" bind:checked={hasCustomEmail}
						>Custom message in booking emails</Checkbox
					>
					<button
						class="ml-2 my-auto p-1"
						on:click|preventDefault={() => (customMessagePopup = !customMessagePopup)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
							/>
						</svg>
					</button>
				</Label>
				{#if hasCustomEmail}
					<Textarea {...textareaprops} bind:value={formData.inlcude_booking_emails} />
					<ErrorMessage message={formErrors.inlcude_booking_emails} />
				{/if}
			</div>
			<div class="mb-6">
				<Checkbox class="font-normal" bind:checked={askForPhoneAtCheckout}
					>Ask for customer phone number during checkout</Checkbox
				>
			</div>

			{#if askForPhoneAtCheckout}
				<div class="mb-6">
					<Checkbox class="font-normal" bind:checked={requiredPhoneAtCheckout}
						>Make phone number required</Checkbox
					>
				</div>
			{/if}
		</div>
	</form>

	<CustomModal
		show={disclaimerPopup}
		closeBtn
		on:cancel={() => handleAction('cancel')}
		on:confirm={() => handleAction('confirm')}
	>
		<div class="my-2">
			<img src={DisclaimerImage} alt="disclaimer-popup" />
		</div>
	</CustomModal>
	<CustomModal
		show={faqPopup}
		closeBtn
		on:cancel={() => handleAction('cancel')}
		on:confirm={() => handleAction('confirm')}
	>
		<div class="my-2">
			<img src={FAQImage} alt="faq-popup" />
		</div>
	</CustomModal>
	<CustomModal
		show={customMessagePopup}
		closeBtn
		on:cancel={() => handleAction('cancel')}
		on:confirm={() => handleAction('confirm')}
	>
		<div class="my-2">
			<img src={CustomMesageImage} alt="custom-message-popup" />
		</div>
	</CustomModal>
</div>
