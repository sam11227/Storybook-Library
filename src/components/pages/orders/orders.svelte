<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Dropdown, DropdownItem, Pagination, Search } from 'flowbite-svelte';
	import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import DownArrowIcon from '../../../assets/icons/arrow-up-01.svg';
	import SendMessageIcon from '../../../assets/icons/message.svg';
	import PrintIcon from '../../../assets/icons/print.svg';
	import TransferIcon from '../../../assets/icons/transfer.svg';
	import ArrowrightArrowleft from '../../../assets/svg/arrow-right-arrow-left.svg';
	import CartIcon from '../../../assets/svg/cart-plus.svg';
	import EnvelopeOutline from '../../../assets/svg/envelope-outline.svg';
	import ExportIcon from '../../../assets/svg/file-export.svg';
	import FilterIcon from '../../../assets/svg/filter.svg';
	import xCircleOutline from '../../../assets/svg/x-circle-outline.svg';
	import Badge from '../../Badges/Badge.svelte';
	import Breadcrumb from '../../Breadcrumb/Breadcrumb.svelte';
	import Button from '../../Button/Button.svelte';
	import FilterDropdownCard from '../../Cards/FilterDropdownCard.svelte';
	import OrderDetails from '../../Orders/OrderDetails.svelte';
	import Table from '../../OrdersTable/Table.svelte';
	import TableSkeleton from '../../OrdersTable/TableSkeleton.svelte';
	import StatsCard from '../../Stats/StatsCard.svelte';
	import Typography from '../../Typography/Typography.svelte';
	import { OrderTableColumn } from './OrderTableColumn';

	export function convertToDate(value) {
		return value ? new Date(value).toDateString() : null;
	}
	export let eventID;
	export let venueID;
	$: eventName = '';

	let stats = [];
	let tableData = [];
	let loading = true;
	let pages = [];

	const salesTypes = ['Retail', 'Wholesale', 'Online', 'Direct'];
	const statuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];

	let selectedSalesTypes = [];
	let selectedStatuses = [];
	let resultsCount = 0;

	const handleSalesTypeChange = (types) => {
		selectedSalesTypes = types;
		updateResults();
	};

	const handleStatusChange = (stats) => {
		selectedStatuses = stats;
		updateResults();
	};

	const handleReset = () => {
		selectedSalesTypes = [];
		selectedStatuses = [];
		resultsCount = 0;
	};

	const updateResults = () => {
		resultsCount = selectedSalesTypes.length + selectedStatuses.length;
	};
	let result = null;
	let token = 'your_token_here'; // Replace with actual token
	let data = { eventID }; // Replace with actual event ID
	let event = {};
	// this version should be used for the attendees list
	let totalSoldTickets = 0;
	async function getOrdersData() {
		const response = await fetch('http://localhost:8080/api/public/getEvent/' + eventID, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			event = await response.json();

			eventName = event.title;
			breadcrumbData = [
				{ name: 'Home', href: '/operator' },
				{ name: 'Events', href: '/operator/events' },
				{
					name: eventName,
					href: '/operator/venues/' + venueID + '/' + eventID
				},
				{ name: 'Orders', href: '/operator/venues/' + venueID + '/' + eventID + '/orders' }
			];
		} else {
			result = 'failure';
		}
		let orders = [];
		try {
			const response = await fetch(
				'http://localhost:8080/api/protected/GetUniqueOrderIDsByEventID/' + eventID,
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
				orders = await response.json();
				orders.orders.forEach((order) => {
					order.purchasedTickets.forEach((purchasedTicket) => {
						if (purchasedTicket.refunded !== true) {
							totalSoldTickets += 1;
						}
					});
				});
				/*pages = orders.orders.map((order) => ({
					name: order.uuid,
					href: ''
				}));*/

				tableData = orders.orders.flatMap((order) => ({
					id: order.uuid,
					orderId: { orderID: order.ID, eventID: event.ID, venueID: venueID },
					purchasedBy: { name: `${order.firstName} ${order.lastName}`, email: order.email },
					email: order.email,
					dateOfPurchase: convertToDate(order.CreatedAt),
					quantity: order.purchasedTickets.filter((ticket) => ticket.refunded !== true).length,
					saleType: order.saleType,
					note: order.notes,
					total: '$' + (order.price / 100).toFixed(2),
					status: getOrderStatus(order)
				}));

				loading = false;
			} else {
				result = 'failure';
			}

			const totalAvailableTickets = event.availableTickets.reduce(
				(total, ticket) => total + ticket.quantity,
				0
			);

			stats = [
				{
					name: 'Total Orders',
					value: orders.orders.length,
					icon: 'icon-placeholder'
				},
				{
					name: 'Total Attendees',
					value: `${totalSoldTickets} of ${totalAvailableTickets}`,
					icon: 'icon-placeholder'
				},
				{
					name: 'Total Revenue',
					value:
						'$' +
						orders.orders.reduce(
							(total, order) =>
								total +
								order.purchasedTickets.reduce(
									(sum, ticket) => (ticket.refunded !== true ? sum + ticket.price : sum),
									0
								),
							0
						),
					icon: 'icon-placeholder'
				}
			];
		} catch (error) {
			console.error('Failed to load orders:', error);
		}
	}

	function getOrderStatus(order) {
		const hasRefundedTickets = order.purchasedTickets.some((ticket) => ticket.refunded === true);
		if (hasRefundedTickets) {
			return 'partially refunded';
		}
		return order.refundRequested
			? 'refundRequested'
			: order.paymentStatus === 'succeeded'
			? 'succeeded'
			: 'Not Checked In';
	}

	function rowsSelect(event) {
		const { detail: selectedRows } = event;
	}

	const onClickRow = async (row) => {
		let OrderId = row.orderId.replaceAll('#', '');
		await goto(`/orders/${OrderId}`);
	};
	let breadcrumbData = [];
	onMount(() => {
		getOrdersData();
	});

	$: activeUrl = $page.url.pathname;

	let dropdownItems = [
		{
			label: 'Resend confirmation',
			icon: EnvelopeOutline,
			iconType: 'image',
			alt: 'transfer',
			action: 'Resend_confirmation'
		},
		{
			label: 'Transfer',
			icon: ArrowrightArrowleft,
			alt: 'Transfer',
			iconType: 'image',
			action: 'Transfer_order'
		},
		{
			label: 'Cancel order',
			icon: xCircleOutline,
			alt: 'Transfer order',
			iconType: 'image',
			action: 'Cancel_order',
			className: 'text-red-600'
		}
	];
