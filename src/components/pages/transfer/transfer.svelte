<script>
	import { page } from '$app/stores';
	import { Search } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import AlertIcon from '../../../assets/icons/Alert icon.svg';
	import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb.svelte';
	import FullOrder from '../../../components/Cards/FullOrder.svelte';
	import TransferCard from '../../../components/Cards/TransferCard.svelte';
	import TransferSummary from '../../../components/Cards/TransferSummary.svelte';
	import OrderPopup from '../../../components/Orders/OrderPopup.svelte';
	import TicketAccordion from '../../../components/Orders/TicketAccordion.svelte';
	import Table from '../../../components/OrdersTable/Table.svelte';
	import TableSkeleton from '../../../components/OrdersTable/TableSkeleton.svelte';
	import TicketCardMobile from './TicketCardMobile.svelte';
	import { EventTableColumns } from './transferOrderTableColumn';

	let search = '';
	let loading = true;
	let events = [];
	let isSelectTicket = false;
	let isSoldOut = false;
	$: orderId = $page.params.id;

	async function getTransferAll() {
		try {
			const fetchedEvents = await fetch('./../../api/transfer').then((res) => {
				loading = false;
				return res.json();
			});
			events = [...fetchedEvents];
		} catch (error) {
			loading = false;
			console.error('Failed to load events:', error);
		}
	}

	async function rowsSelect(event) {
		const { detail: selectedRows } = event;
		const capacity = (await selectedRows.length) ? selectedRows[0].capacity.current : 0;
		if (capacity === 100) {
			isSoldOut = true;
		}
	}

	$: transferData = [
		{
			label: 'Transfer from',
			title: 'The Friday Night Comedy Show',
			date: 'Friday, November 19, 2023, 8:30pm'
		},
		isSelectTicket
			? {
					label: 'Transfer to',
					title: 'The Friday Night Comedy Show',
					date: 'Friday, August 16, 2024, 8:30pm'
			  }
			: {}
	];

	const onClickRow = async (row) => {};

	$: transferSummaryData = {
		originalTickets: [
			{ type: 'General Admission', quantity: 2, price: 14.99 },
			{ type: 'VIP Tickets', quantity: 2, price: 24.99 }
		],
		newTickets: isSelectTicket
			? [
					{ type: 'General Admission', quantity: 3, price: 12.99 },
					{ type: 'VIP Tickets', quantity: 1, price: 24.99 }
			  ]
			: [],
		subtotal: 16.0,
		tax: 0.96,
		serviceFee: 0.32,
		total: 17.38
	};

	$: filteredEvents = events?.filter((event) =>
		event?.show?.name?.toLowerCase().includes(search.toLowerCase())
	);

	onMount(async () => {
		await getTransferAll();
	});

	$: breadcrumbData = [
		{ name: 'Home', href: '/' },
		{
			name: 'The Friday Night Comedy Show',
			href: '/shows/friday-night-comedy'
		},
		{
			name: `Orders`,
			href: `/shows/friday-night-comedy/orders`
		},
		{
			name: `#${orderId}`,
			href: `/shows/friday-night-comedy/orders/${orderId}`
		},
		{
			name: `Transfer order`,
			href: `/shows/friday-night-comedy/orders/${orderId}/transferOrder`
		}
	];

	let ticketsData = [
		[
			{
				type: 'General Admission',
				newPrice: 14.99,
				difference: 0,
				complimentary: false,
				progress: 'capacity',
				capacityPercentage: 30
			},
			{
				type: 'VIP',
				newPrice: 49.99,
				difference: 35,
				complimentary: false,
				capacityPercentage: 60
			},
			{
				type: 'Mezzanine',
				newPrice: 34.99,
				difference: 20.0,
				capacityPercentage: 84,
				complimentary: false
			}
		],
		[
			{
				type: 'Early Bird',
				newPrice: 9.99,
				difference: -5,
				capacityPercentage: 50,
				complimentary: true
			},
			{
				type: 'Regular',
				newPrice: 19.99,
				difference: 10,
				capacityPercentage: 25,
				complimentary: false
			},
			{
				type: 'Mezzanine',
				newPrice: 34.99,
				difference: 20.0,
				capacityPercentage: 70,
				complimentary: false
			}
		],
		[
			{
				type: 'Student',
				newPrice: 12.99,
				difference: -2,
				complimentary: true,
				capacityPercentage: 90
			},
			{
				type: 'Premium',
				newPrice: 59.99,
				difference: 45,
				complimentary: false,
				capacityPercentage: 40
			},
			{
				type: 'Mezzanine',
				newPrice: 34.99,
				difference: 20.0,
				capacityPercentage: 65,
				complimentary: false
			}
		]
	];

	$: console.log(isSoldOut, 'isSoldOut');
