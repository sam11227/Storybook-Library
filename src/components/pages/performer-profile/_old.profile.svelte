<script>
	import Avatar_lg from '@/assets/images/Avatar_lg.png';
	import Add from '@/assets/svg/add-main.svg';
	import Button from '@/components/Button/Button.svelte';
	import ProfileDropzone from '@/components/ProfileDropzone.svelte';
	import BasicInfoForm from './forms/BasicInfoForm.svelte';
	import { basicInfoSchema } from './validationSchemas';

	let triggerModal = false;

	let basicInfo = { firstName: '', lastName: '', email: '', phone: '' };
	let errors = {};

	const validateBasicInfo = () => {
		try {
			basicInfoSchema.parse(basicInfo);
			errors = {};
			return true;
		} catch (e) {
			errors = e.flatten().fieldErrors;
			return false;
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (validateBasicInfo()) {
		} else {
		}
	};
	const handleUpload = () => {
		triggerModal = false; // Ensure reset before opening
		setTimeout(() => {
			triggerModal = true; // Re-trigger modal
		}, 0);
	};
</script>

<section>
	<div class="flex gap-4">
		<!-- svelte-ignore a11y-img-redundant-alt -->
		<img class="my-auto object-contain w-24 h-24 rounded-lg`" src={Avatar_lg} alt="image" />

		<ProfileDropzone {triggerModal} />

		<div class="flex gap-4 my-auto">
			<Button beforeIcon={Add} on:click={handleUpload}>Upload</Button>
		</div>
	</div>

	<h4 class="text-xl text-neutral-400 my-5">Basic Info</h4>

	<form on:submit={handleSubmit}>
		<BasicInfoForm {basicInfo} {errors} onInput={(e) => (basicInfo.phone = e.target.value)} />

		<div class="flex justify-end gap-3">
			<Button strokebtn>Cancel</Button>
			<Button type="submit">Save</Button>
		</div>
	</form>
</section>
