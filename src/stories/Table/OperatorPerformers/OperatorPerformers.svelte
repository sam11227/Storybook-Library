<script>
	import defaultAvatar from '$lib/images/default-avatar.png';
	import { redirect } from '@sveltejs/kit';
	import {
		Card,
		Dropdown,
		DropdownItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import {
		AngleRightSolid,
		DotsHorizontalOutline,
		EditOutline,
		EyeSolid,
		HomeSolid,
		PlusSolid,
		TrashBinSolid
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import Badge from '../../../components/Badge/Badge.svelte';
	import Button from '../../../components/Button/Button.svelte';
	import Input from '../../../components/Input/Input.svelte';
	import Modal from '../../../components/Modal/Modal.svelte';

	let searchTerm = '';
	let items = [];
	let currentItem = {};
	let defaultModal = false;
	let editModal = false;
	let performerModal = false;
	let currentId = 0;
	let addModal = false;
	let genders = [
		{ value: 0, name: 'Unspecified' },
		{ value: 1, name: 'Male' },
		{ value: 2, name: 'Female' },
		{ value: 3, name: 'Nonbinary' }
	];
	let ethnicities = [
		{ value: 0, name: 'Prefer not to say' },
		{ value: 1, name: 'American Indian/Alaskan' },
		{ value: 2, name: 'Asian' },
		{ value: 3, name: 'African-American/Black' },
		{ value: 4, name: 'Hispanic/Latino' },
		{ value: 5, name: 'White' },
		{ value: 6, name: 'African' },
		{ value: 7, name: 'Middle Eastern' },
		{ value: 8, name: 'Other' }
	];
	$: venueList = [];
	$: firstName = '';
	$: lastName = '';
	$: tier = '';
	$: ethnicity = '';
	$: gender = '';
	$: role = '';
	$: email = '';
	$: accepted = true;
	$: rpid = 0;
	$: rpethnicity = '';
	$: rpgender = '';
	$: rpdescription = '';
	$: rpfirstName = '';
	$: rplastName = '';
	$: rpstageName = '';
	$: rpemail = '';
	$: rpphoneNumber = '';
	$: rplocation = '';
	$: rpprofileImage = '';
	$: rpwebsite = '';
	$: rpinstagram = '';
	$: rpfacebook = '';
	$: rptwitter = '';
	$: rptikTok = '';
	$: rpvideoLink = '';
	$: rpvenmo = '';
	$: rppaypal = '';
	$: rpbiography = '';
	$: rpintroCredits = '';
	$: rpavatarPosition1 = '';
	$: rpavatarPosition2 = '';
	$: rpavatarPosition3 = '';
	$: rpavatarPosition4 = '';
	$: rpavatarPosition5 = '';
	$: rpavatarPosition6 = '';

	$: venueID = 0;
	let performers = [];

	let genderOptions = [
		{ value: 0, name: 'Unspecified' },
		{ value: 1, name: 'Male' },
		{ value: 2, name: 'Female' },
		{ value: 3, name: 'Nonbinary' }
	];
	const ethnicityOptions = [
		'American Indian/Alaskan',
		'Asian',
		'Hispanic/Latino',
		'Pacific Islander',
		'African-American/Black',
		'White',
		'African'
	];
	let rosterPerformerMap = [];
	$: finalRosterPerformerMap = [];
	export let data;
	// Reactive statements for validation
	$: isFirstNameValid = firstName.length > 0;
	$: isLastNameValid = lastName.length > 0;
	$: isEmailValid = /^[^\s@]+(\+[^\s@]+)?@[^\s@]+\.[^\s@]+$/.test(email);
	$: isGenderValid = [0, 1, 2, 3, 4].includes(gender);
	$: isEthnicityValid = ethnicities.some((e) => e.value === ethnicity);
	$: isVenueIDValid = venueList.some((v) => v.value === venueID);
	$: isTierValid = tier >= 1 && tier <= 5;
	// Function to check if all validations pass

	let isAddButtonClicked = false;

	function onAddButtonClick() {
		isAddButtonClicked = true;
		// ...existing code...
	}

	function allValidationsPass() {
		return (
			isFirstNameValid &&
			isLastNameValid &&
			isEmailValid &&
			isGenderValid &&
			isEthnicityValid &&
			isVenueIDValid &&
			isTierValid
		);
	}
	// check if document.cookie has token, if not, redirect to /auth/login
	let token = data.token;
	if (!token) {
		redirect(302, '/auth/login');
	}

	let result = null;
	function handlePerformerModal(line) {
		currentItem = line.User.performerProfile;
		performerModal = true;
		window.location.href = '/operator/rosters/' + line.User.performerProfile.ID;
	}
	function handleEditPerformerModal(line) {
		currentItem = line;
		editModal = true;
		currentId = line.ID;
		email = line.User.email;
		venueID = line.venueId;
		accepted = line.acceptedState === 2 ? true : false;
		tier = line ? line.tier : 1;
		firstName = line.User.firstName;
		lastName = line.User.lastName;
		gender = line.gender;
		ethnicity = line.ethnicity;
	}
	function handleAdd() {
		addModal = true;
		rpid = '';
		rpethnicity = '';
		rpgender = '';
		rpdescription = '';
		rpfirstName = '';
		rplastName = '';
		rpstageName = '';
		rpemail = '';
		rpphoneNumber = '';
		rplocation = '';
		rpprofileImage = '';
		rpwebsite = '';
		rpinstagram = '';
		rpfacebook = '';
		rptwitter = '';
		rptikTok = '';
		rpvideoLink = '';
		rpvenmo = '';
		rppaypal = '';
		rpbiography = '';
		rpintroCredits = '';
		rpavatarPosition1 = '';
		rpavatarPosition2 = '';
		rpavatarPosition3 = '';
		rpavatarPosition4 = '';
		rpavatarPosition5 = '';
		rpavatarPosition6 = '';
		firstName = '';
		lastName = '';
		tier = '';
		ethnicity = '';
		gender = '';
		role = '';
		email = '';
		accepted = '';
	}

	async function getData() {
		const response = await fetch('http://localhost:8080/api/protected/listAllVenues', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (response.ok) {
			result = await response.json();
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
				selectDropdownItems.push({ value: result.ID, name: result.name });
			});
			items = tableData;
			venueList = selectDropdownItems;
		} else {
			result = 'failure';
			redirect(302, '/auth/login');
		}
	}

	$: showPerformerDeleteModal = false;
	$: performerToDelete = -1;

	async function firePerformerDeleteModal(id) {
		showPerformerDeleteModal = true;
		performerToDelete = id;
	}

	async function cancelRosterPerformer(performerID) {
		const response = await fetch(
			'http://localhost:8080/api/protected/rosterEventPerformer/' + performerID,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			}
		);

		if (response.ok) {
			result = await response.json();
			await getData();
			location.reload();
		} else {
			result = 'failure';
		}
	}
	async function getVenueRosterPerformers() {
		let finalVenuePerformerMapping = [];
		items.forEach(async (venue) => {
			const response = await fetch(
				'http://localhost:8080/api/protected/getRosterEventPerformers/' + venue.id,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				}
			);
			if (response.ok) {
				result = await response.json();
				if (result === null) {
					result = [];
				}
				performers = result;
				if (result != null) {
					result.forEach((performer) => {
						rosterPerformerMap.push({
							value: performer.ID,
							name: performer.User.firstName + ' ' + performer.User.lastName
						});
					});
				}
				finalVenuePerformerMapping.push({ venueID: venue.id, venue, performers: performers });
				finalRosterPerformerMap = finalVenuePerformerMapping;
			} else {
				result = 'failure';
				redirect(302, '/auth/login');
			}
		});
	}

	$: {
		if (searchTerm !== '') {
			finalVenuePerformerMapping = finalVenuePerformerMapping.map((item) => ({
				...item,
				performers: item.performers.filter((performer) =>
					(performer.User.firstName + ' ' + performer.User.lastName)
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
				)
			}));
		}
	}

	function parseEthnicity(ethnicity) {
		if (Array.isArray(ethnicity)) {
			return ethnicity.map((index) => ethnicityOptions[index]).filter((e) => e !== undefined);
		} else {
			const result = ethnicityOptions[ethnicity];
			return result !== undefined ? result : null;
		}
	}
	onMount(async () => {
		await getData();
		getVenueRosterPerformers();
	});
