<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import QuarterView from '../../Calendar/QuarterView.svelte';
	// Current date and quarter
	const currentYear = new Date().getFullYear();
	const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);
	// State for selected dates and messages
	const selectedDates = writable([]);
	const message = writable('');
	let currentEvents = [];
	let result = '';
	async function saveSelectedDates() {
		if (params.venueId !== 0) {
			const dates = $selectedDates.map((dateObj) => dateObj);
			const response = await fetch(
				'http://localhost:8080/api/performer/performerAvailabilities/' + params.venueId,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer asdf`
					},
					credentials: 'include',
					body: JSON.stringify(dates)
				}
			);

			if (response.ok) {
			} else {
				result = 'failure';
			}
		}
	}
	// Reactive statement to save selected dates and display messages
	$: if ($selectedDates.length > 0) {
		message.set('saving');

		setTimeout(async () => {
			const token = 'your_token_here'; // Replace with actual token
			const venueId = params.venueId;
			await saveSelectedDates();
			message.set('saved');
			setTimeout(() => {
				message.set('');
			}, 2000);
		}, 2000);
	}
	$: value = [];
	export let userID = '';
	function generateCurrentEvents() {
		const today = new Date();
		for (let i = 0; i <= 360; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() + i);
			currentEvents.push({ date: normalizeDate(date) });
		}
	}
	function normalizeDate(date) {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
	async function getAvailabilityData() {
		const responseAvailability = await fetch(
			'http://localhost:8080/api/protected/performerAvailabilitiesByUserID/' + userID,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer asdf`
				},
				credentials: 'include'
			}
		);

		if (responseAvailability.ok) {
			const result = await responseAvailability.json();

			let tableData = [];

			// Flatten the arrays of dates into one array
			Object.keys(result).forEach((venueID) => {
				tableData = tableData.concat(result[venueID]);
			});

			// Deduplicate the dates
			tableData = [...new Set(tableData)];

			value = tableData;
		} else {
			//result = 'failure';
		}
	}
	onMount(() => {
		generateCurrentEvents();
		getAvailabilityData();
	});
</script>

<section>
	<h1>Availability</h1>
	<div class="mt-6">
		<QuarterView
			year={currentYear}
			quarter={currentQuarter}
			currentevents={value}
			{selectedDates}
		/>
	</div>
</section>
