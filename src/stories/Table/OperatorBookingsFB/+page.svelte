<script>
	import defaultAvatar from '$lib/images/default-avatar.png';
	import { redirect } from '@sveltejs/kit';
	import { writable } from 'svelte/store';

	import {
		Accordion,
		AccordionItem,
		Avatar,
		Card,
		Checkbox,
		Dropdown,
		DropdownItem,
		Label,
		Listgroup,
		ListgroupItem,
		Modal,
		MultiSelect,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Textarea
	} from 'flowbite-svelte';
	import {
		AngleRightSolid,
		CheckCircleOutline,
		CheckCircleSolid,
		ChevronDownOutline,
		CloseCircleSolid,
		DotsHorizontalOutline,
		DotsVerticalOutline,
		EyeSolid,
		FilterOutline,
		HomeSolid,
		MapPinSolid,
		PapperPlaneOutline,
		PapperPlaneSolid,
		PlusSolid,
		TrashBinSolid,
		UserAddOutline,
		UserSolid
	} from 'flowbite-svelte-icons';
	import AutoComplete from 'simple-svelte-autocomplete';
	import Badge from '../../../../../../components/Badge/Badge.svelte';
	import Button from '../../../../../../components/Button/Button.svelte';
	import Input from '../../../../../../components/Input/Input.svelte';

	import { onMount } from 'svelte';

	const colorList = [
		{ id: 1, name: 'White', code: '#FFFFFF' },
		{ id: 2, name: 'Red', code: '#FF0000' },
		{ id: 3, name: 'Yellow', code: '#FF00FF' },
		{ id: 4, name: 'Green', code: '#00FF00' },
		{ id: 5, name: 'Blue', code: '#0000FF' },
		{ id: 6, name: 'Black', code: '#000000' }
	];
	let selectedColor = null;

	$: selectedTier = [];
	$: selectedGender = [];
	$: selectedEthnicity = [];
	$: globalEvent = {};
	let selectedAvailability = false;

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
	let tiers = [
		{ value: 1, name: '1' },
		{ value: 2, name: '2' },
		{ value: 3, name: '3' },
		{ value: 4, name: '4' },
		{ value: 5, name: '5' }
	];
	let searchTerm = '';
	let items = [];
	$: performers = [];

	$: openFilterModal = false;
	let rosterPerformerMap = [];
	let eventInvites = [];
	let currentItem = {};
	let defaultModal = false;
	let performerModal = false;
	let positionModal = false;
	let setLengthModal = false;
	let statusModal = false;
	let sendMessageModal = false;
	let inviteHistoryModal = false;
	let inviteFromRosterModal = false;
	const flipDurationMs = 300;
	function handleDndConsider(e) {
		items = e.detail.items;
	}
	function handleDndFinalize(e) {
		items = e.detail.items;
	}

	$: editPerformerSearchTerm = '';
	$: positionRole = '';
	$: title = '';
	$: description = '';
	$: startDateTime = '';
	$: endDateTime = '';
	$: doorsOpenTime = '';
	$: ageRestriction = '';
	$: spotQuantity = '';
	$: setLength = '';
	$: sendDailySalesReport = '';
	$: venueId = '';
	$: stageId = '';
	$: eventType = '';
	$: accessType = '';
	$: privacyOption = '';
	$: timeZone = '';
	$: eventSummary = '';
	$: password = '';
	$: publicationDateTime = '';
	$: displayTicketsLeft = '';
	$: postSalesMessage = '';
	$: statusSelector = '';
	$: setLengthSelector = 0;
	$: positionSelector = '';
	$: messageContents = '';
	$: position = '';

	let eventTypes = [
		{ value: 0, name: 'Standup' },
		{ value: 1, name: 'Sketch' },
		{ value: 2, name: 'Improv' },
		{ value: 3, name: 'Variety' },
		{ value: 4, name: 'Class' },
		{ value: 5, name: 'Podcast' },
		{ value: 6, name: 'Concert' },
		{ value: 7, name: 'Storytelling' }
	];

	let accessTypes = [
		{ value: 0, name: 'Paid' },
		{ value: 1, name: 'Free' },
		{ value: 2, name: 'Donation' }
	];

	let privacyOptions = [
		{ value: 0, name: 'Anyone with Link' },
		{ value: 1, name: 'Password Protected' }
	];
	let roles = [
		{ value: 5, name: 'HOST', color: 'dark' },
		{ value: 1, name: 'OPENER', color: 'yellow' },
		{ value: 2, name: 'FEATURE', color: 'indigo' },
		{ value: 3, name: 'HEADLINER', color: 'red' },
		{ value: 4, name: 'GUEST', color: 'green' },
		{ value: -1, name: 'SELECT ROLE', color: 'dark' },
		{ value: 0, name: 'SELECT ROLE', color: 'dark' }
	];

	let states = [
		{ value: 2, name: 'Confirmed', color: 'green', icon: CheckCircleSolid },
		{ value: 1, name: 'Declined', color: 'red' },
		{ value: 3, name: 'Canceled', color: 'red', icon: CloseCircleSolid },
		{ value: 4, name: 'No show', color: 'red', icon: CloseCircleSolid }
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

	function parseEthnicity(ethnicity) {
		if (Array.isArray(ethnicity)) {
			return ethnicity.map((index) => ethnicityOptions[index]).filter((e) => e !== undefined);
		} else {
			const result = ethnicityOptions[ethnicity];
			return result !== undefined ? result : null;
		}
	}

	export let data;
	// check if document.cookie has token, if not, redirect to /auth/login
	let token = data.token;
	if (!token) {
		redirect(302, '/auth/login');
	}
	let inviteFromPinnedModal = false;
	let backupEditPerformer;
	let result = null;
	function handleEdit(line) {
		currentItem = line;
		title = currentItem.title;
		description = currentItem.description;
		startDateTime = currentItem.startDateTime;
		endDateTime = currentItem.endDateTime;
		doorsOpenTime = currentItem.doorsOpenTime;
		ageRestriction = currentItem.ageRestriction;
		spotQuantity = currentItem.spotQuantity;
		setLength = currentItem.setLength;
		sendDailySalesReport = currentItem.sendDailySalesReport;
		venueId = currentItem.venueId;
		stageId = currentItem.stageId;
		eventType = currentItem.eventType;
		accessType = currentItem.accessType;
		privacyOption = currentItem.privacyOption;
		timeZone = currentItem.timeZone;
		eventSummary = currentItem.eventSummary;
		password = currentItem.password;
		publicationDateTime = currentItem.publicationDateTime;
		displayTicketsLeft = currentItem.displayTicketsLeft;
		postSalesMessage = currentItem.postSalesMessage;
		defaultModal = true;
	}

	async function updateRow() {
		const response = await fetch('http://localhost:8080/api/protected/editEvent', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				events: [
					{
						title,
						description,
						startDateTime,
						endDateTime,
						doorsOpenTime,
						ageRestriction,
						spotQuantity,
						setLength,
						sendDailySalesReport,
						venueId,
						stageId,
						eventType,
						accessType,
						privacyOption,
						timeZone,
						eventSummary,
						password,
						publicationDateTime,
						displayTicketsLeft,
						postSalesMessage,
						id: currentItem.id
					}
				]
			})
		});

		if (response.ok) {
			result = await response.json();
			getData();
		} else {
			result = 'failure';
		}
	}
	async function addBlankEventInvite() {
		let tempEventInvites = eventInvites;
		// find largest value "id" in eventinvites collection and add one to it
		let highestID = 0;
		tempEventInvites.forEach((eventInvite) => {
			if (eventInvite.ID > highestID) {
				highestID = eventInvite.ID;
			}
		});

		const response = await fetch('http://localhost:8080/api/protected/createEventPerformer', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				listPosition: eventInvites.length + 1,
				eventId: parseInt(data.eventID),
				roleOnStage: 0
			})
		});

		if (response.ok) {
			const data = await response.json();
			tempEventInvites.push(data);
			eventInvites = tempEventInvites;
		} else {
			console.error('Error:', response.status);
		}
	}

	async function addNewInviteForCancelledOrPinned(inviteToCopy) {
		const response = await fetch('http://localhost:8080/api/protected/createEventPerformer', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				...inviteToCopy
			})
		});

		if (response.ok) {
			const data = await response.json();
		} else {
			console.error('Error:', response.status);
		}
	}

	function firePositionModal(item) {
		currentItem = item;
		positionRole = item.roleOnStage;
		positionModal = true;
	}
	function fireSendMessageModal(item) {
		currentItem = item;
		messageContents = '';
		sendMessageModal = true;
	}
	$: sendAllPerformersMessageModal = false;
	$: allPerformersIncludeInvited = false;
	function fireSendAllPerformersMessageModal(item) {
		currentItem = item;
		messageContents = '';
		sendAllPerformersMessageModal = true;
	}
	$: sendAllAttendeesMessageModal = false;
	function fireSendAllAttendeesMessageModal(item) {
		currentItem = item;
		messageContents = '';
		sendAllAttendeesMessageModal = true;
	}
	async function sendReminder(item) {
		currentItem = item;

		const response = await fetch(
			'http://localhost:8080/api/protected/resendEmailToEventPerformer',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ eventPerformerId: item.ID })
			}
		);
		if (response.ok) {
			result = await response.json();
			getData();
		} else {
			result = 'failure';
			redirect(302, '/auth/login');
		}
	}

	async function printLineup() {
		const response = await fetch(
			'http://localhost:8080/api/protected/printSetList/' + data.eventID,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				credentials: 'include'
			}
		);
		if (response.ok) {
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;

			link.download = 'Lineup - ' + globalEvent.title + '.pdf';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else {
			result = 'failure';
			redirect(302, '/auth/login');
		}
	}

	async function downloadPhotos() {
		const response = await fetch(
			'http://localhost:8080/api/protected/generateAvatarZIP/' + data.eventID,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				credentials: 'include'
			}
		);
		if (response.ok) {
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = 'avatars.zip';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else {
			result = 'failure';
			redirect(302, '/auth/login');
		}
	}

	function fireStatusModal(item) {
		currentItem = item;
		statusSelector = item.acceptedState;
		statusModal = true;
	}
	function fireSetLengthModal(item) {
		currentItem = item;
		setLengthSelector = item.setLength;
		setLengthModal = true;
	}
	function firePerformerModal(item) {
		currentItem = item;
		temporaryPerformer = item;
		performerModal = true;
		selectedColor = '';
	}

	function fireInvitationHistoryModal(item) {
		currentItem = item;
		inviteHistoryModal = true;
	}

	let displayPin = false;

	function fireInviteFromRosterModal(item) {
		currentItem = item;
		inviteFromRosterModal = true;
		displayPin = true;
		updateRosterPendingContactRowNumber = -1;
	}

	function fireInviteFromPinnedModal(item, shouldPin) {
		currentItem = item;
		inviteFromPinnedModal = true;
		displayPin = shouldPin;
	}

	function updatePosition(position) {
		// loop over eventInvites and find the one with the same ID as currentItem
		let tempEventInvites = eventInvites;
		tempEventInvites.forEach((eventInvite) => {
			if (eventInvite.ID === currentItem.ID) {
				eventInvite.roleOnStage = parseInt(positionRole);
				updateEventPerformer(eventInvite);
			}
		});
		eventInvites = tempEventInvites;
		positionModal = false;
		// save data to API
		// reload table
	}
	function clearPerformer(modalItem) {
		let tempEventInvites = eventInvites;
		tempEventInvites.forEach((eventInvite) => {
			if (modalItem.ID === eventInvite.ID) {
				eventInvite.RosterPerformer = null;
				eventInvite.rosterPerformerId = null;
				currentItem.RosterPerformer = null;
				updateEventPerformer(eventInvite);
			}
		});
		eventInvites = tempEventInvites;
		getData();
	}
	function resetPerformer(modalItem) {
		let tempEventInvites = eventInvites;
		tempEventInvites.forEach((eventInvite) => {
			if (backupEditPerformer === null && modalItem.ID === eventInvite.ID) {
				eventInvite.RosterPerformer = null;
				eventInvite.rosterPerformerId = null;
				currentItem.RosterPerformer = null;
			} else if (eventInvite.ID === modalItem.ID) {
				eventInvite.RosterPerformer = backupEditPerformer;
				eventInvite.rosterPerformerId = parseInt(backupEditPerformer.ID);
				currentItem.RosterPerformer = backupEditPerformer;
			}
		});
		eventInvites = tempEventInvites;
		getData();
	}

	function testReplacePerformer(performer) {}

	$: temporaryPerformer = {};

	function replacePerformer(performer) {
		// loop over eventInvites and find the one with the same ID as currentItem
		let tempEventInvites = eventInvites;
		tempEventInvites.forEach((eventInvite) => {
			if (eventInvite.ID === currentItem.ID) {
				backupEditPerformer = eventInvite.RosterPerformer;
				eventInvite.RosterPerformer = performer;
				eventInvite.rosterPerformerId = parseInt(performer.ID);
			}
		});
		currentItem.RosterPerformer = performer;
		currentItem.rosterPerformerId = parseInt(performer.ID);
		//eventInvites = tempEventInvites;
	}

	function actuatePerformer() {
		currentItem = temporaryPerformer;
	}

	function updatePerformer(performer) {
		// loop over eventInvites and find the one with the same ID as currentItem
		let tempEventInvites = eventInvites;
		tempEventInvites.forEach((eventInvite) => {
			if (eventInvite.ID === currentItem.ID) {
				eventInvite.rosterPerformerId = parseInt(performer.ID);
				updateEventPerformer(eventInvite);
			}
		});
		//eventInvites = tempEventInvites;
		performerModal = false;
		inviteFromRosterModal = false;
		// save data to API
		// reload table
	}

	function updatePerformerInvite(event) {
		// loop over eventInvites and find the one with the same ID as currentItem
		let tempEventInvites = eventInvites;
		tempEventInvites.forEach((eventInvite) => {
			if (eventInvite.ID == event.ID) {
				eventInvite.rosterPerformerId = parseInt(currentItem.rosterPerformerId);
				updateEventPerformer(eventInvite);
			}
		});
		eventInvites = tempEventInvites;
		performerModal = false;
		inviteFromRosterModal = false;
		// save data to API
		// reload table
	}
	function updatePinnedPerformerConfirm(event, originalID) {
		// loop over eventInvites and find the one with the same ID as currentItem
		let tempEventInvites = eventInvites;
		tempEventInvites.forEach((eventInvite) => {
			if (eventInvite.ID == event.ID) {
				eventInvite.rosterPerformerId = parseInt(currentItem.rosterPerformerId);
				eventInvite.acceptedState = 2;
				updateEventPerformer(eventInvite, false);
				unpinPerformer(currentItem);
			}
		});
		eventInvites = tempEventInvites;
		inviteFromRosterModal = false;
		inviteFromPinnedModal = false;
		// save data to API
		// reload table
	}
	function updatePinnedPerformer(event, originalID) {
		// loop over eventInvites and find the one with the same ID as currentItem
		let tempEventInvites = eventInvites;

		tempEventInvites.forEach((eventInvite) => {
			if (eventInvite.ID == event.ID) {
				eventInvite.rosterPerformerId = parseInt(currentItem.rosterPerformerId);
				eventInvite.acceptedState = 0;
				updateEventPerformer(eventInvite, false);
				unpinPerformer(currentItem);
			}
		});
		eventInvites = tempEventInvites;
		inviteFromRosterModal = false;
		inviteFromPinnedModal = false;
		// save data to API
		// reload table
	}

	$: updateRosterPendingContactRowNumber = -1;
	function updateRosterPerformerConfirm(event) {
		// loop over eventInvites and find the one with the same ID as currentItem
		let tempEventInvites = eventInvites;
		tempEventInvites.forEach((eventInvite, idx) => {
			if (eventInvite.ID == event.ID) {
				eventInvite.rosterPerformerId = parseInt(currentItem.ID);
				eventInvite.acceptedState = 2;
				updateEventPerformer(eventInvite, false);
				updateRosterPendingContactRowNumber = idx;
			}
		});
		eventInvites = tempEventInvites;
		//inviteFromRosterModal = false;
		// save data to API
		// reload table
	}
	function updateRosterPerformer(event) {
		// loop over eventInvites and find the one with the same ID as currentItem
		let tempEventInvites = eventInvites;
		tempEventInvites.forEach((eventInvite) => {
			if (eventInvite.ID == event.ID) {
				eventInvite.rosterPerformerId = parseInt(currentItem.ID);
				eventInvite.acceptedState = 0;
				updateEventPerformer(eventInvite, true);
			}
		});
		eventInvites = tempEventInvites;
		inviteFromRosterModal = false;
		// save data to API
		// reload table
	}

	async function sendConfirmedEmail(item) {
		// loop over eventInvites and find the one with the same ID as currentItem
		const response = await fetch(
			'http://localhost:8080/api/protected/sendConfirmedEmailToEventPerformer/',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					eventPerformerId: item.ID
				})
			}
		);

		if (response.ok) {
			const data = await response.json();
			inviteFromRosterModal = false;
			getData();
		} else {
			console.error('Error:', response.status);
		}

		performerModal = false;
		inviteFromRosterModal = false;
		// save data to API
		// reload table
	}

	async function pinPerformer(event) {
		// loop over eventInvites and find the one with the same ID as currentItem

		let tempEventInvites = eventInvites;
		// Check if there's already an eventInvite with the same rosterPerformerId and an acceptedState of 5
		let existingInvite = tempEventInvites.find(
			(invite) =>
				invite.rosterPerformerId === parseInt(currentItem.rosterPerformerId) &&
				invite.acceptedState === 5
		);

		if (!existingInvite) {
			const response = await fetch('http://localhost:8080/api/protected/createEventPerformer', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					listPosition: eventInvites.length + 1,
					eventId: parseInt(data.eventID),
					roleOnStage: 0,
					acceptedState: 5,
					rosterPerformerID: parseInt(currentItem.rosterPerformerId)
				})
			});

			if (response.ok) {
				const data = await response.json();
				tempEventInvites.push(data);
				eventInvites = tempEventInvites;

				getData();
			} else {
				console.error('Error:', response.status);
			}
		}
		performerModal = false;
		inviteFromRosterModal = false;
		// save data to API
		// reload table
	}
	async function pinPerformerRoster(event) {
		// loop over eventInvites and find the one with the same ID as currentItem
		let tempEventInvites = eventInvites;
		const response = await fetch('http://localhost:8080/api/protected/createEventPerformer', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				listPosition: eventInvites.length + 1,
				eventId: parseInt(data.eventID),
				roleOnStage: 0,
				acceptedState: 5,
				rosterPerformerID: parseInt(currentItem.ID)
			})
		});

		if (response.ok) {
			const data = await response.json();
			tempEventInvites.push(data);
			eventInvites = tempEventInvites;

			getData();
		} else {
			console.error('Error:', response.status);
		}

		performerModal = false;
		inviteFromRosterModal = false;
		// save data to API
		// reload table
	}
	async function unpinPerformer(event) {
		// loop over eventInvites and find the one with the same ID as currentItem
		let tempEventInvites = eventInvites;
		const response = await fetch('http://localhost:8080/api/protected/deleteEventPerformer', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				eventPerformerId: currentItem.ID
			})
		});

		if (response.ok) {
			const data = await response.json();
			let anyPinnedFlag = false;

			eventInvites.forEach((eventInvite) => {
				if (eventInvite.acceptedState === 5 && eventInvite.ID !== currentItem.ID) {
					anyPinnedFlag = true;
				}
			});

			showPinned = anyPinnedFlag;

			getData();
		} else {
			console.error('Error:', response.status);
		}

		performerModal = false;
		inviteFromRosterModal = false;
		inviteFromPinnedModal = false;
		// save data to API
		// reload table
	}

	function updatePerformerConfirm(event) {
		// loop over eventInvites and find the one with the same ID as currentItem
		let tempEventInvites = eventInvites;
		tempEventInvites.forEach((eventInvite) => {
			if (eventInvite.ID == event.ID) {
				eventInvite.rosterPerformerId = parseInt(currentItem.rosterPerformerId);
				eventInvite.acceptedState = 2;
				updateEventPerformer(eventInvite, false);
			}
		});
		eventInvites = tempEventInvites;
		performerModal = false;
		inviteFromRosterModal = false;
		// save data to API
		// reload table
	}

	function updateSetLength() {
		// loop over eventInvites and find the one with the same ID as currentItem
		let tempEventInvites = eventInvites;
		tempEventInvites.forEach((eventInvite) => {
			if (eventInvite.ID === currentItem.ID) {
				eventInvite.setLength = parseInt(setLengthSelector);
				updateEventPerformer(eventInvite, true);
			}
		});
		eventInvites = tempEventInvites;
		setLengthModal = false;
	}
	async function sendAllPerformersNotes(messageContents) {
		sendMessageModal = false;

		const response = await fetch(
			'http://localhost:8080/api/protected/sendEmailToAllEventPerformersOfEvent/' +
				data.eventID +
				'?includeInvited=' +
				allPerformersIncludeInvited,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ messageContents })
			}
		);
		if (response.ok) {
			result = await response.json();
			sendAllPerformersMessageModal = false;
			getData();
		} else {
			result = 'failure';
			redirect(302, '/auth/login');
		}
	}
	async function sendAllAttendeesNotes(messageContents) {
		sendMessageModal = false;

		const response = await fetch(
			'http://localhost:8080/api/protected/sendEmailToAllPatronsOfEvent/' + data.eventID,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ messageContents })
			}
		);
		if (response.ok) {
			result = await response.json();
			sendAllAttendeesMessageModal = false;
			getData();
		} else {
			result = 'failure';
			redirect(302, '/auth/login');
		}
	}
	async function sendperformerNotes(eventPerformerID, messageContents) {
		sendMessageModal = false;

		const response = await fetch('http://localhost:8080/api/protected/sendEmailToEventPerformer', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ eventPerformerID, messageContents })
		});
		if (response.ok) {
			result = await response.json();
			getData();
		} else {
			result = 'failure';
			redirect(302, '/auth/login');
		}
	}
	$: filteredItems =
		searchTerm === ''
			? performers
			: performers.filter(
					(item) => item.name && item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
			  );
	function updateStatus(notify) {
		// loop over eventInvites and find the one with the same ID as currentItem
		let tempEventInvites = eventInvites;
		tempEventInvites.forEach((eventInvite) => {
			if (eventInvite.ID === currentItem.ID) {
				eventInvite.acceptedState = parseInt(statusSelector);
				if ([1, 3, 4].includes(eventInvite.acceptedState)) {
					addNewInviteForCancelledOrPinned({ ...eventInvite });
					updateEventPerformer(
						{
							...eventInvite,
							rosterPerformerID: 0,
							rosterPerformerId: 0,
							RosterPerformer: null,
							acceptedState: 0,
							performerNotes: ''
						},
						notify
					);
				} else if (eventInvite.acceptedState === 2) {
					updateEventPerformer(eventInvite, notify);
				}
			}
		});
		eventInvites = tempEventInvites;
		statusModal = false;
	}
	async function deleteEventPerformer(invite, notify) {
		const response = await fetch('http://localhost:8080/api/protected/deleteEventPerformer', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ ...invite, notify, eventPerformerID: invite.ID })
		});
		if (response.ok) {
			result = await response.json();

			await getData();
		} else {
			result = 'failure';
			redirect(302, '/auth/login');
		}
	}
	async function updateEventPerformer(invite, notify) {
		const response = await fetch('http://localhost:8080/api/protected/eventPerformer', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ ...invite, notify })
		});
		if (response.ok) {
			result = await response.json();
			let anyCancelledFlag = false;

			await getData();
		} else {
			result = 'failure';
			redirect(302, '/auth/login');
		}
	}

	function setPositionRole(position) {
		positionRole = position;
	}
	$: mergedItems =
		currentItem && currentItem.performerStateChanges && currentItem.communications
			? [...currentItem.performerStateChanges, ...currentItem.communications].sort(
					(a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt)
			  )
			: [];

	$: promptForRefresh = false;

	async function getEventPerformers(checkIfRefreshNeeded) {
		const response = await fetch(
			'http://localhost:8080/api/protected/getEventInvitesByEventID/' + data.eventID,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				credentials: 'include'
			}
		);

		if (response.ok) {
			const newResult = await response.json();
			newResult.sort((a, b) => (a.listPosition > b.listPosition ? 1 : -1));

			// Check if acceptedState of any eventInvite in eventInvites is different from newResult
			if (checkIfRefreshNeeded && eventInvites.length > 0) {
				for (let i = 0; i < eventInvites.length; i++) {
					if (eventInvites[i].acceptedState !== newResult[i].acceptedState) {
						promptForRefresh = true;
						break;
					}
				}
			}

			eventInvites = newResult;
		} else {
			result = 'failure';
			redirect(302, '/auth/login');
		}
	}
	$: {
		if (
			selectedAvailability !== undefined ||
			selectedTier !== undefined ||
			selectedGender !== undefined ||
			selectedEthnicity !== undefined
		) {
			getData();
		}
	}
	setInterval(() => getEventPerformers(true), 10000);

	async function getVenueRosterPerformers() {
		let queryParams = new URLSearchParams();

		if (selectedAvailability !== false && selectedAvailability !== undefined) {
			queryParams.append('showAvailability', selectedAvailability);
		}

		if (selectedTier !== false && selectedTier !== undefined) {
			queryParams.append('selectedTier', selectedTier);
		}

		if (selectedGender !== false && selectedGender !== undefined) {
			queryParams.append('selectedGender', selectedGender);
		}

		if (selectedEthnicity !== false && selectedEthnicity !== undefined) {
			queryParams.append('selectedEthnicity', selectedEthnicity);
		}
		const response = await fetch(
			`http://localhost:8080/api/protected/getRosterEventPerformersFilteredByEvent/${data.venueID}/${data.eventID}?${queryParams}`,
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
			if (result !== null) {
				result.forEach((performer) => {
					rosterPerformerMap.push({
						value: performer.ID,
						name: performer.User.firstName + ' ' + performer.User.lastName
					});
				});
				performers = result;
			} else {
				performers = [];
			}
		} else {
			result = 'failure';
			redirect(302, '/auth/login');
		}
	}

	async function getDropDownVenueRosterPerformers() {
		let queryParams = new URLSearchParams();

		if (selectedAvailability !== false && selectedAvailability !== undefined) {
			queryParams.append('showAvailability', selectedAvailability);
		}

		if (selectedTier !== false && selectedTier !== undefined) {
			queryParams.append('selectedTier', selectedTier);
		}

		if (selectedGender !== false && selectedGender !== undefined) {
			queryParams.append('selectedGender', selectedGender);
		}

		if (selectedEthnicity !== false && selectedEthnicity !== undefined) {
			queryParams.append('selectedEthnicity', selectedEthnicity);
		}
		const response = await fetch(
			`http://localhost:8080/api/protected/getDropDownRosterEventPerformersFilteredByEvent/${data.venueID}/${data.eventID}?${queryParams}`,
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
			let finalDropDownPerformers = [];
			if (result !== null) {
				result.forEach((performer) => {
					finalDropDownPerformers.push({
						...performer,
						value: performer.ID,
						name: performer.User.firstName + ' ' + performer.User.lastName
					});
				});
			} else {
				finalDropDownPerformers = [];
			}

			availablePerformers = finalDropDownPerformers;
		} else {
			result = 'failure';
			redirect(302, '/auth/login');
		}
	}

	async function getVenueRosterPerformersAtTime(date) {
		const response = await fetch(
			'http://localhost:8080/api/protected/getRosterPerformersForVenueAtTime/' +
				data.venueID +
				'/' +
				date,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				credentials: 'include'
			}
		)
			.then((response) => response.json())
			.then((result) => {
				if (result !== null) {
					let tableData = [];
					tableData.push({
						id: result.ID,
						role: result.roleOnStage,
						invitationID: result.invitationId,
						acceptedState: result.acceptedState,
						createdAt: result.CreatedAt,
						listPosition: result.listPosition,
						roleDescription: result.description
					});
					items = tableData;
					let newPerformers = [];
					performers.forEach((performer) => {
						newPerformers.push(performer);
					});
					performers = newPerformers;
					return items;
				}
			})
			.catch((e) => {
				result = 'failure';
				redirect(302, '/auth/login');
			});
	}
	$: availablePerformers = [];
	async function getEvent() {
		const response = await fetch('http://localhost:8080/api/public/getEvent/' + data.eventID, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			credentials: 'include'
		});

		if (response.ok) {
			result = await response.json();
			let tableData = [];
			title = result.title;
			tableData.push({
				ID: result.ID,
				id: result.ID,
				title: result.title,
				description: result.description,
				startDateTime: result.startDateTime,
				endDateTime: result.endDateTime,
				doorsOpenTime: result.doorsOpenTime,
				ageRestriction: result.ageRestriction,
				spotQuantity: result.spotQuantity,
				setLength: parseInt(result.setLength),
				sendDailySalesReport: result.sendDailySalesReport,
				venueId: result.venueId,
				stageId: result.stageId,
				eventType: result.eventType,
				accessType: result.accessType,
				privacyOption: result.privacyOption,
				timeZone: result.timeZone,
				eventSummary: result.eventSummary,
				password: result.password,
				publicationDateTime: result.publicationDateTime,
				displayTicketsLeft: result.displayTicketsLeft,
				postSalesMessage: result.postSalesMessage
			});
			items = tableData;
			globalEvent = tableData[0];
		} else {
			result = 'failure';
			redirect(302, '/auth/login');
		}
	}
	let showFullMessage = [];
	$: showPinned = false;
	$: showCancelled = false;
	function toggleMessage(index) {
		showFullMessage[index] = !showFullMessage[index];
	}
	$: sortKey = null; // default sort key
	$: sortDirection = null; // default sort direction (ascending)
	let sortItems = writable([]); // make a copy of the items array
	// Define a function to sort the items
	const sortTable = (key) => {
		// If the same key is clicked, reverse the sort direction
		if ($sortKey === key) {
			sortDirection.update((val) => -val);
		} else {
			sortKey.set(key);
			sortDirection.set(1);
		}
	};
	$: {
		const key = $sortKey;
		const direction = $sortDirection;
		const sorted = [...$sortItems].sort((a, b) => {
			const aVal = a[key];
			const bVal = b[key];
			if (aVal < bVal) {
				return -direction;
			} else if (aVal > bVal) {
				return direction;
			}
			return 0;
		});

		sortItems.set(sorted);
		filteredItems = sorted;
	}

	// Call replacePerformer whenever selectedColor changes
	$: if (selectedColor) {
		replacePerformer(selectedColor);
	}
	function removeGenderElement(elem) {
		selectedGender = selectedGender.filter((gender) => gender !== elem);

		return selectedGender;
	}
	function removeEthnicityElement(elem) {
		selectedEthnicity = selectedEthnicity.filter((ethnicity) => ethnicity !== elem);

		return selectedEthnicity;
	}

	function removeTierElement(elem) {
		selectedTier = selectedTier.filter((tier) => tier !== elem);

		return selectedTier;
	}

	async function getData() {
		await Promise.all([
			getEvent(),
			getEventPerformers(false),
			getVenueRosterPerformers(),
			getDropDownVenueRosterPerformers()
		]).then(async (results) => {
			let eventDateFormatted = new Date(items[0].startDateTime); // format like YYYY-MM-DD
			// iterate over items[1] and if any of the performers have .acceptedState = 5, set showPinned = true

			eventInvites.forEach((performer) => {
				if (performer.acceptedState === 5) {
					showPinned = true;
				}
			});

			let eventDate =
				eventDateFormatted.getFullYear() +
				'-' +
				(eventDateFormatted.getMonth() + 1).toString().padStart(2, '0') +
				'-' +
				eventDateFormatted.getDate().toString().padStart(2, '0');
			await getVenueRosterPerformersAtTime(eventDate);
			let idSet = new Set();
			let finalPerformers = [];
			performers = performers.filter((performer) => {
				let found = false;
				eventInvites.forEach((invite) => {
					if (invite.rosterPerformerId === performer.ID && !found) {
						found = true;
					}
				});
				if (!found && !idSet.has(performer.ID)) {
					idSet.add(performer.ID);
					finalPerformers.push({
						...performer,
						id: performer.ID,
						name: performer.User.firstName + ' ' + performer.User.lastName
					});
				}
			});
			finalPerformers = finalPerformers.filter(
				(performer, index, self) => index === self.findIndex((p) => p.id === performer.id)
			);
			performers = finalPerformers;
			let anyCancelledFlag = false;
			eventInvites.forEach((eventInvite) => {
				if (
					(eventInvite.acceptedState === 1 ||
						eventInvite.acceptedState === 3 ||
						eventInvite.acceptedState === 4) &&
					!eventInvite.shouldBeHidden
				) {
					anyCancelledFlag = true;
				}
			});
			showCancelled = anyCancelledFlag;

			sortKey = writable('id'); // default sort key
			sortDirection = writable(1); // default sort direction (ascending)
			sortItems = writable(performers.slice()); // make a copy of the items array
		});
	}
	let originalStatus;
	let inputElement;
	$: if (currentItem) {
		originalStatus = currentItem.acceptedState;
	}
	onMount(async () => {
		getData();
	});
	let selected;