</script>

<div class="w-full mx-auto px-4 bg-BG-Secondary">
	<nav class="py-4">
		<Breadcrumb data={breadcrumbData} />
	</nav>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<StatsCard {stats} />
	</div>

	<div class="w-full py-6">
		<section class="bg-white custom-shadow rounded-[16px] p-6">
			<div class="flex items-center justify-between sm:flex-row flex-col">
				<div class="w-full">
					<Typography variant="h2" weight="medium" className="text-gray-900 ">Orders</Typography>
				</div>
				<div class="w-full flex justify-end gap-2 sm:mt-0 mt-2">
					<div class="relative w-full sm:w-1/2 md:w-3/5">
						<Search class="h-10" />
					</div>

					<div class="sm:block hidden">
						<Button
							className="sm:mb-2 lg:mb-0 font-medium text-sm text-gray-900"
							strokebtn
							beforeIcon={FilterIcon}>Filters</Button
						>
						<Dropdown class="w-[320px] space-y-3">
							<FilterDropdownCard
								{salesTypes}
								{statuses}
								{selectedSalesTypes}
								{selectedStatuses}
								onSalesTypeChange={handleSalesTypeChange}
								onStatusChange={handleStatusChange}
								onReset={handleReset}
								{resultsCount}
							/>
						</Dropdown>
						<Button strokebtn beforeIcon={ExportIcon} className="font-medium text-sm text-gray-900"
							>Export</Button
						>
					</div>
				</div>
			</div>
			<div class="w-full items-center justify-between gap-2 mt-3 sm:mt-10">
				<div class="flex flex-row sm:justify-between justify-end items-center">
					<div class="sm:flex hidden flex-row items-center gap-1">
						<p class="text-[14px] leading-6 font-normal text-[#1A1919] pb-1">Filter:</p>
						<div class="">
							<Badge
								className="text-[#4D4D4D] px-2 text-[14px] leading-6 font-normal border rounded-md border-[#DEDEDE]"
								dismissable={true}>Sale Type: Complimentary</Badge
							>
							<Badge
								className="text-[#4D4D4D] px-2 text-[14px] leading-6 font-normal border rounded-md border-[#DEDEDE]"
								dismissable={true}>Date: Last 4 weeks</Badge
							>
						</div>
					</div>
					<div>
						<Button
							strokebtn
							afterIcon={DownArrowIcon}
							className="!p-1.5 !px-3 gap-6 mb-3 sm:mb-2 lg:mb-0">Actions</Button
						>
						<Dropdown {activeUrl} class="w-[215px] space-y-3">
							<DropdownItem class="flex items-center gap-2 no-underline hover:no-underline"
								><img src={PrintIcon} alt="Print Tickets" />Print Tickets</DropdownItem
							>
							<DropdownItem class="flex items-center gap-2 no-underline hover:no-underline">
								<img src={SendMessageIcon} alt="Resend Confirmation" />Resend confirmation</DropdownItem
							>
							<DropdownItem
								on:click={async () => await goto(`/TransferOrder`)}
								class="flex items-center gap-2 no-underline hover:no-underline"
							>
								<img src={TransferIcon} alt="transfer" />
								Transfer order
							</DropdownItem>
						</Dropdown>
						<Button
							beforeIcon={CartIcon}
							on:click={() => goto(`/operator/venues/${venueID}/${eventID}/orders/newOrder`)}
							>Create new order</Button
						>
					</div>
				</div>
				<div class="hidden md:block">
					{#if loading}
						<TableSkeleton columns={8} rows={4} />
					{:else}
						<div
							class="bg-BG-Secondary w-full rounded-[16px] mt-5 flex items-center justify-center"
						>
							<Table
								columns={OrderTableColumn}
								showTableHead={true}
								on:rowsSelect={rowsSelect}
								data={tableData}
								bordered={false}
								isRounded={false}
								searchable={false}
								isDraggable={false}
								{dropdownItems}
								{onClickRow}
								styles={{
									container: 'w-full align-left overflow-hidden overflow-scroll whitespace-nowrap',
									thead:
										'text-[12px] leading-[18px] text-gray-500 border-b font-semibold border-gray-200 uppercase bg-gray-50 px-4 py-4 cursor-normal ',
									tr: 'text-[14px] text-gray-500 font-medium leading-[21px]',
									td: 'py-4 border-b border-gray-200',
									th: '!pr-0'
								}}
								hasCheckBox={true}
								keyField="id"
								hasActions={true}
							/>
						</div>
					{/if}
				</div>

				<div class="block md:hidden">
					<OrderDetails orders={tableData} />
				</div>

				<div class="sm:flex hidden flex-row items-center justify-between pt-4">
					<div>
						<p class="text-gray-500 text-[14px] leading-[21px] font-normal">
							Showing <span class="text-gray-900">1-10</span> of
							<span class="text-gray-900">48</span>
						</p>
					</div>
					<Pagination {pages} medium icon>
						<svelte:fragment slot="prev">
							<span class="sr-only">Previous</span>
							<ChevronLeftOutline class="w-6 h-6" />
						</svelte:fragment>
						<svelte:fragment slot="next">
							<span class="sr-only">Next</span>
							<ChevronRightOutline class="w-6 h-6" />
						</svelte:fragment>
					</Pagination>
				</div>
			</div>
		</section>
	</div>
</div>

<style>
	.custom-shadow {
		box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.1);
	}
</style>
