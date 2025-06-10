<script>
	import { Label } from 'flowbite-svelte';
	import ErrorMessage from '../../../../components/Input/ErrorMessage.svelte';
	import Input from '../../../../components/Input/Input.svelte';

	export let basicInfo = {};
	export let errors = {};
	export let onInput = () => {};
</script>

<div class="flex flex-col gap-4">
	<div class="flex gap-4">
		<div class="w-full mb-6">
			<Label for="first_name" class="block mb-2">First Name (Required)</Label>
			<Input id="first_name" size="full" bind:value={basicInfo.firstName} />
			<ErrorMessage message={errors.firstName} />
		</div>
		<div class="w-full mb-6">
			<Label for="last_name" class="block mb-2">Last Name (Required)</Label>
			<Input id="last_name" size="full" bind:value={basicInfo.lastName} />
			<ErrorMessage message={errors.lastName} />
		</div>
	</div>
	<div class="w-full mb-6">
		<Label for="email_address" class="block mb-2">Email (Required)</Label>
		<Input id="email_address" type="email" size="full" bind:value={basicInfo.email} />
		<ErrorMessage message={errors.email} />
	</div>
	<div class="w-full mb-6">
		<Label for="phone" class="block mb-2">Phone</Label>
		<Input
			id="phone"
			size="full"
			placeholder="xxx-xxx-xxxx"
			bind:value={basicInfo.phone}
			on:input={onInput}
		/>
		<ErrorMessage message={errors.phone} />
	</div>
</div>
