<script>
	import { redirect } from '@sveltejs/kit';
	import { Alert, Input, Label, Textarea } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { z } from 'zod';
	import Button from '../../../../components/Button/Button.svelte';
	import CustomDropzone from '../../../../components/CustomDropzone.svelte';
	import ErrorMessage from '../../../../components/Input/ErrorMessage.svelte';

	// Form state and validation
	let form = {
		organization_name: '',
		email_address: '',
		phone: '',
		location: '',
		description: ''
	};

	// Validation schema using Zod
	const schema = z.object({
		organization_name: z.string().trim().min(1, 'Organization name is required.'),
		email_address: z.string().trim().email('Please enter a valid email address.')
	});

	// Error handling
	const errors = writable({});

	// Handle form submit
	function handleSubmit(event) {
		event.preventDefault();
		errors.set({});

		// Validate form data
		const result = schema.safeParse(form);

		if (result.success) {
			setData();
		} else {
			const fieldErrors = result.error.format();
			errors.set(fieldErrors);
		}
	}

	let textareaprops = {
		id: 'description',
		name: 'description',
		label: 'Your description',
		rows: 4,
		placeholder: 'Write text here...'
	};
	$: result = [];
	$: saveNotification = null;
	$: organizationName = '';
	$: organizationEmail = '';
	$: organizationPhone = '';
	$: organizationAddress = '';
	$: organizationDescription = '';
	async function getData() {
		const response = await fetch('http://localhost:8080/api/protected/organizationDetails', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			},
			credentials: 'include'
		});

		if (response.ok) {
			result = await response.json();
			form.organization_name = result.organizationName;
			form.email_address = result.organizationEmail;
			form.phone = result.organizationPhone;
			form.location = result.organizationAddress;
			form.description = result.organizationDescription;
		} else {
			result = 'failure';
			redirect(302, '/auth/login');
		}
	}
	function formatPhone(event) {
		let input = event.target.value.replace(/\D/g, '');
		if (input.length > 10) {
			input = input.substring(0, 10);
		}
		if (input.length > 3 && input.length <= 6) {
			input = input.replace(/(\d{3})(\d+)/, '$1-$2');
		} else if (input.length > 6) {
			input = input.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
		}
		form.phone = input;
	}
	async function setData() {
		const response = await fetch('http://localhost:8080/api/protected/organizationDetails', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			},
			credentials: 'include',
			body: JSON.stringify({
				organizationName: form.organization_name,
				organizationEmail: form.email_address,
				organizationPhone: form.phone,
				organizationAddress: form.location,
				organizationDescription: form.description
			})
		});

		if (response.ok) {
			const result = await response.json();

			saveNotification = true;
		} else {
			console.error('Failed to update organization details');
			saveNotification = false;
		}
	}

	onMount(async () => {
		getData();
	});
</script>

<div>
	{#if saveNotification === true}
		<Alert type="success" show={true}>Organization details updated successfully.</Alert>
	{:else if saveNotification === false}
		<Alert type="error" show={true}>Failed to update organization details.</Alert>
	{/if}
	<div style="height:16px" />
	<CustomDropzone label="Upload logo" showWider />

	<form class="my-5" on:submit={handleSubmit}>
		<div class="mb-6">
			<Label for="organization_name" class="block mb-2">Organization name</Label>
			<Input
				id="organization_name"
				size="lg"
				bind:value={form.organization_name}
				placeholder="Jetpack"
			/>
			{#if $errors.organization_name}
				<ErrorMessage message={$errors.organization_name._errors[0]} />
			{/if}
		</div>

		<div class="flex flex-col lg:flex-row lg:gap-4 w-full">
			<div class="mb-6 flex-1">
				<Label for="email_address" class="block mb-2">Email address</Label>
				<Input
					id="email_address"
					size="lg"
					bind:value={form.email_address}
					placeholder="name@example.com"
					class="w-full"
				/>
				{#if $errors.email_address}
					<ErrorMessage message={$errors.email_address._errors[0]} />
				{/if}
			</div>
			<div class="mb-6 flex-1">
				<Label for="phone" class="block mb-2">Phone</Label>
				<Input
					id="phone"
					size="lg"
					bind:value={form.phone}
					placeholder="xxx-xxx-xxxx"
					class="w-full"
					on:input={formatPhone}
				/>

				{#if $errors.phone}
					<ErrorMessage message={$errors.phone._errors[0]} />
				{/if}
			</div>
		</div>

		<div class="mb-6">
			<Label for="description" class="block mb-2">Description</Label>
			<Textarea {...textareaprops} bind:value={form.description} />
			{#if $errors.description}
				<ErrorMessage message={$errors.description._errors[0]} />
			{/if}
		</div>

		<Button className="w-full md:w-auto" type="submit">Save</Button>
	</form>
</div>
