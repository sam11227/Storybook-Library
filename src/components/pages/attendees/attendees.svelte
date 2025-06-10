<script>
	import CurrencyDollar from 'carbon-icons-svelte/lib/CurrencyDollar.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { Dropdown, DropdownItem, Pagination, Search } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import DownArrowIcon from '../../../assets/icons/arrow-up-01.svg';
	import TicketOutline from '../../../assets/icons/ticket-outline.svg';
	import ExportIcon from '../../../assets/svg/file-export.svg';
	import Plus from '../../../assets/svg/plus.svg';
	import Button from '../../Button/Button.svelte';
	import RefundModal from '../../Orders/RefundModal.svelte';
	import Table from '../../OrdersTable/Table.svelte';
	import TableSkeleton from '../../OrdersTable/TableSkeleton.svelte';
	import { cn } from '../../Table/utils';

	import { ChevronLeftOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import ArrowrightArrowleft from '../../../assets/svg/arrow-right-arrow-left.svg';
	import EnvelopeOutline from '../../../assets/svg/envelope-outline.svg';
	import Breadcrumb from '../../Breadcrumb/Breadcrumb.svelte';
	import AttendeesDetails from '../../Orders/AttendeesDetails.svelte';
	import { AttendeeTableColumns } from './attendeesTableColumn';
	export let eventID = '';
	export let test = '';
	let loading = false;
	let Attendees = [];
	let pages = [];
	let tableData = [];
	onMount(async () => {
		pages = Attendees.map((i) => {
			return {
				name: i.id,
				href: ''
			};
		});
		await getData();
	});
	export function convertToDate(value) {
		return value ? new Date(value).toDateString() : null;
	}
	let result = '';
	$: tableResults = [];
	async function getData() {
		let orders = [];
		try {
			const response = await fetch(
				'http://localhost:8080/api/protected/GetUniqueOrderIDsByEventID/' + eventID,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer asdf`
					},
					credentials: 'include'
				}
			);

			if (response.ok) {
				orders = await response.json();

				tableData = orders.orders.flatMap((order) =>
					order.purchasedTickets
						.filter((ticket) => !ticket.refunded) // Filter out refunded tickets
						.map((ticket) => ({
							id: ticket.ID,
							orderId: '' + ticket.orderId,
							attendees: {
								name: `${order.firstName} ${order.lastName}`,
								email: order.email
							},
							status: ticket.checkedIn ? 'Checked In' : 'Not Checked In',
							saleType: order.saleType,
							notes: order.notes + ' ' + ticket.customerNotes,
							isChecked: ticket.checkedIn,
							ticketId: ticket.uuid.split('-')[0],
							ticketType: 'GA'
						}))
				);

				Attendees = tableData;

				loading = false;
			} else {
				result = 'failure';
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	function rowsSelect(event) {
		const { detail: selectedRows } = event;
	}

	let showRefundModal = false;

	const handleRefund = () => {};

	const handleCancel = () => {
		showRefundModal = false;
	};

	const onSelectDropDown = (value) => {
		if (value === 'issue_refund') {
			showRefundModal = true;
		}
	};

	let breadcrumbData = [
		{ name: 'Home', href: '/' },
		{
			name: 'The Friday Night Comedy Show',
			href: '/shows/friday-night-comedy'
		},
		{ name: 'Attendees', href: '/shows/friday-night-comedy/attendees' }
	];

	let dropdownItems = [
		{
			label: 'Message attendee',
			icon: EnvelopeOutline,
			alt: 'transfer',
			iconType: 'image',
			action: 'meessage_attendee'
		},
		{
			label: 'Switch ticket type',
			icon: TicketOutline,
			alt: 'Switch',
			iconType: 'image',
			action: 'switch_ticket_type'
		},
		{
			label: 'Transfer',
			icon: ArrowrightArrowleft,
			alt: 'Transfer',
			iconType: 'image',
			action: 'transfer'
		},
		{
			label: 'Issue refund',
			icon: CurrencyDollar,
			className: 'font-normal text-sm text-gray-700',
			alt: 'Issue refund',
			iconType: 'component',
			action: 'issue_refund'
		},
		{
			label: 'Delete attendee',
			icon: TrashCan,
			alt: 'Transfer order',
			iconType: 'component',
			action: 'Cancel_order',
			className: 'font-normal text-sm text-red-600'
		}
	];
</script>

<div class="attendees">
	<nav class="py-4">
		<Breadcrumb data={breadcrumbData} />
	</nav>
	<div
		class="border border-gray-200 bg-white shadow-sm rounded-lg m-4 align-center sm:m-6 my-4 pb-10 p-4"
	>
		<div class=" flex justify-between p-4 md:pb-6 tems-center flex-wrap">
			<h3 class=" text-xl font-normal text-gray-900 pb-4 md:pb-0">Attendees</h3>
			<div class="flex justify-start md:justify-end items-center gap-4 flex-wrap md:flex-nowrap">
				<div class="relative w-10/12 md:w-12/12">
					<Search class="h-10" />
				</div>
				<Button
					strokebtn
					size="xl"
					beforeIcon={ExportIcon}
					className="font-medium text-sm text-gray-900">Export</Button
				>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-3 pl-4">
			<div>
				<div class="grid grid-cols-12 gap-3 md:gap-8 mb-8">
					<div class="col-span-12 sm:col-span-6 md:col-span-6">
						<Button
							strokebtn
							size="xl"
							beforeIcon={Plus}
							className="font-medium text-sm text-gray-900">Add Attendees</Button
						>
					</div>
					<div class="col-span-12 sm:col-span-6 md:col-span-6">
						<div class="flex items-center justify-start md:justify-end">
							<div class="space-x-4 mr-4">
								<Button strokebtn afterIcon={DownArrowIcon} className="!p-1.5 !px-3 gap-6"
									>Actions</Button
								>
								<Dropdown class="w-[215px]">
									{#each dropdownItems as item}
										<DropdownItem
											on:click={() => onSelectDropDown(item.action)}
											class={cn(
												'flex items-center gap-2 no-underline hover:no-underline font-normal',
												item.className
											)}
										>
											{#if item.icon}
												{#if item.iconType === 'image'}
													<img src={item.icon} alt={item.alt} class="font-normal" />
												{:else if item.iconType === 'component'}
													<svelte:component this={item.icon} size={16} />
												{/if}
											{/if}
											{item.label}
										</DropdownItem>
									{/each}
								</Dropdown>
								<Button>Check in</Button>
							</div>
						</div>
					</div>
				</div>

				<div class="hidden md:block">
					{#if loading}
						<TableSkeleton columns={8} rows={4} />
					{:else}
						<div
							class="bg-BG-Secondary w-full rounded-[16px] mt-5 flex items-center justify-center"
						>
							{#if Attendees.length > 0}
								<Table
									columns={AttendeeTableColumns}
									showTableHead={true}
									on:rowsSelect={rowsSelect}
									data={Attendees}
									{onSelectDropDown}
									bordered={false}
									{dropdownItems}
									isRounded={false}
									searchable={false}
									isDraggable={false}
									styles={{
										container: 'w-full align-left overflow-hidden overflow-auto whitespace-nowrap',
										thead:
											'text-xs leading-[18px] text-gray-500 border-b font-semibold border-gray-200 uppercase bg-gray-50 px-4 py-4 cursor-normal',
										tr: ' text-sm text-gray-500 font-normal leading-[21px]',
										td: 'text-sm font-normal py-4 border-b border-gray-200'
									}}
									hasCheckBox={true}
									keyField="id"
									hasActions={true}
								/>
							{/if}
						</div>
					{/if}
				</div>

				<div class="block md:hidden">
					<AttendeesDetails attendees={Attendees} />
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
		</div>
	</div>
</div>

<RefundModal
	show={showRefundModal}
	on:close={() => (showRefundModal = false)}
	on:click={() => (showRefundModal = false)}
	title="Are you sure you want to issue a refund?"
	description="This will refund the cost of the purchase and make any ordered tickets available for resale."
	Items={[{ label: '1 x VIP Ticket', price: '$24.99' }]}
	PriceBreakdown={[
		{ label: 'Subtotal', value: '$24.99' },
		{ label: 'Tax (6%)', value: '$1.49' },
		{ label: 'Service Fee (2%)', value: '$0.49' }
	]}
	total="Total"
	totalValue="$26.97"
	Actions={[
		{
			label: 'Go back',
			strokebtn: true,
			onClick: handleCancel,
			class: 'w-full rounded-lg text-blue-500 border border-blue-500 text-sm font-medium'
		},
		{ label: 'Refund $26.97', danger: true, onClick: handleRefund }
	]}
/>
