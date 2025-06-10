<script>
	import { Accordion, AccordionItem, Checkbox, Label, Select, Textarea } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import PaperPlane from '../../../assets/icons/paper-plane.svg';
	import Button from '../../../components/Button/Button.svelte';
	import ErrorMessage from '../../../components/Input/ErrorMessage.svelte';
	import Input from '../../../components/Input/Input.svelte';
	import MultiSelectDropdown from '../../../components/Input/MultiSelectDropdown.svelte';
	import PlaceAutoComplete from '../../../components/PlacesAutoComplete/PlaceAutoComplete.svelte';
	import ProfileDropzone from '../../../components/ProfileDropzone.svelte';
	import {
		basicInfoSchema,
		extraDetailsSchema,
		paymentMethodsSchema,
		socialMediaSchema
	} from './validationSchemas';

	const ethnicityOptions = [
		'American Indian/Alaskan',
		'Asian',
		'Hispanic/Latino',
		'Pacific Islander',
		'African-American/Black',
		'White',
		'African'
	];

	function convertEthnicityIndicesToWords(indices) {
		const uniqueIndices = [...new Set(indices)];
		return uniqueIndices.map((index) => ethnicityOptions[index]);
	}
	let triggerModal = false;
	const validPlatforms = ['youtube.com', 'vimeo.com', 'tiktok.com'];
	let videoError = '';

	let textareaprops = {
		id: 'description',
		name: 'description',
		label: 'Your description',
		rows: 4,
		placeholder: 'Write text here...'
	};
	let basicInfo = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		location: ''
	};
	let socialMedia = { instagram: '', facebook: '', twitter: '', video: '' };
	let paymentMethods = { venmo: '', paypal: '' };
	let extraDetails = { gender: '', ethnicity: '', additionalInfo: '' };

	let errors = {
		basicInfo: {},
		socialMedia: {},
		paymentMethods: {},
		extraDetails: {}
	};
	let firstName = '';
	let lastName = '';
	let email = '';
	let phone = '';
	let stageName = '';
	export let performerID;
	let location = '';
	// Declare new variables here
	let website = '';
	let instagram = '';
	let instagramMessage = '';
	let facebook = '';
	let facebookMessage = '';
	let twitter = '';
	let twitterMessage = '';
	let tikTok = '';
	let tier = 0;
	let tikTokMessage = '';
	let videoLink = '';
	let venmo = '';
	let venmoMessage = '';
	let paypal = '';
	let paypalMessage = '';
	$: ethnicity = [0];
	$: gender = 0;
	let biography = '';
	let introCredits = '';
	$: useStageName = false;
	$: id = '';

	$: venueList = [];
	$: venueID = 0;
	$: message = '';
	$: selected = '';
	$: items = [];
	$: userID = 0;
	$: avatarPosition1 = '';
	$: venueName = '';
	$: venueImage = '';
	$: notifyPartnerConfirmEmail = false;
	$: notifyPartnerConfirmSMS = false;
	$: notifyPartnerDeclineEmail = false;
	$: notifyPartnerDeclineSMS = false;
	$: notifyPartnerCancelEmail = false;
	$: notifyPartnerCancelSMS = false;
	$: notifySendMessagesEmail = false;
	$: notifySendMessagesSMS = false;
	$: notifyAllConfirmedEmail = false;
	$: notifyAllConfirmedSMS = false;
	$: notifyOrderCompletedEmail = false;
	$: notifyOrderCompletedSMS = false;
	$: notifyAlmostSoldOutEmail = false;
	$: notifyAlmostSoldOutSMS = false;
	$: notifySoldOutEmail = false;
	$: notifySoldOutSMS = false;
	$: notifyLowTicketSalesEmail = false;
	$: notifyLowTicketSalesSMS = false;
	// Reactive statement to validate the URL
	$: {
		if (socialMedia.video.trim() === '') {
			videoError = ''; // No videoError for empty input
		} else if (validPlatforms.some((platform) => socialMedia.video.includes(platform))) {
			videoError = ''; // Valid video URL
		} else {
			videoError = 'Video link must be from YouTube, Vimeo, or TikTok';
		}
	}

	const validateForm = () => {
		errors = {
			basicInfo: {},
			socialMedia: {},
			paymentMethods: {},
			extraDetails: {}
		};

		try {
			basicInfoSchema.parse(basicInfo);
		} catch (e) {
			errors.basicInfo = e.flatten().fieldErrors;
		}

		try {
			socialMediaSchema.parse(socialMedia);
		} catch (e) {
			errors.socialMedia = e.flatten().fieldErrors;
		}

		try {
			paymentMethodsSchema.parse(paymentMethods);
		} catch (e) {
			errors.paymentMethods = e.flatten().fieldErrors;
		}

		try {
			extraDetailsSchema.parse(extraDetails);
		} catch (e) {
			errors.extraDetails = e.flatten().fieldErrors;
		}

		return Object.values(errors).every((section) => Object.keys(section).length === 0);
	};

	const validatePersonalForm = () => {
		errors = {
			basicInfo: {},
			socialMedia: {},
			paymentMethods: {},
			extraDetails: {}
		};

		try {
			basicInfoSchema.parse(basicInfo);
		} catch (e) {
			errors.basicInfo = e.flatten().fieldErrors;
		}

		return Object.values(errors).every((section) => Object.keys(section).length === 0);
	};
	function parseEthnicity(ethnicity) {
		if (Array.isArray(ethnicity)) {
			return ethnicity.map((e) => ethnicityOptions.indexOf(e)).filter((index) => index !== -1);
		} else {
			const index = ethnicityOptions.indexOf(ethnicity);
			return index !== -1 ? index : null;
		}
	}
	const submitFormData = async () => {
		const formData = {
			ID: parseInt(performerID),
			ethnicity: parseEthnicity(extraDetails.ethnicity),
			gender: parseInt(extraDetails.gender),
			description: biography,
			firstName: basicInfo.firstName,
			lastName: basicInfo.lastName,
			email: basicInfo.email,
			phoneNumber: basicInfo.phone,
			location: basicInfo.location,
			facebook: socialMedia.facebook,
			instagram: socialMedia.instagram,
			twitter: socialMedia.twitter,
			videoLink: socialMedia.video,
			venmo: paymentMethods.venmo,
			paypal: paymentMethods.paypal,
			notes: extraDetails.notes,
			biography: extraDetails.bio,
			introCredits: extraDetails.introCredits,
			stageName: stageName,
			website: website,
			tikTok: tikTok,
			userId: userID,
			avatarPosition1: avatarPosition1.replace('https://moxy.sfo3.digitaloceanspaces.com', ''),
			useStageName: useStageName,
			avatarPosition2: avatarPosition2.replace('https://moxy.sfo3.digitaloceanspaces.com', ''),
			avatarPosition3: avatarPosition3.replace('https://moxy.sfo3.digitaloceanspaces.com', ''),
			avatarPosition4: avatarPosition4.replace('https://moxy.sfo3.digitaloceanspaces.com', ''),
			avatarPosition5: avatarPosition5.replace('https://moxy.sfo3.digitaloceanspaces.com', ''),
			avatarPosition6: avatarPosition6.replace('https://moxy.sfo3.digitaloceanspaces.com', ''),
			notifyPartnerConfirmEmail: notifyPartnerConfirmEmail,
			notifyPartnerConfirmSMS: notifyPartnerConfirmSMS,
			notifyPartnerDeclineEmail: notifyPartnerDeclineEmail,
			notifyPartnerDeclineSMS: notifyPartnerDeclineSMS,
			notifyPartnerCancelEmail: notifyPartnerCancelEmail,
			notifyPartnerCancelSMS: notifyPartnerCancelSMS,
			notifySendMessagesEmail: notifySendMessagesEmail,
			notifySendMessagesSMS: notifySendMessagesSMS,
			notifyAllConfirmedEmail: notifyAllConfirmedEmail,
			notifyAllConfirmedSMS: notifyAllConfirmedSMS,
			notifyOrderCompletedEmail: notifyOrderCompletedEmail,
			notifyOrderCompletedSMS: notifyOrderCompletedSMS,
			notifyAlmostSoldOutEmail: notifyAlmostSoldOutEmail,
			notifyAlmostSoldOutSMS: notifyAlmostSoldOutSMS,
			notifySoldOutEmail: notifySoldOutEmail,
			notifySoldOutSMS: notifySoldOutSMS,
			notifyLowTicketSalesEmail: notifyLowTicketSalesEmail,
			notifyLowTicketSalesSMS: notifyLowTicketSalesSMS
		};

		try {
			const response = await fetch('http://localhost:8080/api/protected/modifyPerformerProfile', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer asdf`
				},
				credentials: 'include',
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				const result = await response.json();
				console.log('Form submitted successfully:', result);
			} else {
				console.error('Failed to submit form', response.statusText);
			}
		} catch (e) {
			console.error('Error submitting form:', e);
		}
	};

	// Function to handle form submission
	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!validatePersonalForm()) {
			console.error('Personal form validation failed');
			return;
		}

		if (!validateForm()) {
			console.error('Form validation failed');
			return;
		}

		// Call the formData/network request function
		await submitFormData();
	};

	const handleSubmitPersonalInform = async (event) => {
		event.preventDefault();

		if (validatePersonalForm()) {
			try {
				const formData = {
					ID: performerID,
					ethnicity: parseEthnicity(extraDetails.ethnicity),
					gender: gender,
					description: biography,
					firstName: basicInfo.firstName,
					lastName: basicInfo.lastName,
					email: basicInfo.email,
					phoneNumber: basicInfo.phone,
					location: basicInfo.location,
					facebook: socialMedia.facebook,
					instagram: socialMedia.instagram,
					twitter: socialMedia.twitter,
					videoLink: socialMedia.video,
					venmo: paymentMethods.venmo,
					paypal: paymentMethods.paypal,
					notes: extraDetails.notes,
					biography: extraDetails.bio,
					introCredits: extraDetails.introCredits,
					stageName: stageName,
					website: website,
					tikTok: tikTok,
					userId: localUserID,
					avatarPosition1: avatarPosition1,
					useStageName: useStageName,
					notifyPartnerConfirmEmail: notifyPartnerConfirmEmail,
					notifyPartnerConfirmSMS: notifyPartnerConfirmSMS,
					notifyPartnerDeclineEmail: notifyPartnerDeclineEmail,
					notifyPartnerDeclineSMS: notifyPartnerDeclineSMS,
					notifyPartnerCancelEmail: notifyPartnerCancelEmail,
					notifyPartnerCancelSMS: notifyPartnerCancelSMS,
					notifySendMessagesEmail: notifySendMessagesEmail,
					notifySendMessagesSMS: notifySendMessagesSMS,
					notifyAllConfirmedEmail: notifyAllConfirmedEmail,
					notifyAllConfirmedSMS: notifyAllConfirmedSMS,
					notifyOrderCompletedEmail: notifyOrderCompletedEmail,
					notifyOrderCompletedSMS: notifyOrderCompletedSMS,
					notifyAlmostSoldOutEmail: notifyAlmostSoldOutEmail,
					notifyAlmostSoldOutSMS: notifyAlmostSoldOutSMS,
					notifySoldOutEmail: notifySoldOutEmail,
					notifySoldOutSMS: notifySoldOutSMS,
					notifyLowTicketSalesEmail: notifyLowTicketSalesEmail,
					notifyLowTicketSalesSMS: notifyLowTicketSalesSMS
				};

				const response = await fetch('http://localhost:8080/api/protected/modifyPerformerProfile', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer asdf`
					},
					credentials: 'include',
					body: JSON.stringify(formData)
				});

				if (response.ok) {
					const result = await response.json();
				} else {
					console.error('Failed to submit form', response.statusText);
				}
			} catch (e) {}
		} else {
		}
	};

	function formatPhoneNumber(value) {
		const numericValue = value.replace(/\D/g, '');

		const match = numericValue.match(/^(\d{3})(\d{3})(\d{1,4})?$/);
		if (match) {
			return [match[1], match[2], match[3]].filter(Boolean).join('-');
		}
		return numericValue;
	}

	function handlePhoneInput(event) {
		const formattedValue = formatPhoneNumber(event.target.value);
		basicInfo.phone = formattedValue;
	}

	async function handleUpload(file, position) {
		let formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch('http://localhost:8080/api/protected/uploadEventImage', {
				method: 'POST',
				headers: {
					Authorization: `Bearer a`
				},
				credentials: 'include',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to upload file');
			}

			const data = await response.json();
			const uploadedFilename = `https://moxy.sfo3.digitaloceanspaces.com${data.filename}`;

			// Set the filename to the appropriate avatar position
			switch (position) {
				case 1:
					avatarPosition1 = uploadedFilename;
					break;
				case 2:
					avatarPosition2 = uploadedFilename;
					break;
				case 3:
					avatarPosition3 = uploadedFilename;
					break;
				case 4:
					avatarPosition4 = uploadedFilename;
					break;
				case 5:
					avatarPosition5 = uploadedFilename;
					break;
				case 6:
					avatarPosition6 = uploadedFilename;
					break;
				default:
					console.error('Invalid position');
			}
			submitFormData();
		} catch (err) {
			console.error('Upload error:', err);
		}
	}
	$: isProfileLocked = false;
	$: localUserID = 0;
	$: avatarPosition1 = '';
	$: avatarPosition2 = '';
	$: avatarPosition3 = '';
	$: avatarPosition4 = '';
	$: avatarPosition5 = '';
	$: avatarPosition6 = '';
	$: existingImages = [];
	async function getData() {
		let result = '';

		const venueResponse = await fetch('http://localhost:8080/api/protected/listAllVenues', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			},
			credentials: 'include'
		});

		if (venueResponse.ok) {
			result = await venueResponse.json();
			let tableData = [];
			let selectDropdownItems = [];

			result.forEach((result) => {
				tableData.push({
					id: result.ID,
					name: result.name,
					address: result.address,
					email: result.email,
					description: result.description,
					instagram: result.instagram,
					facebook: result.facebook,
					phone: result.phone,
					twitter: result.twitter,
					image: result.image
				});
				selectDropdownItems.push({ value: result.ID, name: result.name, location: result.address });
			});
			venueList = selectDropdownItems;
		} else {
			result = 'failure';
		}

		const userResponse = await fetch(
			'http://localhost:8080/api/protected/getRosterEventPerformer/' + performerID,
			{
				credentials: 'include',
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer asdf`
				},
				credentials: 'include'
			}
		);

		if (userResponse.ok) {
			result = await userResponse.json();
			//id = result.ID;
			tier = result.tier.toString();
			venueID = result.venueId;
			//ethnicity = result.ethnicity;
			//console.log('415 ETHNICITY', ethnicity);
			gender = result.gender.toString();
		}

		const response = await fetch(
			'http://localhost:8080/api/protected/getPerformerProfile/' + performerID,
			{
				credentials: 'include',
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer asdf`
				},
				credentials: 'include'
			}
		);

		if (response.ok) {
			result = await response.json();
			isProfileLocked = result.profileClaimed;
			id = result.ID;
			ethnicity = convertEthnicityIndicesToWords(result.ethnicity);

			gender = result.gender;
			biography = result.description;
			basicInfo.firstName = result.firstName;
			basicInfo.lastName = result.lastName;
			basicInfo.email = result.email;
			basicInfo.phone = result.phoneNumber;
			basicInfo.location = result.location;
			socialMedia.facebook = result.facebook;
			socialMedia.instagram = result.instagram;
			socialMedia.twitter = result.twitter;
			socialMedia.video = result.videoLink;
			paymentMethods.venmo = result.venmo;
			paymentMethods.paypal = result.paypal;
			extraDetails.notes = result.notes;
			extraDetails.ethnicity = convertEthnicityIndicesToWords(result.ethnicity);

			extraDetails.gender = result.gender;

			extraDetails.bio = result.biography;
			extraDetails.introCredits = result.introCredits;

			stageName = result.stageName;
			email = result.email;
			phone = result.phoneNumber;
			location = result.location;
			website = result.website;
			instagram = result.instagram;
			facebook = result.facebook;
			twitter = result.twitter;
			tikTok = result.tikTok;
			videoLink = result.videoLink;
			userID = result.userId;
			localUserID = result.userId;
			venmo = result.venmo;
			paypal = result.paypal;
			biography = result.biography;
			introCredits = result.introCredits;
			avatarPosition1 = result.avatarPosition1;
			avatarPosition2 = result.avatarPosition2;
			avatarPosition3 = result.avatarPosition3;
			avatarPosition4 = result.avatarPosition4;
			avatarPosition5 = result.avatarPosition5;
			avatarPosition6 = result.avatarPosition6;
			useStageName = Boolean(result.useStageName);
			// Notification settings
			notifyPartnerConfirmEmail = result.notifyPartnerConfirmEmail;
			notifyPartnerConfirmSMS = result.notifyPartnerConfirmSMS;
			notifyPartnerDeclineEmail = result.notifyPartnerDeclineEmail;
			notifyPartnerDeclineSMS = result.notifyPartnerDeclineSMS;
			notifyPartnerCancelEmail = result.notifyPartnerCancelEmail;
			notifyPartnerCancelSMS = result.notifyPartnerCancelSMS;
			notifySendMessagesEmail = result.notifySendMessagesEmail;
			notifySendMessagesSMS = result.notifySendMessagesSMS;
			notifyAllConfirmedEmail = result.notifyAllConfirmedEmail;
			notifyAllConfirmedSMS = result.notifyAllConfirmedSMS;
			notifyOrderCompletedEmail = result.notifyOrderCompletedEmail;
			notifyOrderCompletedSMS = result.notifyOrderCompletedSMS;
			notifyAlmostSoldOutEmail = result.notifyAlmostSoldOutEmail;
			notifyAlmostSoldOutSMS = result.notifyAlmostSoldOutSMS;
			notifySoldOutEmail = result.notifySoldOutEmail;
			notifySoldOutSMS = result.notifySoldOutSMS;
			notifyLowTicketSalesEmail = result.notifyLowTicketSalesEmail;
			notifyLowTicketSalesSMS = result.notifyLowTicketSalesSMS;
			existingImages = [
				avatarPosition1,
				avatarPosition2,
				avatarPosition3,
				avatarPosition4,
				avatarPosition5,
				avatarPosition6
			]
				.filter((image) => image !== '')
				.map((image) => `https://moxy.sfo3.digitaloceanspaces.com${image}`);
		}

		const rosterPerformerData = await fetch(
			'http://localhost:8080/api/protected/getRosterEventPerformersForUser/' + userID,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',

					Authorization: `Bearer asdf`
				},
				credentials: 'include'
			}
		);
		if (rosterPerformerData.ok) {
			result = await rosterPerformerData.json();
			let tableData = [];
			result.forEach((result) => {
				tableData.push({
					value: result.Venue.ID,
					name: result.Venue.name
				});
			});
			items = tableData;
			if (result.length === 1) {
				venueName = result[0].Venue.name;
				venueID = result[0].Venue.ID;
				selected = result[0].Venue.ID;
				venueImage = result[0].Venue.image;
			}
		} else {
			result = 'failure';
		}
	}

	onMount(async () => {
		await getData();
	});