</script>

<div
	style="align-items:center;display:flex;flex-direction:row;color:#353b4b;font-size:12px;padding-bottom:16px;"
>
	<HomeSolid size="xs" style="margin-right: 8px;" />
	<a style="margin-right: 8px;" href="/operator">Home</a>
	<AngleRightSolid size="xs" style="margin-right: 8px;" />
	<a style="margin-right: 8px;" href="/operator/rosters">Performers</a>
</div>
<Card size="xxl">
	<div style="display:flex;flex-direction:row;justify-content:space-between;">
		<h5 class="text-[20px] font-[400] leading-[20px] text-[#0D1526]" style="padding-bottom:16px;">
			Performers
		</h5>
		{#if data.bookingSendBookingInvitations}
			<Button
				on:click={() => {
					window.location.href = '/operator/rosters/new';
				}}><PlusSolid style="margin-right: 8px;" /> Add performer</Button
			>
		{/if}
	</div>

	<div>
		<Input type="text" id="first_name" placeholder="Search" bind:value={searchTerm} size="full" />
	</div>
	{searchTerm}
	{#each finalRosterPerformerMap as item}
		<span style="margin-top:32px">{item.venue.name}</span>
		<Table placeholder="Search by performer name" hoverable={true} bind:inputValue={searchTerm}>
			<TableHead>
				<TableHeadCell>Performer</TableHeadCell>
				<TableHeadCell>Ethnicity</TableHeadCell>
				<TableHeadCell>Gender</TableHeadCell>
				<TableHeadCell>Tier</TableHeadCell>
				<TableHeadCell>Last booked</TableHeadCell>
				<TableHeadCell />
			</TableHead>
			<TableBody class="divide-y">
				{#each item.performers as performer}
					<TableBodyRow>
						<TableBodyCell
							on:click={() => {
								handlePerformerModal(performer);
							}}
							><div class="flex items-center">
								<img
									src={performer.User.performerProfile.avatarPosition1 !== ''
										? 'https://moxy.sfo3.digitaloceanspaces.com' +
										  performer.User.performerProfile.avatarPosition1
										: defaultAvatar}
									class="w-8 h-8 rounded"
								/>

								<div class="ml-2">{performer.User.firstName} {performer.User.lastName}</div>
							</div>
						</TableBodyCell>
						<TableBodyCell
							on:click={() => {
								handlePerformerModal(performer);
							}}>{parseEthnicity(performer.User.performerProfile.ethnicity)}</TableBodyCell
						>
						<TableBodyCell
							on:click={() => {
								handlePerformerModal(performer);
							}}
						>
							<Badge
								size="medium"
								textColor="white"
								bgColor={performer.gender === 1
									? 'indigo'
									: performer.gender === 2
									? 'red'
									: performer.gender === 3
									? 'green'
									: performer.gender === 4
									? 'purple'
									: 'gray'}
							>
								{performer.gender === 1
									? 'Male'
									: performer.gender === 2
									? 'Female'
									: performer.gender === 3
									? 'Non-binary'
									: 'Unspecified'}
							</Badge>
						</TableBodyCell>

						<TableBodyCell
							on:click={() => {
								handlePerformerModal(performer);
							}}
						>
							<Badge
								style="min-width:86px"
								textColor="white"
								size="medium"
								bgColor={performer.tier === 1
									? 'dark'
									: performer.tier === 2
									? 'indigo'
									: performer.tier === 3
									? 'green'
									: performer.tier === 5
									? 'red'
									: 'default'}
							>
								{performer.tier}
							</Badge>
						</TableBodyCell>
						<TableBodyCell
							on:click={() => {
								handlePerformerModal(performer);
							}}
						>
							{performer.lastBookedDate === '0001-01-01 00:00:00 +0000 UTC'
								? ''
								: new Date(performer.lastBookedDate).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'short',
										day: 'numeric'
								  })}
						</TableBodyCell>
						<TableBodyCell>
							<Button class="!p-2" color="gray" id={`bookingSelector-${performer.ID}`}
								><DotsHorizontalOutline class="w-4 h-4" color="dark" /></Button
							>
							<Dropdown
								placement="left"
								triggeredBy={`#bookingSelector-${performer.ID}`}
								style="z-index: 99"
							>
								{#if data.bookingEditPerformerProfiles}
									<DropdownItem
										on:click={() => {
											handleEditPerformerModal(performer);
										}}
										><div style="display:flex;flex-direction:row;">
											<EditOutline style="width:16px;margin-right:8px;" /> Edit
										</div>
									</DropdownItem>
								{/if}
								<DropdownItem
									on:click={() => {
										window.location.href = `/operator/rosters/${performer.ID}`;
									}}
									><div style="display:flex;flex-direction:row;">
										<EyeSolid style="width:16px;margin-right:8px;" /> Preview
									</div>
								</DropdownItem>
								<DropdownItem
									on:click={() => {
										firePerformerDeleteModal(performer.ID);
									}}
									style="color:red;"
									><div style="display:flex;flex-direction:row;">
										<TrashBinSolid style="width:16px;margin-right:8px;" /> Delete
									</div>
								</DropdownItem>
							</Dropdown>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/each}
</Card>

<Modal title="Confirm delete" bind:open={showPerformerDeleteModal} size={'xs'}>
	<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
		Are you sure you want to remove this performer from your roster?
	</p>
	<svelte:fragment slot="footer">
		<Button
			danger
			on:click={() => {
				showPerformerDeleteModal = false;
			}}>Cancel</Button
		>
		<Button
			color="red"
			on:click={() => {
				showPerformerDeleteModal = false;
				cancelRosterPerformer(performerToDelete);
			}}>Delete</Button
		>
	</svelte:fragment>
</Modal>
