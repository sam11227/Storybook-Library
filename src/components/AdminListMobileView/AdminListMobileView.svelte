<script lang="ts">
	import { onMount } from 'svelte';

	let tableData = [];
	let loading = true;
	let result = '';
	$: finalData = [];
	function convertToDate(value) {
		const dateObj = new Date(value);
		const day = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
		const date = dateObj.getDate();
		const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
		return { day, date, month };
	}
	function formatTime(dateString) {
		const date = new Date(dateString);
		let hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		const minutesStr = minutes < 10 ? '0' + minutes : minutes;
		return `${hours}:${minutesStr}${ampm}`;
	}
	async function getData() {
		try {
			const response = await fetch(
				'http://localhost:8080/api/protected/getEventsForAllUserVenues',
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer asdf`
					},
					credentials: 'include'
				}
			);

			const data = await response.json();

			data.forEach((item) => {
				const eventTypeMap = [
					'Stand-up',
					'Sketch',
					'Improv',
					'Variety',
					'Class',
					'Podcast',
					'Concert',
					'Storytelling'
				];

				const eventTypeIndices = item.eventType.map((index) => eventTypeMap[index]);
				const type = {
					types: eventTypeIndices[0] || 'Unknown',
					subType: eventTypeIndices.slice(1)
				};
				const seatsCurrent = item.purchasedTickets.filter((ticket) => !ticket.refunded).length;
				const seatsSale = item.availableTickets.reduce(
					(total, ticket) => total + ticket.quantity,
					0
				);
				const imageUrl = `${item.image}`;
				const saleTotal = item.purchasedTickets.reduce((total, ticket) => total + ticket.price, 0);

				const performers = item.performers
					.filter((performer) => ![1, 4, 5].includes(performer.acceptedState))
					.map((performer) => ({
						name: performer.firstName + ' ' + performer.lastName,
						image: performer.RosterPerformer?.User?.performerProfile?.avatarPosition1
							? `https://moxy.sfo3.cdn.digitaloceanspaces.com${performer.RosterPerformer.User.performerProfile.avatarPosition1}`
							: '',
						contactNumber: ''
					}));

				tableData.push({
					id: item.ID,
					seats: { current: seatsCurrent, sale: seatsSale, cart: 0 },
					show: {
						name: item.title,
						showTime: formatTime(item.doorsOpenTime),
						image: imageUrl,
						stage: item.stage.name
					},
					email: '',
					status: 'On Sale',
					date: convertToDate(item.doorsOpenTime),
					stage: item.stage.name,
					type,
					sale: `$${saleTotal}`,
					performers: performers,
					actions: {
						eventID: item.ID,
						venueID: item.venueId
					}
				});
			});
			finalData = tableData;

			loading = false;
		} catch (error) {
			console.error('Failed to load notifications:', error);
		}
	}

	async function loadOrders() {
		try {
			await getData();
			loading = false;
		} catch (error) {
			console.error('Failed to load notifications:', error);
		}
	}

	function rowsSelect(event) {
		const { detail: selectedRows } = event;
	}

	onMount(() => {
		loadOrders();
	});
</script>

{#if loading}
	<p>Loading...</p>
{:else if tableData.length === 0}
	<p>No events available.</p>
{:else}
	{#each finalData as item, index}
		<div class="h-auto flex justify-between gap-3 py-[14px] border-y bg-[#FFF] border-[#E0E0E0]">
			<div class="flex flex-row gap-2">
				<div class="flex flex-col items-center">
					<div class="text-[10px] text-[#666C79] leading-[14px] font-normal">
						{item.date.day}
					</div>
					<div class="text-[#2563EB] text-[20px] font-[400] leading-[20px]">
						{item.date.date}
					</div>
					<div class="text-[10px] text-[#666C79] leading-[14px] font-normal">
						{item.date.month}
					</div>
				</div>

				<div class="flex flex-col gap-3">
					<span class="text-[14px] text-[#0D1526] leading-[14px] font-[400] max-w-32 truncate">
						{item.show?.name || 'Unnamed Event'}
					</span>

					<div class="flex gap-2">
						<div class="flex items-center -space-x-[8px]">
							{#each item.performers.slice(0, 3) as performer}
								<img
									src={performer.image || 'https://via.placeholder.com/18'}
									class="w-[18px] h-[18px] rounded-full border-2 border-white"
								/>
							{/each}
							{#if item.performers.length > 3}
								<div
									class="w-[18px] h-[18px] flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold border-2 border-white text-[8px]"
								>
									+{item.performers.length - 3}
								</div>
							{/if}
						</div>

						<div class="flex p-2 items-center">
							{#if item.status === 'On Sale'}
								<span
									class="inline-flex items-center gap-1 text-[12px] leading-[12px] font-semibold text-accent-success rounded-full"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="8"
										height="8"
										viewBox="0 0 8 8"
										fill="none"
									>
										<circle cx="4.29883" cy="4" r="3.5" fill="#15A033" />
									</svg>
									{item.status}
								</span>
							{:else if item.status === 'Draft'}
								<span
									class="inline-flex items-center gap-1 text-[12px] leading-[12px] font-semibold text-Hue-Violet rounded-full"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="8"
										height="8"
										viewBox="0 0 8 8"
										fill="none"
									>
										<circle cx="4.29883" cy="4" r="3.5" fill="#6C2BD9" />
									</svg>
									{item.status}
								</span>
							{:else if item.status === 'Scheduled'}
								<span
									class="inline-flex items-center gap-1 text-[12px] leading-[12px] font-semibold text-accent-Warning rounded-full"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="8"
										height="8"
										viewBox="0 0 8 8"
										fill="none"
									>
										<circle cx="4.29883" cy="4" r="3.5" fill="#FF922E" />
									</svg>
									{item.status}
								</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
			<div class="w-[90px] flex flex-col items-end justify-end gap-2">
				<span class="text-[#666C79] flex justify-end text-xs font-normal">
					Sold: {item.seats.current}/{item.seats.sale}
				</span>
				<span class="text-green-500 text-[16px] pl-2 leading-[24px] font-[400]">
					{item.sale}
				</span>
			</div>
		</div>
	{/each}
{/if}