</script>

<div
	style="align-items:center;display:flex;flex-direction:row;color:#353b4b;font-size:12px;padding-bottom:16px;"
>
	<HomeSolid size="xs" style="margin-right: 8px;" />
	<a style="margin-right: 8px;" href="/operator">Home</a>
	<AngleRightSolid size="xs" style="margin-right: 8px;" />
	<a style="margin-right: 8px;" href="/operator/events">Events</a>
	<AngleRightSolid size="xs" style="margin-right: 8px;" />
	<a style="margin-right: 8px;" href={`/operator/events/${data.eventID}`}>{title}</a>
	<AngleRightSolid size="xs" style="margin-right: 8px;" />
	Performers
</div>

<Card size="xxl">
	{#if promptForRefresh}
		<div
			on:click={() => location.reload()}
			style="
				width: 100%;
				text-align: center;
				border-radius: 8px;
				padding: 16px 24px;
				gap: 24px;
				background-color: #FF6666;
				box-shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.1);
				color: white;
			"
		>
			You may be looking at old data. Please click here to update.
		</div>
	{/if}
	<div style="display:flex;flex-direction:row;margin-bottom: 32px;justify-content:space-between;">
		<h1 style="font-weight:400;font-size:24px;">Performers</h1>
		<Button outline={true} id="mainActionsButton"
			>Actions <ChevronDownOutline style="margin-left:8px;" /></Button
		>
		<Dropdown placement="left" triggeredBy={`#mainActionsButton`} style="z-index: 99">
			<DropdownItem on:click={() => fireSendAllPerformersMessageModal()}
				>Message All Performers</DropdownItem
			>
			<DropdownItem on:click={() => fireSendAllAttendeesMessageModal()}
				>Message All Attendees</DropdownItem
			>
			<DropdownItem on:click={() => printLineup()}>Print lineup</DropdownItem>
			<DropdownItem on:click={() => downloadPhotos()}>Download photos</DropdownItem>
		</Dropdown>
	</div>

	<Accordion>
		<AccordionItem open>
			<span slot="header" style="display:flex;">
				<UserSolid color="green" class="mr-2" />Lineup
			</span>
			<Table>
				<TableHead>
					<TableHeadCell />
					<TableHeadCell>Performer</TableHeadCell>
					<TableHeadCell>Status</TableHeadCell>
					<TableHeadCell>Position</TableHeadCell>
					<TableHeadCell>Set</TableHeadCell>
					<TableHeadCell>Notes</TableHeadCell>
					<TableHeadCell />
				</TableHead>

				<TableBody class="divide-y">
					{#each eventInvites as item (item.ID)}
						{#if item.acceptedState !== 1 && item.acceptedState !== 3 && item.acceptedState !== 4 && item.acceptedState !== 5}
							<TableBodyRow>
								<TableBodyCell style="display:flex;">
									<DotsVerticalOutline />
								</TableBodyCell>

								<TableBodyCell
									class="hover-bg-gray"
									on:click={() => {
										if (
											data.bookingSendBookingInvitations &&
											item.rosterPerformerId === null &&
											item.acceptedState === 0
										) {
											firePerformerModal(item);
										}
									}}
								>
									{#if item.RosterPerformer === null || item.RosterPerformer === undefined || item.RosterPerformer.User === null}
										<div>
											<div class="flex items-center">
												<img
													src={item.RosterPerformer &&
													item.RosterPerformer.User.performerProfile.avatarPosition1 !== ''
														? `https://moxy.sfo3.digitaloceanspaces.com${item.RosterPerformer.User.performerProfile.avatarPosition1}`
														: defaultAvatar}
													class="w-12 h-12 rounded"
												/>
												<Button outline={true} color="light" size="xs"
													><UserAddOutline class="w-3 h-3 me-2 " /><span>Add</span></Button
												>
											</div>
										</div>
									{:else}
										<div
											class={item.acceptedState === 0
												? `invitePending flex items-center`
												: `flex items-center`}
										>
											<img
												src={item.RosterPerformer &&
												item.RosterPerformer.User.performerProfile.avatarPosition1 !== ''
													? `https://moxy.sfo3.digitaloceanspaces.com${item.RosterPerformer.User.performerProfile.avatarPosition1}`
													: defaultAvatar}
												class="w-12 h-12 rounded"
											/>
											<div class={`ml-2 font-bold text-lg`} style="font-weight:500;font-size:16px;">
												{item.RosterPerformer.User.firstName}
												{item.RosterPerformer.User.lastName}
											</div>
										</div>
									{/if}
								</TableBodyCell>
								<TableBodyCell
									class="hover-bg-gray"
									on:click={() => {
										if (data.bookingConfirmDeclinePerformers && item.RosterPerformer) {
											fireStatusModal(item);
										}
									}}
								>
									{#if item.acceptedState === 0 && item.RosterPerformer !== null}
										<Badge
											size="medium"
											textColor="white"
											bgColor="gray"
											style="min-width:110px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
											><PapperPlaneOutline class="mr-2" style="height: 0.9rem;width: 0.9rem;" /> Invited</Badge
										>
									{:else if item.acceptedState === 2}
										<Badge
											size="medium"
											textColor="white"
											bgColor="green"
											style="min-width:110px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
											><CheckCircleSolid class="mr-2" style="height: 0.9rem;width: 0.9rem;" /> Confirmed</Badge
										>
									{:else if item.acceptedState === -1}
										<Badge
											size="medium"
											textColor="white"
											bgColor="red"
											style="min-width:110px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
											>Not yet saved</Badge
										>
									{/if}
								</TableBodyCell>
								<TableBodyCell class="hover-bg-gray" on:click={() => firePositionModal(item)}>
									<div id="roleSelector">
										{#each roles as role (role.value)}
											{#if item.roleOnStage === role.value && item.roleOnStage !== 0 && item.roleOnStage !== -1}
												<Badge
													size="medium"
													textColor={role.color === 'yellow' ? 'black' : 'white'}
													bgColor={role.color}
													style="min-width:100px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
													>{role.name}</Badge
												>
											{/if}
										{/each}
									</div>
								</TableBodyCell>
								<TableBodyCell class="hover-bg-gray" on:click={() => fireSetLengthModal(item)}>
									{#if item.setLength !== 0}
										{item.setLength}
									{/if}
								</TableBodyCell>
								<TableBodyCell>
									{item.performerNotes}
								</TableBodyCell>
								<TableBodyCell>
									<Button class="!p-2" color="gray" id={`bookingSelector-${item.ID}`}
										><DotsHorizontalOutline class="w-4 h-4" color="dark" /></Button
									>
									<Dropdown
										placement="left"
										triggeredBy={`#bookingSelector-${item.ID}`}
										style="z-index: 99"
									>
										{#if item.rosterPerformerId !== null}
											<DropdownItem on:click={() => fireSendMessageModal(item)}
												>Message Performer
											</DropdownItem>
											<DropdownItem on:click={() => sendReminder(item)}>Send reminder</DropdownItem>
											<DropdownItem on:click={() => fireInvitationHistoryModal(item)}
												>View invitation history
											</DropdownItem>
											<DropdownItem>Display on event</DropdownItem>
										{:else}
											<DropdownItem style="color:red" on:click={() => deleteEventPerformer(item)}
												>Delete spot</DropdownItem
											>
										{/if}
									</Dropdown>
								</TableBodyCell>
							</TableBodyRow>
						{/if}
					{/each}
				</TableBody>
			</Table>

			<Button
				outline={true}
				color="light"
				on:click={() => addBlankEventInvite()}
				style="font-size: 12px;"
			>
				<PlusSolid class="mr-2 w-2 h-2" /> New spot
			</Button>
		</AccordionItem>
	</Accordion>
	<hr style="padding-top: 16px;padding-bottom: 16px;" />

	{#if showPinned}
		<Accordion>
			<AccordionItem open>
				<span slot="header" style="display:flex;">
					<MapPinSolid color="orange" class="mr-2" />Pinned
				</span>
				<Table>
					<TableHead>
						<TableHeadCell />
						<TableHeadCell>Performer</TableHeadCell>
						<TableHeadCell>Status</TableHeadCell>
						<TableHeadCell>Position</TableHeadCell>
						<TableHeadCell>Set</TableHeadCell>
						<TableHeadCell>Notes</TableHeadCell>
						<TableHeadCell />
					</TableHead>

					<TableBody class="divide-y">
						{#each eventInvites as item (item.ID)}
							{#if item.acceptedState === 5}
								<TableBodyRow>
									<TableBodyCell style="display:flex;">
										<DotsVerticalOutline />
									</TableBodyCell>

									<TableBodyCell
										class="hover-bg-gray"
										on:click={() => {
											if (
												data.bookingSendBookingInvitations &&
												!(item.acceptedState == 2 && item.RosterPerformer)
											) {
												fireInviteFromPinnedModal(item, false);
											}
										}}
									>
										{#if item.RosterPerformer === null || item.RosterPerformer === undefined || item.RosterPerformer.User === null}
											<div>
												<div class="flex items-center">
													<img
														src={item.RosterPerformer &&
														item.RosterPerformer.User.performerProfile.avatarPosition1 !== ''
															? `https://moxy.sfo3.digitaloceanspaces.com${item.RosterPerformer.User.performerProfile.avatarPosition1}`
															: defaultAvatar}
														class="w-12 h-12 rounded"
													/>
													<Button outline={true} color="light" size="xs"
														><UserAddOutline
															style="color:blue;"
															class="w-3 h-3 me-2 text-blue-700"
														/><span style="color:#1a56db">Add</span></Button
													>
												</div>
											</div>
										{:else}
											<div
												class={item.acceptedState === 0
													? `invitePending flex items-center`
													: `flex items-center`}
											>
												<img
													src={item.RosterPerformer &&
													item.RosterPerformer.User.performerProfile.avatarPosition1 !== ''
														? `https://moxy.sfo3.digitaloceanspaces.com${item.RosterPerformer.User.performerProfile.avatarPosition1}`
														: defaultAvatar}
													class="w-12 h-12 rounded"
												/>
												<div
													class={`ml-2 font-bold text-lg`}
													style="font-weight:500;font-size:16px;"
												>
													{item.RosterPerformer.User.firstName}
													{item.RosterPerformer.User.lastName}
												</div>
											</div>
										{/if}
									</TableBodyCell>
									<TableBodyCell class="hover-bg-gray">
										<Badge
											size="medium"
											textColor="black"
											bgColor="yellow"
											style="min-width:110px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
											><MapPinSolid class="mr-2" style="height: 0.9rem;width: 0.9rem;" /> Pinned</Badge
										>
									</TableBodyCell>
									<TableBodyCell class="hover-bg-gray">
										<div id="roleSelector">
											{#each roles as role (role.value)}
												{#if item.roleOnStage === role.value && role.value !== 0 && role.value !== -1}
													<Badge
														size="medium"
														textColor={role.color === 'yellow' ? 'black' : 'white'}
														bgColor={role.color}
														style="min-width:100px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
														>{role.name}</Badge
													>
												{/if}
											{/each}
										</div>
									</TableBodyCell>
									<TableBodyCell class="hover-bg-gray">
										{#if item.setLength !== 0}
											{item.setLength}
										{/if}
									</TableBodyCell>
									<TableBodyCell>
										{item.performerNotes}
									</TableBodyCell>
									<TableBodyCell>
										<Button class="!p-2" color="gray" id={`bookingSelector-${item.ID}`}
											><DotsHorizontalOutline class="w-4 h-4" color="dark" /></Button
										>
										<Dropdown
											placement="left"
											triggeredBy={`#bookingSelector-${item.ID}`}
											style="z-index: 99"
										>
											<DropdownItem on:click={() => fireSendMessageModal(item)}
												>Message Performer
											</DropdownItem>
											<DropdownItem on:click={() => sendReminder(item)}>Send reminder</DropdownItem>
											<DropdownItem on:click={() => fireInvitationHistoryModal(item)}
												>View invitation history
											</DropdownItem>
											<DropdownItem>Display on event</DropdownItem>
										</Dropdown>
									</TableBodyCell>
								</TableBodyRow>
							{/if}
						{/each}
					</TableBody>
				</Table>
			</AccordionItem>
		</Accordion>
		<hr style="padding-top: 16px;padding-bottom: 16px;" />
	{/if}

	{#if showCancelled}
		<Accordion>
			<AccordionItem open>
				<span slot="header" style="display:flex;"
					><CloseCircleSolid color="red" class="mr-2" />Declined</span
				>
				<Table>
					<TableHead>
						<TableHeadCell>Performer</TableHeadCell>
						<TableHeadCell>Status</TableHeadCell>
						<TableHeadCell>Position</TableHeadCell>
						<TableHeadCell>Set</TableHeadCell>
						<TableHeadCell>Notes</TableHeadCell>
						<TableHeadCell />
					</TableHead>
					<TableBody class="divide-y">
						{#each eventInvites as item (item.ID)}
							{#if !item.shouldBeHidden && (item.acceptedState === 1 || item.acceptedState === 3 || item.acceptedState === 4)}
								<TableBodyRow>
									<TableBodyCell
										class="hover-bg-gray"
										on:click={() => {
											if (
												data.bookingSendBookingInvitations &&
												!(
													item.acceptedState == 2 &&
													item.acceptedState == 0 &&
													item.RosterPerformer
												)
											) {
												fireInviteFromPinnedModal(item, true);
											}
										}}
									>
										{#if item.RosterPerformer === null || item.RosterPerformer === undefined}
											<div>
												<div class="flex items-center">
													<img src={defaultAvatar} class="w-12 h-12 rounded mr-4" />
													<Button outline={true} size="xs"
														><UserAddOutline color="blue" class="w-3 h-3 me-2" />Add</Button
													>
												</div>
											</div>
										{:else}
											<div
												class={item.acceptedState === 1 ||
												item.acceptedState === 3 ||
												item.acceptedState === 4
													? `invitePending flex items-center`
													: `flex items-center`}
											>
												<img
													src={item.RosterPerformer &&
													item.RosterPerformer.User.performerProfile.avatarPosition1 !== ''
														? `https://moxy.sfo3.digitaloceanspaces.com${item.RosterPerformer.User.performerProfile.avatarPosition1}`
														: defaultAvatar}
													class="w-12 h-12 rounded"
												/>
												<div
													class={`invitePending ml-2 font-bold text-lg`}
													style="font-weight:500;font-size:16px;"
												>
													{item.RosterPerformer.User.firstName}
													{item.RosterPerformer.User.lastName}
												</div>
											</div>
										{/if}
									</TableBodyCell>
									<TableBodyCell class="hover-bg-gray">
										{#if item.acceptedState === 1}
											<Badge
												size="medium"
												textColor="white"
												bgColor="red"
												style="min-width:110px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
												><CloseCircleSolid
													class="mr-2"
													style="height: 0.9rem;width: 0.9rem;"
												/>Declined</Badge
											>
										{:else if item.acceptedState === 3}
											<Badge
												size="medium"
												textColor="white"
												bgColor="red"
												style="min-width:110px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
												><CloseCircleSolid
													class="mr-2"
													style="height: 0.9rem;width: 0.9rem;"
												/>Canceled</Badge
											>
										{:else if item.acceptedState === 4}
											<Badge
												size="medium"
												textColor="white"
												bgColor="red"
												style="min-width:110px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
												><CloseCircleSolid class="mr-2" style="height: 0.9rem;width: 0.9rem;" />No
												Show</Badge
											>
										{/if}
									</TableBodyCell>
									<TableBodyCell class="hover-bg-gray invitePending" style="opacity:50%">
										{#if item.roleOnStage === 5}
											<Badge
												size="medium"
												textColor="white"
												bgColor="gray"
												style="min-width:100px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
												>HOST</Badge
											>
										{:else if item.roleOnStage === 1}
											<Badge
												size="medium"
												textColor="black"
												bgColor="yellow"
												style="min-width:100px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
												>OPENER</Badge
											>
										{:else if item.roleOnStage === 2}
											<Badge
												size="medium"
												textColor="white"
												bgColor="indigo"
												style="min-width:100px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
												>FEATURE</Badge
											>
										{:else if item.roleOnStage === 3}
											<Badge
												size="medium"
												textColor="white"
												bgColor="red"
												style="min-width:100px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
												>HEADLINER</Badge
											>
										{:else if item.roleOnStage === 4}
											<Badge
												size="medium"
												textColor="white"
												bgColor="green"
												style="min-width:100px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
												>GUEST</Badge
											>
										{/if}
									</TableBodyCell>
									<TableBodyCell class="hover-bg-gray ">
										<span class="invitePending">{item.setLength}</span>
									</TableBodyCell>
									<TableBodyCell>
										<span class="invitePending">{item.performerNotes}</span>
									</TableBodyCell>
									<TableBodyCell>
										<Button class="!p-2" color="gray" id={`rejectedSelector-${item.ID}`}
											><DotsHorizontalOutline class="w-4 h-4" color="dark" /></Button
										>

										<Dropdown
											placement="left"
											triggeredBy={`#rejectedSelector-${item.ID}`}
											style="z-index: 99"
										>
											<DropdownItem on:click={() => fireSendMessageModal(item)}
												>Message Performer
											</DropdownItem>
											<DropdownItem on:click={() => fireInvitationHistoryModal(item)}
												>View invitation history
											</DropdownItem>
										</Dropdown>
									</TableBodyCell>
								</TableBodyRow>
							{/if}
						{/each}
					</TableBody>
				</Table>
			</AccordionItem>
		</Accordion>

		<hr style="padding-top: 16px;padding-bottom: 16px;" />
	{/if}

	<Accordion>
		<AccordionItem open>
			<span slot="header" style="display:flex;"><EyeSolid class="mr-2" />Roster</span>

			<Button
				id="b1"
				outline={true}
				on:click={() => {
					openFilterModal = true;
				}}><FilterOutline style="margin-right:4px;" /> Filter</Button
			>
			<div
				style="display:flex;flex-direction:row;margin-top:8px;margin-bottom:8px; align-items:center;"
			>
				<span style="margin-right: 4px;">Filters: </span>
				{#if selectedAvailability}
					<Button
						color="dark"
						on:click={() => (selectedAvailability = null)}
						style="margin-right: 4px;"
						><CloseCircleSolid style="margin-right:8px;" /> Available Only</Button
					>
				{/if}
				{#if Array.isArray(selectedTier)}
					{#each selectedTier as tier (tier)}
						{#each tiers as t (t.value)}
							{#if t.value == tier}
								<Button
									large
									color="dark"
									on:click={() => removeTierElement(tier)}
									style="margin-right: 4px;"
									><CloseCircleSolid style="margin-right:8px;" /> Tier: {t.name}</Button
								>
							{/if}
						{/each}
					{/each}
				{/if}

				{#if Array.isArray(selectedGender)}
					{#each selectedGender as gender (gender)}
						{#each genders as g (g.value)}
							{#if g.value == gender}
								<Button
									large
									color="dark"
									on:click={() => removeGenderElement(gender)}
									style="margin-right: 4px;"
									><CloseCircleSolid style="margin-right:8px;" /> {g.name}</Button
								>
							{/if}
						{/each}
					{/each}
				{/if}

				{#if Array.isArray(selectedEthnicity)}
					{#each selectedEthnicity as ethnicity (ethnicity)}
						{#each ethnicities as e (e.value)}
							{#if e.value == ethnicity}
								<Button
									large
									color="dark"
									on:click={() => removeEthnicityElement(ethnicity)}
									style="margin-right: 4px;"
									><CloseCircleSolid style="margin-right:8px;" /> {e.name}</Button
								>
							{/if}
						{/each}
					{/each}
				{/if}
			</div>
			<hr />

			<TableSearch
				placeholder="Search by performer name"
				hoverable={true}
				bind:inputValue={searchTerm}
			>
				<TableHead>
					<TableHeadCell on:click={() => sortTable('name')}>
						Performer
						{sortKey === 'name' ? (sortDirection === 1 ? '▲' : '▼') : ''}
					</TableHeadCell>
					<TableHeadCell on:click={() => sortTable('tier')}>
						Tier
						{sortKey === 'tier' ? (sortDirection === 1 ? '▲' : '▼') : ''}
					</TableHeadCell>
					<TableHeadCell on:click={() => sortTable('gender')}>
						Gender
						{sortKey === 'gender' ? (sortDirection === 1 ? '▲' : '▼') : ''}
					</TableHeadCell>
					<TableHeadCell on:click={() => sortTable('ethnicity')}>
						Ethnicity
						{sortKey === 'ethnicity' ? (sortDirection === 1 ? '▲' : '▼') : ''}
					</TableHeadCell>
					<TableHeadCell on:click={() => sortTable('lastBookedDate')}>
						Last Booked
						{sortKey === 'lastBookedDate' ? (sortDirection === 1 ? '▲' : '▼') : ''}
					</TableHeadCell>
					<TableHeadCell />
				</TableHead>
				<TableBody class="divide-y">
					{#each filteredItems as item}
						<TableBodyRow>
							<TableBodyCell
								on:click={() => {
									fireInviteFromRosterModal(item);
								}}
								><div class={`flex items-center`}>
									<img
										src={item.User && item.User.performerProfile.avatarPosition1 !== ''
											? `https://moxy.sfo3.digitaloceanspaces.com${item.User.performerProfile.avatarPosition1}`
											: defaultAvatar}
										class="w-12 h-12 rounded"
									/>

									<div class="ml-2 font-bold text-lg" style="font-weight:500;font-size:16px;">
										{item.User.firstName}
										{item.User.lastName}
									</div>
								</div>
							</TableBodyCell>
							<TableBodyCell>
								<Badge
									size="medium"
									textColor="white"
									bgColor={item.tier === 1
										? 'gray'
										: item.tier === 2
										? 'indigo'
										: item.tier === 3
										? 'green'
										: item.tier === 5
										? 'red'
										: 'default'}
								>
									{item.tier}
								</Badge>
							</TableBodyCell>
							<TableBodyCell>
								{#if item.gender >= 1 && item.gender <= 3}
									<Badge
										size="medium"
										textColor="white"
										bgColor={item.gender === 1 ? 'indigo' : item.gender === 2 ? 'red' : 'green'}
									>
										{item.gender === 1 ? 'Male' : item.gender === 2 ? 'Female' : 'Nonbinary'}
									</Badge>
								{/if}
							</TableBodyCell>
							<TableBodyCell>
								{parseEthnicity(item.User.performerProfile.ethnicity)}
							</TableBodyCell>
							<TableBodyCell>
								{@html item.lastBookedDate === '0001-01-01 00:00:00 +0000 UTC'
									? ''
									: new Date(item.lastBookedDate) > new Date()
									? `<strong>${new Date(item.lastBookedDate).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'short',
											day: 'numeric'
									  })}</strong>`
									: new Date(item.lastBookedDate).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'short',
											day: 'numeric'
									  })}
							</TableBodyCell>
							<TableBodyCell>
								<Button class="!p-2" color="gray" id={`rosterSelector-${item.ID}`}
									><DotsHorizontalOutline class="w-4 h-4" color="dark" /></Button
								>

								<Dropdown
									placement="left"
									triggeredBy={`#rosterSelector-${item.ID}`}
									style="z-index: 99"
								>
									<DropdownItem on:click={() => fireSendMessageModal(item)}
										>Message Performer
									</DropdownItem>

									<DropdownItem>View Profile</DropdownItem>
								</Dropdown>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</TableSearch>
		</AccordionItem>
	</Accordion>
</Card>
<Modal bind:open={openFilterModal} autoclose>
	<div style="display:flex;flex-direction:column">
		<Label for="#availableCheckbox" style="margin-bottom:16px;">
			<span style="font-weight:bold;margin-right:8px">Availability </span>

			<Checkbox id="availableCheckbox" bind:checked={selectedAvailability}>Available</Checkbox>
		</Label>

		<Label style="margin-bottom:16px;">
			<div style="display: flex; align-items: center;">
				<span style="font-weight:bold;margin-right:8px">Tier</span>
			</div>
			<MultiSelect class="mt-2" items={tiers} bind:value={selectedTier} />
		</Label>

		<Label style="margin-bottom:16px;">
			<div style="display: flex; align-items: center;">
				<span style="font-weight:bold;margin-right:8px">Gender</span>
			</div>
			<MultiSelect class="mt-2" items={genders} bind:value={selectedGender} />
		</Label>

		<Label style="margin-bottom:16px;">
			<div style="display: flex; align-items: center;">
				<span style="font-weight:bold;margin-right:8px">Ethnicity</span>
			</div>
			<MultiSelect class="mt-2" items={ethnicities} bind:value={selectedEthnicity} />
		</Label>
	</div>
</Modal>
<Modal bind:open={positionModal} size="xs">
	<div style="display:flex;flex-direction:column;align-items:center;">
		<div>
			{#if currentItem.RosterPerformer !== null}
				<div
					style="flex-direction:column;"
					class={currentItem.acceptedState === 0 ? ` flex items-center` : `flex items-center`}
				>
					<Avatar
						style="width:80px;height:80px;"
						src={currentItem.RosterPerformer &&
						currentItem.RosterPerformer.User.performerProfile.avatarPosition1 !== ''
							? `https://moxy.sfo3.digitaloceanspaces.com${currentItem.RosterPerformer.User.performerProfile.avatarPosition1}`
							: defaultAvatar}
						rounded
					/>

					<div style="color:#353b4b!important;font-weight:500;font-size:16px;">
						{currentItem.RosterPerformer.User.firstName}
						{currentItem.RosterPerformer.User.lastName}
					</div>
					<Label for="positionSelector" class="mb-2" style="color:#676c78">Edit Position</Label>
				</div>
			{/if}
		</div>

		<Listgroup active style="max-width:135px;">
			<ListgroupItem
				style="display: flex; justify-content: center; align-items: center;"
				on:click={() => {
					setPositionRole('5');
				}}
			>
				<Badge
					size="medium"
					textColor="white"
					bgColor="gray"
					style="padding-top:12px;padding-bottom:12px;height:18px;font-size: 12px;min-width:100px"
					>HOST</Badge
				>
			</ListgroupItem>
			<ListgroupItem
				style="display: flex; justify-content: center; align-items: center;"
				on:click={() => {
					setPositionRole('1');
				}}
			>
				<Badge
					size="medium"
					textColor="black"
					bgColor="yellow"
					style="padding-top:12px;padding-bottom:12px;height:18px;font-size: 12px;min-width:100px"
					>OPENER</Badge
				>
			</ListgroupItem>
			<ListgroupItem
				style="display: flex; justify-content: center; align-items: center;"
				on:click={() => {
					setPositionRole('2');
				}}
			>
				<Badge
					size="medium"
					textColor="white"
					bgColor="indigo"
					style="padding-top:12px;padding-bottom:12px;height:18px;font-size: 12px;min-width:100px"
					>FEATURE</Badge
				>
			</ListgroupItem>
			<ListgroupItem
				style="display: flex; justify-content: center; align-items: center;"
				on:click={() => {
					setPositionRole('3');
				}}
			>
				<Badge
					size="medium"
					textColor="white"
					bgColor="red"
					style="padding-top:12px;padding-bottom:12px;height:18px;font-size: 12px;min-width:100px"
					>HEADLINER</Badge
				>
			</ListgroupItem>
			<ListgroupItem
				style="display: flex; justify-content: center; align-items: center;"
				on:click={() => {
					setPositionRole('4');
				}}
			>
				<Badge
					size="medium"
					textColor="white"
					bgColor="green"
					style="padding-top:12px;padding-bottom:12px;height:18px;font-size: 12px;min-width:100px"
					>GUEST</Badge
				>
			</ListgroupItem>
		</Listgroup>
		<div style="display:flex;flex-direction:row;padding-top:32px;">
			<Button
				color="alternative"
				style="margin-right:16px;"
				danger
				on:click={() => (positionModal = false)}>Cancel</Button
			>

			<Button on:click={() => updatePosition(positionRole)}>Save</Button>
		</div>
	</div>
</Modal>

<Modal bind:open={setLengthModal} autoclose size="xs">
	<div style="display:flex;flex-direction:column;align-items:center;">
		{#if currentItem.RosterPerformer !== null}
			<div
				style="flex-direction:column;"
				class={currentItem.acceptedState === 0 ? ` flex items-center` : `flex items-center`}
			>
				<Avatar
					style="width:80px;height:80px;"
					src={currentItem.RosterPerformer &&
					currentItem.RosterPerformer.User.performerProfile.avatarPosition1 !== ''
						? `https://moxy.sfo3.digitaloceanspaces.com${currentItem.RosterPerformer.User.performerProfile.avatarPosition1}`
						: defaultAvatar}
					rounded
				/>

				<div style="color:#353b4b!important;font-weight:500;font-size:16px;">
					{currentItem.RosterPerformer.User.firstName}
					{currentItem.RosterPerformer.User.lastName}
				</div>
			</div>
		{/if}
		<div style="display:flex;flex-direction:column;align-items:ceter;">
			<Label class="mb-2" for="input-addon-sm">Set length</Label>
			<Input
				size="full"
				id="input-addon-sm"
				type="text"
				bind:value={setLengthSelector}
				placeholder={15}
				style="width: 92px; height: 92px; font-size: 32pt; color: black; text-align: center;  -webkit-appearance: none;
				margin: 0;  -moz-appearance: textfield;
				"
				on:input={(e) => {
					const value = e.target.value;
					if (!/^\d*$/.test(value)) {
						e.target.value = value.replace(/[^0-9]/g, '');
					}
				}}
				bind:this={inputElement}
				autofocus
			/>
		</div>
		<div style="display:flex;flex-direction:row;padding-top:32px;">
			<Button
				color="alternative"
				style="margin-right:16px;"
				danger
				on:click={() => (positionModal = false)}>Cancel</Button
			>

			<Button on:click={() => updateSetLength()}>Save</Button>
		</div>
	</div>
</Modal>

<Modal bind:open={inviteHistoryModal} autoclose size="xs">
	<div style="display:flex;flex-direction:column;align-items:center;">
		{#if currentItem.RosterPerformer !== null}
			<div
				style="flex-direction:column;"
				class={currentItem.acceptedState === 0 ? ` flex items-center` : `flex items-center`}
			>
				<Avatar
					style="width:80px;height:80px;"
					src={currentItem.RosterPerformer &&
					currentItem.RosterPerformer.User.performerProfile.avatarPosition1 !== ''
						? `https://moxy.sfo3.digitaloceanspaces.com${currentItem.RosterPerformer.User.performerProfile.avatarPosition1}`
						: defaultAvatar}
					rounded
				/>

				<div style="color:#353b4b!important;font-weight:500;font-size:16px;">
					{currentItem.RosterPerformer.User.firstName}
					{currentItem.RosterPerformer.User.lastName}
				</div>
				<Label for="positionSelector" class="mb-2" style="color:#676c78">Invitation History</Label>
			</div>
		{/if}
		<div style="display:flex;flex-direction:column;">
			<div
				style="flex-direction:column;"
				class={currentItem.acceptedState === 0 ? ` flex items-center` : `flex items-center`}
			/>
			{#each currentItem.invitationHistory as item, index}
				{#if 'newState' in item}
					{#if item.newState === 0}
						<span
							>{item.actionBy} Invited {new Date(item.CreatedAt).toLocaleString('en-US', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								hour12: true
							})}</span
						>
					{:else if item.newState === 1}
						<span style="color: red;"
							>{item.actionBy} Declined {new Date(item.CreatedAt).toLocaleString('en-US', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								hour12: true
							})}</span
						>
					{:else if item.newState === 2}
						<span style="color: green;"
							>{item.actionBy} Confirmed {new Date(item.CreatedAt).toLocaleString('en-US', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								hour12: true
							})}</span
						>
					{:else if item.newState === 3}
						<span style="color: red;"
							>{item.actionBy} No-Show {new Date(item.CreatedAt).toLocaleString('en-US', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								hour12: true
							})}</span
						>
					{:else if item.newState === 4}
						<span style="color: red;"
							>{item.actionBy} Canceled {new Date(item.CreatedAt).toLocaleString('en-US', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								hour12: true
							})}</span
						>
					{/if}
				{:else}
					<div style="padding-bottom:16px;">
						{#if item.communication == 'ResendEmail'}
							<span>
								Reminder sent: {new Date(item.CreatedAt).toLocaleString('en-US', {
									year: 'numeric',
									month: '2-digit',
									day: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
									hour12: true
								})}</span
							>
						{:else if item.communication != ''}
							<div
								class="rounded bg-gray-200 p-2 cursor-pointer"
								on:click={() => toggleMessage(index)}
							>
								{#if showFullMessage[index]}
									{item.communication}
								{:else}
									{item.communication.slice(0, 75)}
								{/if}
							</div>
						{/if}
					</div>
				{/if}
			{/each}
			<div style="display:flex;flex-direction:row;padding-top:32px;">
				<Button
					color="alternative"
					style="margin-right:16px;"
					on:click={() => (inviteHistoryModal = false)}>Close</Button
				>
			</div>
		</div>
	</div></Modal
>

<Modal title="Send Performer a Message" bind:open={sendMessageModal} autoclose>
	<div class="grid gap-6 mb-6 md:grid-cols-2">
		<div>
			<Label for="textarea-id" class="mb-2">Your message</Label>
			<Textarea
				id="textarea-id"
				placeholder="Your message"
				rows="4"
				bind:value={messageContents}
				name="message"
			/>
		</div>
	</div>
	<svelte:fragment slot="footer">
		<Button on:click={() => sendperformerNotes(currentItem.ID, messageContents)}>Update</Button>
		<Button on:click={() => (sendMessageModal = false)} danger>Cancel</Button>
	</svelte:fragment>
</Modal>
<Modal title="Send All Performers a Message" bind:open={sendAllPerformersMessageModal} autoclose>
	<div class="mb-6">
		<span style="margin-bottom:16px;"
			>To send a note to all <span style="color:green;font-weight:bold;">Confirmed</span> performers,
			please add it here.</span
		>

		<Checkbox bind:valkue={allPerformersIncludeInvited}
			>Include <span style="font-weight:bold;margin-left:4px;margin-right:6px;">Invited</span> performers</Checkbox
		>
		<div style="margin-bottom:16px;">
			<Label for="textarea-id" class="mb-2">Your message</Label>
			<Textarea
				id="textarea-id"
				placeholder="Your message"
				rows="4"
				bind:value={messageContents}
				name="message"
			/>
		</div>
	</div>
	<svelte:fragment slot="footer">
		<Button on:click={() => sendAllPerformersNotes(messageContents)}
			><PapperPlaneSolid /> Send</Button
		>
		<Button on:click={() => (sendAllPerformersMessageModal = false)} danger>Cancel</Button>
	</svelte:fragment>
</Modal>
<Modal title="Send All Attendees a Message" bind:open={sendAllAttendeesMessageModal} autoclose>
	<div class="mb-6">
		<span>To send a note to all attendees of this show, please add it here.</span>

		<div>
			<Label for="textarea-id" class="mb-2">Your message</Label>
			<Textarea
				id="textarea-id"
				placeholder="Your message"
				rows="4"
				bind:value={messageContents}
				name="message"
			/>
		</div>
	</div>
	<svelte:fragment slot="footer">
		<Button on:click={() => sendAllAttendeesNotes(messageContents)}
			><PapperPlaneSolid /> Send</Button
		>
		<Button on:click={() => (sendAllAttendeesMessageModal = false)} danger>Cancel</Button>
	</svelte:fragment>
</Modal>

<Modal
	title={'Invite Performer to Show'}
	bind:open={inviteFromRosterModal}
	dismissable={updateRosterPendingContactRowNumber === -1}
>
	<div
		style="flex-direction:column;"
		class={currentItem.acceptedState === 0 ? ` flex items-center` : `flex items-center`}
	>
		<Avatar
			style="width:80px;height:80px;"
			src={currentItem.User && currentItem.User.performerProfile.avatarPosition1 !== ''
				? `https://moxy.sfo3.digitaloceanspaces.com${currentItem.User.performerProfile.avatarPosition1}`
				: defaultAvatar}
			rounded
		/>

		<div style="color:#353b4b!important;font-weight:500;font-size:16px;">
			{currentItem.User.firstName}
			{currentItem.User.lastName}
		</div>
	</div>
	<Table>
		<TableHead>
			<TableHeadCell>Performer</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell>Position</TableHeadCell>
			<TableHeadCell>Set</TableHeadCell>
		</TableHead>

		<TableBody class="divide-y">
			{#each eventInvites as item, idx (item.ID)}
				{#if item.acceptedState !== 1 && item.acceptedState !== 5 && item.acceptedState !== 4 && item.acceptedState !== 3}
					<TableBodyRow>
						<TableBodyCell class="hover-bg-gray">
							{#if item.RosterPerformer === null || item.RosterPerformer === undefined}
								<div>
									<div class="flex items-center">
										<Button
											strokebtn
											size="xs"
											class="pr-4"
											on:click={() => {
												updateRosterPerformerConfirm(item);
											}}><CheckCircleOutline class="w-3 h-3 me-2" />Confirm without Invite</Button
										>
										<Button size="xs" on:click={() => updateRosterPerformer(item)}
											><PapperPlaneSolid class="w-3 h-3 me-2" />Invite</Button
										>
									</div>
								</div>
							{:else if idx == updateRosterPendingContactRowNumber}
								<div class="flex items-center">
									<Badge size="medium" textColor="white" bgColor="green" style="margin-right:8px;"
										><CheckCircleSolid /> Confirmed</Badge
									>
									<Button
										outline={true}
										size="xs"
										class="pr-4"
										style="margin-right:8px;"
										on:click={() => {
											inviteFromRosterModal = false;
											updateRosterPendingContactRowNumber = -1;
										}}>Do not notify</Button
									>
									<Button
										size="xs"
										style="margin-right:8px;"
										on:click={() => sendConfirmedEmail(item)}
										><PapperPlaneSolid class="w-3 h-3 me-2" />Notify</Button
									>
								</div>
							{:else}
								<div class="flex items-center">
									<img
										src={item.RosterPerformer &&
										item.RosterPerformer.User.performerProfile.avatarPosition1 !== ''
											? `https://moxy.sfo3.digitaloceanspaces.com${item.RosterPerformer.User.performerProfile.avatarPosition1}`
											: defaultAvatar}
										class="w-12 h-12 rounded"
									/>
									<div class="ml-2 text-lg {item.acceptedState == 2 ? 'font-bold' : ''}">
										{item.RosterPerformer.User.firstName}
										{item.RosterPerformer.User.lastName}
									</div>
								</div>
							{/if}
						</TableBodyCell>
						<TableBodyCell class="hover-bg-gray">
							{#if item.acceptedState === 0 && item.RosterPerformer !== null}
								<Badge
									size="medium"
									textColor="white"
									bgColor="dark"
									style="height:18px;font-size: 12px;"
									><PapperPlaneOutline class="mr-2" style="height: 0.9rem;width: 0.9rem;" /> Invited</Badge
								>
							{:else if item.acceptedState === 2}
								<Badge
									size="medium"
									textColor="white"
									bgColor="green"
									style="height:18px;font-size: 12px;"
									><CheckCircleSolid class="mr-2" style="height: 0.9rem;width: 0.9rem;" /> Confirmed</Badge
								>
							{:else if item.acceptedState === 1}
								<Badge
									size="medium"
									textColor="white"
									bgColor="red"
									style="height:18px;font-size: 12px;"
									><CloseCircleSolid class="mr-2" style="height: 0.9rem;width: 0.9rem;" /> Canceled</Badge
								>
							{:else if item.acceptedState === -1}
								<Badge
									size="medium"
									textColor="white"
									bgColor="red"
									style="height:18px;font-size: 12px;">Not yet saved</Badge
								>
							{/if}
						</TableBodyCell>
						<TableBodyCell class="hover-bg-gray">
							<div id="roleSelector">
								{#each roles as role (role.value)}
									{#if item.roleOnStage === role.value && role.value !== 0 && role.value !== -1}
										<Badge
											size="medium"
											textColor="white"
											bgColor={role.color}
											style="height:18px;font-size: 12px;">{role.name}</Badge
										>
									{/if}
								{/each}
							</div>
						</TableBodyCell>
						<TableBodyCell class="hover-bg-gray">
							{item.setLength}
						</TableBodyCell>
					</TableBodyRow>
				{/if}
			{/each}
		</TableBody>
	</Table>
	<svelte:fragment slot="footer">
		{#if updateRosterPendingContactRowNumber == -1}
			<Button danger on:click={() => (inviteFromRosterModal = false)}>Cancel</Button>
			<Button alert on:click={() => pinPerformerRoster(currentItem)}>Pin</Button>
		{/if}
	</svelte:fragment>
</Modal>
<Modal title="Invite to Show - Pinned" bind:open={inviteFromPinnedModal}>
	<Table>
		<TableHead>
			<TableHeadCell>Performer</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell>Position</TableHeadCell>
			<TableHeadCell>Set</TableHeadCell>
		</TableHead>

		<TableBody class="divide-y">
			{#each eventInvites as item (item.ID)}
				{#if item.acceptedState !== 1 && item.acceptedState !== 5 && item.acceptedState !== 4 && item.acceptedState !== 3}
					<TableBodyRow>
						<TableBodyCell class="hover-bg-gray">
							{#if item.RosterPerformer === null || item.RosterPerformer === undefined}
								<div>
									<div class="flex items-center">
										<Button
											outline={true}
											size="xs"
											class="pr-4"
											on:click={() => {
												updatePinnedPerformerConfirm(item, item.ID);
											}}><CheckCircleOutline class="w-3 h-3 me-2" />Confirm without Invite</Button
										>
										<Button size="xs" on:click={() => updatePinnedPerformer(item)}
											><PapperPlaneSolid class="w-3 h-3 me-2" />Invite</Button
										>
									</div>
								</div>
							{:else}
								<div class="flex items-center">
									<img
										src={item.RosterPerformer &&
										item.RosterPerformer.User.performerProfile.avatarPosition1 !== ''
											? `https://moxy.sfo3.digitaloceanspaces.com${item.RosterPerformer.User.performerProfile.avatarPosition1}`
											: defaultAvatar}
										class="w-12 h-12 rounded"
									/>
									<div class="ml-2 text-lg {item.acceptedState == 2 ? 'font-bold' : ''}">
										{item.RosterPerformer.User.firstName}
										{item.RosterPerformer.User.lastName}
									</div>
								</div>
							{/if}
						</TableBodyCell>
						<TableBodyCell class="hover-bg-gray">
							{#if item.acceptedState === 0 && item.RosterPerformer !== null}
								<Badge
									size="medium"
									textColor="white"
									bgColor="dark"
									style="height:18px;font-size: 12px;"
									><PapperPlaneOutline class="mr-2" style="height: 0.9rem;width: 0.9rem;" /> Invited</Badge
								>
							{:else if item.acceptedState === 2}
								<Badge
									size="medium"
									textColor="white"
									bgColor="green"
									style="height:18px;font-size: 12px;"
									><CheckCircleSolid class="mr-2" style="height: 0.9rem;width: 0.9rem;" /> Confirmed</Badge
								>
							{:else if item.acceptedState === 1}
								<Badge
									size="medium"
									textColor="white"
									bgColor="red"
									style="height:18px;font-size: 12px;"
									><CloseCircleSolid class="mr-2" style="height: 0.9rem;width: 0.9rem;" /> Canceled</Badge
								>
							{:else if item.acceptedState === -1}
								<Badge
									size="medium"
									textColor="white"
									bgColor="red"
									style="height:18px;font-size: 12px;">Not yet saved</Badge
								>
							{/if}
						</TableBodyCell>
						<TableBodyCell class="hover-bg-gray">
							<div id="roleSelector">
								{#each roles as role (role.value)}
									{#if item.roleOnStage === role.value && role.value !== 0 && role.value !== -1}
										<Badge
											size="medium"
											textColor="white"
											bgColor={role.color}
											style="height:18px;font-size: 12px;">{role.name}</Badge
										>
									{/if}
								{/each}
							</div>
						</TableBodyCell>
						<TableBodyCell class="hover-bg-gray">
							{item.setLength}
						</TableBodyCell>
					</TableBodyRow>
				{/if}
			{/each}
		</TableBody>
	</Table>
	<svelte:fragment slot="footer">
		<Button danger on:click={() => (inviteFromPinnedModal = false)}>Cancel</Button>
		<Button color="yellow" on:click={() => unpinPerformer(currentItem)}
			>{#if displayPin}Pin{:else}Unpin{/if}</Button
		>
	</svelte:fragment>
</Modal>
<Modal bind:open={statusModal} autoclose size="xs">
	<div style="display:flex;flex-direction:column;align-items:center;">
		<div
			style="flex-direction:column;"
			class={currentItem.acceptedState === 0 ? ` flex items-center` : `flex items-center`}
		>
			<Avatar
				style="width:80px;height:80px;"
				src={currentItem.RosterPerformer &&
				currentItem.RosterPerformer.User.performerProfile.avatarPosition1 !== ''
					? `https://moxy.sfo3.digitaloceanspaces.com${currentItem.RosterPerformer.User.performerProfile.avatarPosition1}`
					: defaultAvatar}
				rounded
			/>

			<div style="color:#353b4b!important;font-weight:500;font-size:16px;">
				{currentItem.RosterPerformer.User.firstName}
				{currentItem.RosterPerformer.User.lastName}
			</div>
			<Label for="positionSelector" class="mb-2" style="color:#676c78">Edit status</Label>
		</div>

		<div>
			<Label for="statusSelector" class="mb-2">Status</Label>
			<Select id="positionSelector" items={states} bind:value={statusSelector} />
		</div>
		<div style="font-size:12px;text-align:center;padding-top:16px;">
			{#if statusSelector === 3 || statusSelector === 1 || statusSelector === 4}
				<span style="color:red;"> This will remove the performer from the lineup. </span>
				<br />
			{/if}
			{#if statusSelector !== originalStatus}
				<span>Would you like to notify them of your action?</span>
			{/if}
		</div>
		<div style="display:flex;flex-direction:row;padding-top:32px;">
			<Button danger style="margin-right:16px;" on:click={() => (positionModal = false)}
				>Cancel</Button
			>

			{#if promptForRefresh}
				<p>Please refresh your page to save this value.</p>
				<Button on:click={() => updateStatus(false)} style="margin-right:16px;" disabled={true}
					>Save</Button
				>
				<Button on:click={() => updateStatus(true)} disabled={true}
					><PapperPlaneSolid style="width:12px;margin-right:4px;" /> Save & notify</Button
				>
			{:else}
				<Button
					on:click={() => updateStatus(false)}
					style="margin-right:16px;"
					disabled={statusSelector === originalStatus}>Save</Button
				>
				<Button on:click={() => updateStatus(true)} disabled={statusSelector === originalStatus}
					><PapperPlaneSolid style="width:12px;margin-right:4px;" /> Save & notify</Button
				>
			{/if}
		</div>
	</div>
</Modal>

<Modal
	title="Add Performer"
	bind:open={performerModal}
	autoclose
	dismissable={availablePerformers.length === 0 || selectedColor === null || selectedColor === ''}
>
	<Label>Select a performer...</Label>
	<AutoComplete
		items={availablePerformers}
		bind:selectedItem={selectedColor}
		labelFieldName="name"
		valueFieldName="id"
		maxItemsToShowInList={4}
	>
		<div
			slot="item"
			let:item
			let:label
			style="display:flex;flex-direction:row;"
			on:click={() => replacePerformer(item)}
			tabindex="0"
		>
			<img
				src={item && item.User.performerProfile.avatarPosition1 !== ''
					? `https://moxy.sfo3.digitaloceanspaces.com${item.User.performerProfile.avatarPosition1}`
					: defaultAvatar}
				class="w-12 h-12 rounded"
			/>
			<span style="font-weight:bold;margin-left:8px;margin-top:16px"
				>{item.User.firstName} {item.User.lastName}</span
			>
		</div>
	</AutoComplete>
	<hr style="margin-top:64px;margin-bottom:64px;" />

	<Table placeholder="Search by performer name" hoverable={true} bind:inputValue={searchTerm}>
		<TableHead>
			<TableHeadCell>Performer</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell>Position</TableHeadCell>
			<TableHeadCell>Set length</TableHeadCell>
		</TableHead>
		<TableBody>
			<TableBodyRow>
				<TableBodyCell>
					{#if currentItem.RosterPerformer === null || currentItem.RosterPerformer === undefined}
						<div>
							<div class="flex items-center">
								<img src={defaultAvatar} class="w-12 h-12 rounded" />
							</div>
						</div>
					{:else}
						<div class="flex items-center">
							<img
								src={currentItem.RosterPerformer &&
								currentItem.RosterPerformer.User.performerProfile.avatarPosition1 !== ''
									? `https://moxy.sfo3.digitaloceanspaces.com${currentItem.RosterPerformer.User.performerProfile.avatarPosition1}`
									: defaultAvatar}
								class="w-12 h-12 rounded"
							/>
							<div class="ml-2 font-bold text-lg">
								{currentItem.RosterPerformer.User.firstName}
								{currentItem.RosterPerformer.User.lastName}
							</div>
							<Button
								outline={true}
								class="!p-2"
								color="red"
								size="xs"
								style="margin-left:8px;"
								on:click={() => {
									clearPerformer(currentItem);
								}}
							>
								<TrashBinSolid class="w-3 h-3" />
							</Button>
						</div>
					{/if}
				</TableBodyCell>
				<TableBodyCell>
					{#if currentItem.acceptedState === 2}
						<Badge
							size="medium"
							textColor="white"
							bgColor="green"
							style="height:18px;font-size: 12px;"
							><CheckCircleSolid class="mr-2" style="height: 0.9rem;width: 0.9rem;" /> Confirmed</Badge
						>
					{:else if currentItem.acceptedState === 1}
						<Badge
							size="medium"
							textColor="white"
							bgColor="red"
							style="height:18px;font-size: 12px;"
							><CloseCircleSolid class="mr-2" style="height: 0.9rem;width: 0.9rem;" /> Canceled</Badge
						>
					{:else if currentItem.acceptedState === -1}
						<Badge
							size="medium"
							textColor="white"
							bgColor="red"
							style="height:18px;font-size: 12px;">Not yet saved</Badge
						>
					{/if}
				</TableBodyCell>
				<TableBodyCell>
					<div id="roleSelector">
						{#each roles as role (role.value)}
							{#if currentItem.roleOnStage === role.value && role.value !== 0 && role.value !== -1}
								<Badge
									color={role.color}
									style="min-width:100px;height:18px;font-size: 12px;padding-top:12px;padding-bottom:12px;"
									>{role.name}</Badge
								>
							{/if}
						{/each}
					</div>
				</TableBodyCell>
				<TableBodyCell>
					{currentItem.setLength}
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>
	<svelte:fragment slot="footer">
		{#if currentItem.RosterPerformer}
			<Button danger on:click={() => resetPerformer(currentItem)}>Cancel</Button>
			{#if currentItem.acceptedState !== 5}
				<Button
					alert
					on:click={() => {
						actuatePerformer();
						pinPerformer(currentItem);
					}}>Pin</Button
				>
			{:else}
				<Button
					color="alternative"
					on:click={() => {
						actuatePerformer();
						unpinPerformer(currentItem);
					}}>Unpin</Button
				>
			{/if}
			<Button
				outline={true}
				on:click={() => {
					actuatePerformer();
					updatePerformerConfirm(currentItem);
				}}>Confirm without invite</Button
			>
			<Button
				on:click={() => {
					actuatePerformer();
					updatePerformerInvite(currentItem);
				}}><PapperPlaneOutline class="mr-2" style="height: 0.9rem;width: 0.9rem;" /> Invite</Button
			>
		{/if}
	</svelte:fragment>
</Modal>

<style>
	:global(.hover-bg-gray:hover) {
		background-color: #d3d3d3 !important;
	}

	.invitePending {
		opacity: 30%;
	}

	/* Hide the up and down arrows on the number input */
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