</script>

<section>
	<div class="flex gap-4">
		<ProfileDropzone
			{triggerModal}
			{existingImages}
			on:upload={(event) => {
				const file = event.detail;
				handleUpload(file, 1);
			}}
		/>
	</div>

	<h4 class="text-xl text-neutral-400 my-5">Basic Info</h4>

	<form on:submit={handleSubmitPersonalInform}>
		<div class="flex flex-col gap-4">
			<!--  -->
			<div class="flex lg:flex-1 flex-col">
				<div class="flex gap-4">
					<div class="w-full mb-6">
						<Label for="first_name" class="block mb-2"
							>First name <span class="text-sm text-red-500">(Required)</span>
						</Label>
						<Input
							id="first_name"
							size="full"
							bind:value={basicInfo.firstName}
							readonly={isProfileLocked}
						/>
						<ErrorMessage message={errors.basicInfo.firstName} />
					</div>
					<div class="w-full mb-6">
						<Label for="last_name" class="block mb-2"
							>Last name <span class="text-sm text-red-500">(Required)</span></Label
						>
						<Input
							id="last_name"
							size="full"
							bind:value={basicInfo.lastName}
							readonly={isProfileLocked}
						/>
						<ErrorMessage message={errors.basicInfo.lastName} />
					</div>
				</div>
				<div class="flex flex-col lg:flex-row gap-4">
					<div class="w-full mb-2">
						<Label for="email_address" class="block mb-2"
							>Email address <span class="text-sm text-red-500">(Required)</span></Label
						>
						<Input
							id="email_address"
							type="email"
							size="full"
							bind:value={basicInfo.email}
							readonly={isProfileLocked}
						/>
						<ErrorMessage message={errors.basicInfo.email} />
					</div>
					<div class="w-full mb-6">
						<Label for="phone" class="block mb-2">Phone</Label>
						<Input
							readonly={isProfileLocked}
							id="phone"
							size="full"
							type="phoneNumber"
							placeholder="xxx-xxx-xxxx"
							bind:value={basicInfo.phone}
							on:input={handlePhoneInput}
						/>
						<ErrorMessage message={errors.basicInfo.phone} />
					</div>
				</div>
				<div class="mb-6">
					<Label for="location" class="block mb-2">Home City</Label>
					<PlaceAutoComplete
						placeholder="46, Real Estate, New Work, USA"
						value={basicInfo.location}
						on:place-changed={(value) => console.log('place-changed', value.detail)}
					/>
					<ErrorMessage message={errors.basicInfo.location} />
				</div>
				<div class="mb-6">
					<p class="text-2xl text-neutral-500 my-2">Availability</p>
					<Label for="receive" class="block mb-2">
						Request availability updates from these venues
					</Label>
					<div class="flex flex-col gap-3">
						{#each venueList as venue}
							<Checkbox class="my-auto">
								<div class="flex flex-col">
									{venue.name}
									<span class="text-sm text-neutral-500 font-light">{venue.location}</span>
								</div>
							</Checkbox>
						{/each}
					</div>
				</div>
				<Button beforeIcon={PaperPlane} className="max-w-max" type="submit"
					>Send availability request</Button
				>
			</div>
			<!--  -->
		</div>
	</form>

	<form on:submit={handleSubmit}>
		<Accordion class="rounded-none border-none" flush>
			<AccordionItem open>
				<span slot="header" class="text-sm font-normal flex">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M15.6 8.40033V12.9003C15.6 14.3915 16.8088 15.6003 18.3 15.6003C19.7912 15.6003 21 14.3915 21 12.9003V12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C14.0265 21 15.8965 20.3302 17.4009 19.2M15.6 12.0003C15.6 13.9886 13.9882 15.6003 12 15.6003C10.0118 15.6003 8.4 13.9886 8.4 12.0003C8.4 10.0121 10.0118 8.40033 12 8.40033C13.9882 8.40033 15.6 10.0121 15.6 12.0003Z"
							stroke="#252B37"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>

					<span class="my-auto ml-2 text-black"> Social media</span>
				</span>

				<div class="flex flex-col gap-4">
					<!--  -->
					<div class="flex lg:flex-1 flex-col">
						<h4 class="text-xl text-neutral-400 my-5">Social media</h4>

						<div class="mb-6">
							<Label for="video" class="block mb-2">Video link (YouTube, Vimeo, TikTok)</Label>
							<Input
								id="video"
								size="full"
								type="text"
								bind:value={socialMedia.video}
								readonly={isProfileLocked}
							/>

							<ErrorMessage message={videoError} />
						</div>
						<div class="mb-6">
							<Label for="instagram" class="block mb-2">Instagram username</Label>
							<Input
								readonly={isProfileLocked}
								id="instagram"
								size="full"
								type="url"
								url="https://instagram.com/@"
								bind:value={socialMedia.instagram}
							/>
							<ErrorMessage message={errors.socialMedia.instagram} />
						</div>
						<div class="mb-6">
							<Label for="facebook" class="block mb-2">Facebook username</Label>
							<Input
								readonly={isProfileLocked}
								id="facebook"
								size="full"
								type="url"
								url="https://facebook.com/@"
								bind:value={socialMedia.facebook}
							/>
							<ErrorMessage
								message={errors.socialMedia.facebook}
								bind:value={socialMedia.facebook}
							/>
						</div>
						<div class="mb-6">
							<Label for="twitter" class="block mb-2">Twitter username</Label>
							<Input
								readonly={isProfileLocked}
								id="twitter"
								size="full"
								type="url"
								url="https://twitter.com/@"
								bind:value={socialMedia.twitter}
							/>
							<ErrorMessage message={errors.socialMedia.twitter} />
						</div>
					</div>
					<!--  -->
				</div>
				<!-- Social media -->
			</AccordionItem>
			<AccordionItem>
				<span slot="header" class="text-sm font-normal flex gap-2">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M2 12C2 8.46252 2 6.69377 3.0528 5.5129C3.22119 5.32403 3.40678 5.14935 3.60746 4.99087C4.86213 4 6.74142 4 10.5 4H13.5C17.2586 4 19.1379 4 20.3925 4.99087C20.5932 5.14935 20.7788 5.32403 20.9472 5.5129C22 6.69377 22 8.46252 22 12C22 15.5375 22 17.3062 20.9472 18.4871C20.7788 18.676 20.5932 18.8506 20.3925 19.0091C19.1379 20 17.2586 20 13.5 20H10.5C6.74142 20 4.86213 20 3.60746 19.0091C3.40678 18.8506 3.22119 18.676 3.0528 18.4871C2 17.3062 2 15.5375 2 12Z"
							stroke="#252B37"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M10 16H11.5"
							stroke="#252B37"
							stroke-width="1.5"
							stroke-miterlimit="10"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M14.5 16H18"
							stroke="#252B37"
							stroke-width="1.5"
							stroke-miterlimit="10"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path d="M2 9H22" stroke="#252B37" stroke-width="1.5" stroke-linejoin="round" />
					</svg>

					<span class="my-auto text-black">Payment methods</span>
				</span>
				<!-- payment nethods -->
				<div class="flex flex-col gap-4">
					<!--  -->
					<div class="flex lg:flex-1 flex-col">
						<h4 class="text-xl text-neutral-400 my-5">Payment methods</h4>

						<div class="mb-6">
							<Label for="venmo" class="block mb-2">Venmo username</Label>

							<Input
								readonly={isProfileLocked}
								id="venmo"
								size="full"
								type="url"
								url="https://venmo.com/@"
								bind:value={paymentMethods.venmo}
							/>
							<ErrorMessage message={errors.paymentMethods.venmo} />
						</div>
						<div class="mb-6">
							<Label for="paypal" class="block mb-2">Paypal username</Label>
							<Input
								readonly={isProfileLocked}
								id="paypal"
								size="full"
								type="url"
								url="https://paypal.com/@"
								bind:value={paymentMethods.paypal}
							/>
							<ErrorMessage message={errors.paymentMethods.paypal} />
						</div>
					</div>
					<!--  -->
				</div>
				<!-- payment nethods -->
			</AccordionItem>
			<AccordionItem>
				<span slot="header" class="text-sm font-normal flex gap-2">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M14 9H18" stroke="#252B37" stroke-width="1.5" stroke-linecap="round" />
						<path d="M14 12.5H17" stroke="#252B37" stroke-width="1.5" stroke-linecap="round" />
						<path
							d="M17 3H7C4.23858 3 2 5.23858 2 8V16C2 18.7614 4.23858 21 7 21H17C19.7614 21 22 18.7614 22 16V8C22 5.23858 19.7614 3 17 3Z"
							stroke="#252B37"
							stroke-width="1.5"
							stroke-linejoin="round"
						/>
						<path
							d="M5 16C6.20831 13.4189 10.7122 13.2491 12 16"
							stroke="#252B37"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M10.5 9C10.5 10.1046 9.60457 11 8.5 11C7.39543 11 6.5 10.1046 6.5 9C6.5 7.89543 7.39543 7 8.5 7C9.60457 7 10.5 7.89543 10.5 9Z"
							stroke="#252B37"
							stroke-width="1.5"
						/>
					</svg>

					<span class="my-auto text-black">Extra details</span>
				</span>
				<!-- Extra details -->
				<div class="flex flex-col gap-4">
					<!--  -->
					<div class="flex lg:flex-1 flex-col">
						<h4 class="text-xl text-neutral-500 my-5">Extra details</h4>

						<div class="mb-6">
							<Label for="gender" class="block mb-2">Gender</Label>
							<Select
								name="gender"
								class="mt-2 p-4"
								items={[
									{ name: 'Male', value: 1 },
									{ name: 'Female', value: 2 },
									{ name: 'Non-Binary', value: 3 },
									{ name: 'Unspecified', value: 0 }
								]}
								placeholder="Select"
								on:select={(value) => console.log('Gender', value)}
								bind:value={extraDetails.gender}
							/>
							<ErrorMessage message={errors.extraDetails.gender} />
						</div>

						<div class="mb-6">
							<Label for="ethnicity" class="block mb-2">Ethnicity</Label>
							<MultiSelectDropdown
								placeholder="Select"
								availableOptions={ethnicityOptions}
								selectedOptions={extraDetails.ethnicity}
								on:change={(event) => {
									extraDetails.ethnicity = event.detail.selectedOptions;
								}}
							/>

							<ErrorMessage message={errors.extraDetails.ethnicity} />
						</div>
						<div class="mb-6">
							<Label for="intro-credits" class="block mb-2">
								Intro Credits (max. 75 characters)
							</Label>
							<Input
								readonly={isProfileLocked}
								id="intro-credits"
								size="full"
								placeholder="The Tonight Show, Comedy Central"
								maxlength="75"
								bind:value={extraDetails.introCredits}
							/>
							<ErrorMessage message={errors.extraDetails.introCredits} />
							<div style="display:flex;justify-content:space-between;">
								<span class="my-2 text-xs text-neutral-400">
									What to mention when they’re introduced to stage
								</span>
								<span class="text-xs text-neutral-400" style="margin-top:4px;">
									{extraDetails.introCredits ? extraDetails.introCredits.length : 0}/75 characters
								</span>
							</div>
						</div>

						<div class="mb-6">
							<Label for="bio" class="block mb-2">Bio (max. 1000 characters)</Label>
							<Textarea
								readonly={isProfileLocked}
								id="bio"
								size="full"
								placeholder="Enter your bio"
								maxlength="1000"
								bind:value={extraDetails.bio}
							/>
							<ErrorMessage message={errors.extraDetails.bio} />
							<div style="display:flex;justify-content:space-between;">
								<span class="my-2 text-xs text-neutral-400"> Tell us about yourself </span>
								<span class="text-xs text-neutral-400" style="margin-top:4px;">
									{extraDetails.bio ? extraDetails.bio.length : 0}/1000 characters
								</span>
							</div>
						</div>
						<div class="mb-6">
							<Label for="intro-credits" class="block mb-2"
								>Notes (for internal use only not visible to performer)</Label
							>
							<Textarea
								{...textareaprops}
								bind:value={extraDetails.notes}
								readonly={isProfileLocked}
							/>
							<ErrorMessage message={errors.extraDetails.notes} />
						</div>
					</div>
					<!--  -->
				</div>
				<!-- Extra details -->
			</AccordionItem>
		</Accordion>
		<br />

		<div class="flex justify-end gap-3">
			<Button strokebtn on:click={() => (window.location.href = '/operator/rosters')}>Cancel</Button
			>
			<Button type="submit" disabled={isProfileLocked}>Save</Button>
		</div>
	</form>
</section>