</script>

<div class="w-full mx-auto px-4">
	<nav class="py-4">
		<Breadcrumb data={breadcrumbData} />
	</nav>
	<h4 class="font-bold text-3xl text-gray-900 py-4 pt-2">Transfer order</h4>
	<div class="grid grid-cols-12 gap-5">
		<div class="col-span-12 md:col-span-8">
			<TransferCard {transferData} />
			<div
				class=" bg-white shadow-sm rounded-2xl p-4 align-center sm:p-6 border border-gray-200 my-4"
			>
				{#if !isSelectTicket}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-5 py-3">
						<h3 class="font-normal text-xl text-Text-Primary">
							Select the event you want to transfer to
						</h3>
						<Search class="h-10" />
					</div>
				{/if}
				<div class="block md:hidden">
					{#if isSelectTicket}
						<div>
							{#each ticketsData as tickets, index}
								<TicketCardMobile {tickets} />
							{/each}
						</div>
					{:else}
						{#each filteredEvents as filterEvent}
							<FullOrder
								onSelectCheckBox={() => (isSelectTicket = true)}
								image={filterEvent.show.image}
								title={filterEvent.show.name}
								date={filterEvent.date.date}
								day={filterEvent.show.day}
								startTime={filterEvent.time}
								club={filterEvent.club}
								capacity={`${filterEvent.capacity.current}/ ${filterEvent.capacity.total}`}
								capacityPercentage={(filterEvent.capacity.current / filterEvent.capacity.total) *
									100}
							/>
						{/each}
					{/if}
				</div>
				<div class="hidden md:block mt-6">
					{#if isSelectTicket}
						<div>
							{#each ticketsData as tickets, index}
								<TicketAccordion {tickets} />
							{/each}
						</div>
					{:else if loading}
						<TableSkeleton columns={8} rows={4} />
					{:else if filteredEvents?.length === 0}
						<div class="text-center text-gray-500 py-4">No events found.</div>
					{:else}
						<Table
							columns={EventTableColumns}
							showTableHead={true}
							on:rowsSelect={rowsSelect}
							data={filteredEvents}
							bordered={false}
							isRounded={false}
							isDraggable={false}
							searchable={false}
							{onClickRow}
							styles={{
								container:
									'w-full align-left whitespace-nowrap overflow-y-hidden overflow-x-scroll',
								thead:
									'text-xs font-semibold leading-[18px] text-gray-500 border-b border-gray-200 uppercase bg-gray-50 px-4 py-4 cursor-normal',
								tr: 'text-sm text-gray-400 font-normal leading-[21px] ',
								td: 'text-sm border-b border-gray-200 !pr-0 ',
								th: 'pr-0'
							}}
							hasRadioButton={true}
							keyField="id"
						/>
					{/if}
				</div>
			</div>
		</div>
		<div class="col-span-12 md:col-span-4">
			<TransferSummary
				transferSummary={transferSummaryData}
				onClickButton={() => {
					isSelectTicket = !isSelectTicket;
				}}
				buttonText={isSelectTicket ? 'Transfer tickets' : 'Continue'}
			/>
		</div>
	</div>
</div>

<OrderPopup
	bind:isOpen={isSoldOut}
	icon={AlertIcon}
	title="Sold out"
	message="This show is sold out.Would you like to increase ticket capacity to make room for this transfer?"
	cancelText="Cancel"
	confirmText="Increase"
	onCancel={() => {
		isSoldOut = false;
	}}
	onConfirm={() => {
		isSoldOut = false;
	}}
/>

<!-- <OrderPopup
  bind:isOpen={isSoldOut}
  icon={Alert}
  title="Order successful"
  confirmText="Back to Orders"
  onConfirm={() => {
    isSoldOut = false;
  }}
/> -->

<!-- <OrderPopup
  bind:isOpen={isSoldOut}
  icon={AlertIcon}
  title="Order failed"
  message="This order did not complete successfully.
Please try again."
  confirmText="Ok"
  onConfirm={() => {
    isSoldOut = false;
  }}
/> -->
