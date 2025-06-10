<script>
	import { getDay, getDaysInMonth, startOfMonth } from 'date-fns';
	import { writable } from 'svelte/store';
	import Button from '../Button/Button.svelte';
	import Icon from '../Icons/Icon.svelte';

	export let currentevents = [];
	export let selectedDates;

	let currentDate = new Date();
	let currentYear = writable(currentDate.getUTCFullYear());
	let currentMonth = writable(currentDate.getUTCMonth());

	let events = {};

	// Process `currentevents` into a dictionary
	$: (async () => {
		events = {};
		currentevents.forEach((event) => {
			const eventDate = new Date(event.date);
			const dateKey = `${eventDate.getUTCFullYear()}-${String(eventDate.getUTCMonth() + 1).padStart(
				2,
				'0'
			)}-${String(eventDate.getUTCDate()).padStart(2, '0')}`;
			events[dateKey] = true;
		});
	})();

	// Check if a day is an event
	function isEvent(year, month, day) {
		const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		return events[dateKey];
	}

	// Toggle selection of an event day
	function toggleDateSelection(year, month, day) {
		const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		selectedDates.update((dates) => {
			if (dates.includes(dateKey)) {
				return dates.filter((date) => date !== dateKey); // Deselect if already selected
			} else {
				return [...dates, dateKey]; // Add to selection if not selected
			}
		});
	}

	// Check if a day is in the past
	function isPastDate(year, month, day) {
		const today = new Date();
		const date = new Date(year, month, day);
		return date < today.setHours(0, 0, 0, 0);
	}

	function handleNext() {
		currentMonth.update((month) => {
			if (month === 11) {
				currentYear.update((year) => year + 1);
				return 0;
			}
			return month + 1;
		});
	}

	function handlePrev() {
		currentMonth.update((month) => {
			if (month === 0) {
				currentYear.update((year) => year - 1);
				return 11;
			}
			return month - 1;
		});
	}

	// Add all available event dates to the selection
	function setAllAvailable() {
		const year = $currentYear;
		const month = $currentMonth;

		selectedDates.update((dates) => {
			const newDates = [...dates];
			for (let day = 1; day <= getDaysInMonth(new Date(year, month)); day++) {
				const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(
					2,
					'0'
				)}`;
				if (isEvent(year, month, day) && !newDates.includes(dateKey)) {
					newDates.push(dateKey);
				}
			}
			return newDates;
		});
	}

	// Remove all event dates from the selection
	function setAllUnavailable() {
		const year = $currentYear;
		const month = $currentMonth;

		selectedDates.update((dates) =>
			dates.filter((dateKey) => {
				const [y, m, d] = dateKey.split('-').map(Number);
				return !(y === year && m === month + 1 && isEvent(year, month, d));
			})
		);
	}
</script>

<div class="calendar-container">
	<header class="flex justify-between items-center mb-4">
		<button on:click={handlePrev}>
			<Icon name="ChevronLeft" />
		</button>
		<h2 class="text-center">
			{new Intl.DateTimeFormat('en', { month: 'long' }).format(
				new Date($currentYear, $currentMonth)
			)}
			{$currentYear}
		</h2>
		<button on:click={handleNext}>
			<Icon name="ChevronRight" />
		</button>
	</header>

	<div class="calendar-grid">
		{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as dayName}
			<div class="day-header">{dayName}</div>
		{/each}

		{#each Array(getDay(startOfMonth(new Date($currentYear, $currentMonth)))) as _}
			<div class="empty-day" />
		{/each}

		{#each Array(getDaysInMonth(new Date($currentYear, $currentMonth)))
			.fill()
			.map((_, i) => i + 1) as day}
			<button
				class={`day-cell 
          ${
						!isEvent($currentYear, $currentMonth, day) ||
						isPastDate($currentYear, $currentMonth, day)
							? 'disabled-day'
							: isEvent($currentYear, $currentMonth, day)
							? 'event-day'
							: ''
					} 
          ${
						$selectedDates.includes(
							`${$currentYear}-${String($currentMonth + 1).padStart(2, '0')}-${String(day).padStart(
								2,
								'0'
							)}`
						)
							? 'selected-day'
							: ''
					}`}
				on:click={() =>
					isEvent($currentYear, $currentMonth, day) &&
					toggleDateSelection($currentYear, $currentMonth, day)}
				aria-pressed={isEvent($currentYear, $currentMonth, day)}
				tabindex="0"
			>
				{day}
			</button>
		{/each}
	</div>

	<div class="my-5 flex flex-row items-center justify-center gap-4">
		<Button strokebtn type="button" size="xl" className="min-w-[150px]" on:click={setAllAvailable}>
			Set all available
		</Button>
		<Button
			strokebtn
			type="button"
			size="xl"
			className="min-w-[150px]"
			on:click={setAllUnavailable}
		>
			Set all unavailable
		</Button>
	</div>
</div>

<style>
	.calendar-container {
		@apply max-w-sm mx-auto text-center;
	}

	.calendar-grid {
		@apply grid grid-cols-7 border border-stroke-Primary rounded-lg;
		/* grid-template-columns: repeat(7, 1fr); */
	}

	.day-header {
		@apply text-Text-Tartiary text-base border-b border-stroke-Primary py-1;
	}

	.empty-day {
		background: none;
	}

	.day-cell {
		@apply m-1 p-2 aspect-square rounded-lg cursor-pointer;
	}

	.disabled-day {
		@apply text-Text-Tartiary/70 pointer-events-none;
	}

	.event-day {
		@apply text-black;
	}

	.selected-day {
		@apply bg-primary-700 text-white rounded-xl;
	}
</style>
