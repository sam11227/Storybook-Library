<script>
	import MapIcon from '../../assets/svg/calendar-day-outline.svg';
	import Calendar from '../../assets/svg/map-pin-outline.svg';
	export let image = '';
	export let title = 'Event Title';
	export let manageText = 'Manage Event';
	export let date = '';
	export let time = '';
	export let location = '';
	export let eventID = '';
	export let venueID = '';
	export let onManageClick = () => {};
</script>

<div class="flex lg:block">
	<img class="rounded-lg object-cover h-22 w-22 lg:h-48 lg:w-76" src={image} alt={title} />

	<div class="lg:pt-4 pl-4 lg:pl-0">
		<h5 class="mb-0.5 text-lg font-bold text-gray-900">{title}</h5>
		<button
			on:click={() => (window.location.href = '/operator/venues/' + venueID + '/' + eventID)}
			class="text-blue-600 hover:underline text-sm font-medium hidden sm:inline"
		>
			{manageText}
		</button>
		<div class="flex items-center gap-3 mt-3 text-sm text-gray-700 font-medium">
			<img src={MapIcon} alt="map icon" />
			<span>{date}, {time}</span>
		</div>

		<div class="md:flex items-center gap-3 mt-2 text-sm text-gray-700 hidden">
			<img src={Calendar} alt="calender" />
			<span>{location}</span>
		</div>
	</div>
</div>
