<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import CurrencyDollar from 'carbon-icons-svelte/lib/CurrencyDollar.svelte';
	import {
		Alert,
		Checkbox,
		Dropdown,
		DropdownItem,
		Button as FlowbiteButton,
		Search,
		Skeleton,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import {
		ArrowsRepeatOutline,
		DollarOutline,
		DotsHorizontalOutline,
		TicketOutline,
		TrashBinSolid
	} from 'flowbite-svelte-icons';
	import { createEventDispatcher, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import DownArrowIcon from '../../../../../../../assets/icons/arrow-up-01.svg';
	import SendMessageIcon from '../../../../../../../assets/icons/message.svg';
	import Print from '../../../../../../../assets/icons/print.svg';
	import TransferIcon from '../../../../../../../assets/icons/transfer.svg';
	import userProfileImg from '../../../../../../../assets/images/image.png';
	import ArrowrightArrowleft from '../../../../../../../assets/svg/arrow-right-arrow-left.svg';
	import Cancel from '../../../../../../../assets/svg/cancel.svg';
	import Checkmark from '../../../../../../../assets/svg/checkmark.svg';
	import Badge from '../../../../../../../components/Badges/Badge.svelte';
	import Breadcrumb from '../../../../../../../components/Breadcrumb/Breadcrumb.svelte';
	import Button from '../../../../../../../components/Button/Button.svelte';
	import LeftCard from '../../../../../../../components/Cards/LeftCard.svelte';
	import RightCard from '../../../../../../../components/Cards/RightCard.svelte';
	import Icon from '../../../../../../../components/Icons/Icon.svelte';
	import Input from '../../../../../../../components/Input/Input.svelte';
	import ModalProgress from '../../../../../../../components/Modal/ModalProgress.svelte';
	import DeleteAttendeeModel from '../../../../../../../components/Orders/DeleteAttendeeModel.svelte';
	import RefundModal from '../../../../../../../components/Orders/RefundModal.svelte';
	import TicketCard from '../../../../../../../components/Orders/TicketCard.svelte';
	import TableSkeleton from '../../../../../../../components/OrdersTable/TableSkeleton.svelte';

	import { cn } from '../../../../../../../lib/tableUtils';
	export let venueID = '';
	export const load = ({ params }) => {
		return {
			props: {
				venueID: params.venueID
			}
		};
	};
	const dispatch = createEventDispatcher();

	export const AttendeeTableColumns = [
		{
			key: 'attendeeName',
			title: 'ATTENDEE NAME',
			sortable: true,
			customRender: (value) => {
				return `<div class="text-gray-500 text-sm font-normal">${value}</div>`;
			}
		},
		{
			key: 'ticketType',
			title: 'TICKET TYPE',
			sortable: true,
			customRender: (value) => {
				return `<div class=text-gray-500 text-sm font-normal">${value}</div>`;
			}
		},
		{
			key: 'price',
			title: 'PRICE',
			sortable: true,
			customRender: (value) => {
				return `<div class= "text-gray-500 text-sm font-normal">$${value}</div>`;
			}
		},
		{
			key: 'status',
			title: 'STATUS',
			sortable: true,
			isComponent: true,
			customRender: (value) => {
				if (value.isChecked && value.status) {
					return {
						component: Badge,
						props: {
							icon: Checkmark,
							status:
								value === 'Refunded' ? 'warning' : value === 'Cancelled' ? 'danger' : 'success',
							className: 'rounded-full px-2 text-gray-500 text-sm font-semibold',
							children: value.status
						}
					};
				} else {
					return {
						component: FlowbiteButton,
						props: {
							variant: 'outline',
							children: value.status,
							onClick: (evt) => handleButtonClick(value.ID, !value.isCheckedIn)
						}
					};
				}
			}
		}
	];

	async function handleDropdownClick() {
		await resendOrderConfirmation(order.uuid);
		toast.success('Confirmation resent successfully!', {
			position: 'top-right'
		});
	}

	$: orderId = $page.params.id;

	let loading = true;
	let order = {};
	let showDeleteModal = false;
	let selectedAttendee = null;

	const STATUS_BADGES = {
		Refunded: 'warning',
		Cancelled: 'danger',
		'Partially Refunded': 'warning',
		default: 'success'
	};
	let error = '';
	let showPartialRefundModal = false;
	let sectionsResult = null;
	let sectionItems = [];
	async function getSectionData() {
		const sectionsResponse = await fetch(
			'http://localhost:8080/api/protected/ticketSectionsByEvent/' + eventID,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer asdf'
				},
				credentials: 'include'
			}
		);

		if (sectionsResponse.ok) {
			sectionsResult = await sectionsResponse.json();
			let tableData = [];
			sectionsResult.forEach((result) => {
				tableData.push({
					value: result.ID,
					name: result.name,
					capacity: result.capacity,
					eventID: result.eventID
				});
			});

			sectionItems = tableData;
		} else {
			error = 'failure';
		}
	}
	let eventData = {};
	let orderData = {};
	let ticketsWithQRData = [];

	async function handleButtonClick(itemId, setting) {
		// Find the ticket with the matching itemId

		const ticket = ticketsWithQRData.find((ticket) => ticket.ID === itemId);
		if (!ticket) {
			console.error(`No ticket found with ID ${itemId}`);
			return;
		}

		// Determine the API endpoint based on the setting
		const endpoint = setting ? '/api/protected/checkInUUID/' : '/api/protected/resetCheckInUUID/';
		const url = `http://localhost:8080${endpoint}${ticket.uuid}`;

		// Make the GET request
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			},
			credentials: 'include'
		});

		if (response.ok) {
			// Handle successful response here
		} else {
			// Handle error response here
			console.error(`Failed to check in/reset ticket ${itemId}`);
		}
		await GetOrdersByID();
	}
	$: refundItems = [];
	$: surcharge = 0;
	$: taxRate = 0;
	async function GetOrdersByID() {
		try {
			const response = await fetch(`http://localhost:8080/api/protected/getOrder/${orderId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer asdf`
				},
				credentials: 'include'
			});

			if (response.ok) {
				let orderResponse = await response.json();
				order = orderResponse.order;
				eventData = orderResponse.event;
				surcharge = orderResponse.order.surcharge;
				ticketsWithQRData = orderResponse.ticketsWithQR;
				tableData = ticketsWithQRData.map((ticket) => ({
					ID: ticket.ID,
					attendeeName: ticket.customerName,
					ticketType: ticket.AvailableTicket?.TicketSection?.name || 'GA',
					price: ticket.price,
					isChecked: ticket.checkedIn,

					uuid: ticket.uuid,
					refunded: ticket.refunded,
					checkedIn: ticket.checkedIn,
					status: ticket.refunded ? 'refunded' : ticket.checkedIn ? 'Checked in' : 'Check in'
				}));
				// Calculate order summary
				items = groupTickets(ticketsWithQRData);
				refundItems = groupRefundedTickets(ticketsWithQRData);

				subtotal = items.reduce(
					(acc, item) => (item.refunded === false ? acc + item.price : acc),
					0
				);

				taxRate = order.tax;

				tax = subtotal * taxRate; // Assuming a 10% tax rate

				serviceFee = orderResponse.order.surcharge; // Assuming a fixed service fee
				total = subtotal + tax / 100 + serviceFee / 100;
				loading = false;

				let eventVenueID = eventData.venueId;
				breadcrumbData = [
					{ name: 'Home', href: '/operator' },
					{ name: 'Events', href: '/operator/events' },
					{
						name: eventData.title,
						href: '/operator/venues/' + eventVenueID + '/' + eventData.ID
					},
					{
						name: `Orders`,
						href: '/operator/venues/' + eventVenueID + '/' + eventData.ID + '/orders'
					},
					{
						name: `#${orderId}`,
						href: '/operator/venues/' + eventVenueID + '/' + eventData.ID + '/orders/' + orderId
					}
				];
			} else {
				error = 'failure';
			}
			await getSectionData();
		} catch {
			error = 'failure';
		}
	}
	$: showSendMessageModal = false;
	$: modalIsProcessing = false;
	$: isModalSuccess = false;
	$: performerFullName = '';
	$: venueName = '';
	$: message = '';
	$: title = '';
	function fireSendMessageModal() {
		showSendMessageModal = true;
		modalIsProcessing = false;
		isModalSuccess = false;
		performerFullName = eventData.venue.name;
		venueName = order.firstName + ' ' + order.lastName;
		title = eventData.title;
		message = '';
	}

	function groupRefundedTickets(tickets) {
		const grouped = tickets
			.filter((ticket) => ticket.refunded) // Include only refunded tickets
			.reduce((acc, ticket) => {
				const id = ticket.availableTicketId;
				if (!acc[id]) {
					acc[id] = {
						quantity: 0,
						name: ticket.AvailableTicket?.TicketSection?.name || 'GA',
						unitPrice: ticket.price,
						price: 0,
						uuid: ticket.uuid,
						uuidList: [ticket.uuid]
					};
				} else {
					acc[id].uuidList.push(ticket.uuid);
				}
				acc[id].quantity += 1;
				acc[id].price += ticket.price;
				return acc;
			}, {});

		return Object.values(grouped);
	}

	function groupTickets(tickets) {
		const grouped = tickets
			.filter((ticket) => !ticket.refunded) // Filter out refunded tickets
			.reduce((acc, ticket) => {
				const id = ticket.availableTicketId;
				if (!acc[id]) {
					acc[id] = {
						quantity: 0,
						name: ticket.AvailableTicket?.TicketSection?.name || 'GA',
						unitPrice: ticket.price,
						taxPaid: ticket.taxPaid,
						serviceFeePaid: ticket.serviceFeePaid,
						price: 0,
						refunded: ticket.refunded,
						uuid: ticket.uuid,
						uuidList: [ticket.uuid]
					};
				} else {
					acc[id].uuidList.push(ticket.uuid);
				}
				acc[id].quantity += 1;
				acc[id].price += ticket.price;
				return acc;
			}, {});

		return Object.values(grouped);
	}
	let items = [];

	$: subtotal = 0;
	$: tax = 0;
	$: serviceFee = 0;
	$: total = 0;

	async function printTickets() {
		const response = await fetch(`http://localhost:8080/api/public/generateOrderPDF/${order.uuid}`);
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'tickets.pdf');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	onMount(() => {
		GetOrdersByID();
	});
	const handleModalAction = async (action) => {
		modalIsProcessing = true;
		let response = null;

		switch (action) {
			case 'sendMessage':
				response = await sendOrderMessage();
				showSendMessageModal = false;

				break;
			default:
				response = { ok: false };
		}

		modalIsProcessing = false;
		isModalSuccess = response.ok;
	};
	const handleDeleteConfirm = () => {
		showDeleteModal = false;
		selectedAttendee = null;
	};
	$: orderResult = {};
	async function sendOrderMessage() {
		const response = await fetch(
			'http://localhost:8080/api/protected/sendOrderMessage/' + orderId,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer asdf'
				},
				credentials: 'include',
				body: JSON.stringify({
					message: message
				})
			}
		);

		if (response.ok) {
			orderResult = await response.json();
			window.location.reload();

			return { ok: true, orderResult };
		} else {
			orderResult = 'failure';
			return { ok: false };
		}
	}

	const handleDeleteCancel = () => {
		showDeleteModal = false;
		selectedAttendee = null;
	};

	const getBadgeStatus = (status) => STATUS_BADGES[status] || STATUS_BADGES.default;

	function rowsSelect(event) {
		const { detail: selectedRows } = event;
		selectedAttendee = selectedRows.length;
	}

	let tableData = [
		{
			id: 1,
			attendeeName: 'Cameron Williamson',
			ticketType: 'General Admission',
			price: '14.99',
			isChecked: true,
			status: 'Checked in'
		},
		{
			id: 2,
			attendeeName: 'Arlene McCoy',
			ticketType: 'General Admission',
			price: '14.99',
			isChecked: true,
			status: 'Checked in'
		},
		{
			id: 3,
			attendeeName: 'Kristin Watson',
			ticketType: 'VIP Ticket',
			price: '24.99',
			isChecked: false,
			status: 'Check in'
		},
		{
			id: 4,
			attendeeName: 'Eleanor Pena',
			ticketType: 'VIP Ticket',
			price: '24.99',
			isChecked: false,
			status: 'Check in'
		}
	];
	let refundResponse;
	let refundTicketResponse;
	let refundOrderConfirmationResponse;
	async function refundOrder(orderUUID) {
		const response = await fetch(
			`http://localhost:8080/api/protected/refundPurchasedOrder/${orderUUID}`,
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
			refundResponse = await response.json();
			window.location.reload();
		} else {
			error = 'failure';
		}
	}
	let showRefundModal = false;
	async function refundTicket(ticketUUID) {
		const response = await fetch(
			`http://localhost:8080/api/protected/refundPurchasedTicket/${ticketUUID}`,
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
			refundTicketResponse = await response.json();
			window.location.reload();
		} else {
			error = 'failure';
		}
	}
	async function refundMultipleTickets(ticketList) {
		const response = await fetch(`http://localhost:8080/api/protected/refundMultipleTickets`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			},
			credentials: 'include',
			body: JSON.stringify({ ticketUUIDs: ticketList })
		});

		if (response.ok) {
			refundTicketResponse = await response.json();
			window.location.reload();
		} else {
			error = 'failure';
		}
	}
	async function resendOrderConfirmation(orderUUID) {
		const response = await fetch(
			`http://localhost:8080/api/protected/resendOrderConfirmation/${orderUUID}`,
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
			refundOrderConfirmationResponse = await response.json();
		} else {
			error = 'failure';
		}
	}

	$: selectedOrders = [];
	function toggleOrderSelection(orderId, isSelected) {
		if (isSelected) {
			selectedOrders.push(orderId);
		} else {
			selectedOrders = selectedOrders.filter((id) => id !== orderId);
		}
	}

	$: itemsToRefund = [];
	const handleRefund = async (uuid) => {
		await refundOrder(order.uuid);

		showRefundModal = false;
	};
	const handlePartialRefund = async (uuid) => {
		await refundMultipleTickets(selectedOrders);

		showPartialRefundModal = false;
	};

	const fireOrderRefund = () => {
		ticketsWithQRData.forEach((ticket) => {
			itemsToRefund.push(ticket.uuid);
		});
		showRefundModal = true;
	};

	const fireIndividualOrderRefund = (ticket) => {
		itemsToRefund = [ticket.uuid];
	};

	const handleCancel = () => {
		showRefundModal = false;
		showPartialRefundModal = false;
	};
	let partialRefundTickets = [];
	$: partialRefundSubtotal = 0;
	$: partialRefundTax = 0;
	$: partialRefundServiceFee = 0;
	$: partialRefundTotal = 0;
	const onSelectDropDown = (value) => {
		if (value === 'issue_refund') {
			let currentTickets = [];

			ticketsWithQRData.forEach((ticket) => {
				if (selectedOrders.includes(ticket.uuid)) {
					currentTickets.push(ticket);
				}
			});
			partialRefundTickets = groupTickets(currentTickets);

			partialRefundSubtotal = partialRefundTickets.reduce((acc, item) => acc + item.price * 100, 0);

			partialRefundTax = partialRefundTickets.reduce((acc, item) => acc + item.taxPaid, 0);

			partialRefundServiceFee = partialRefundTickets.reduce(
				(acc, item) => acc + item.serviceFeePaid,
				0
			);
			partialRefundTotal = (
				partialRefundSubtotal +
				partialRefundTax +
				partialRefundServiceFee
			).toFixed(2);

			showPartialRefundModal = true;
		} else if (value === 'delete_attendee' && selectedAttendee) {
			showDeleteModal = true;
		}
	};

	$: breadcrumbData = [];

	let dropdownItems = [
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
		}
	];
</script>

<div class="order-get-by-id">
	<nav class="py-4">
		<Breadcrumb data={breadcrumbData} />
	</nav>
	<div class="grid grid-cols-12 gap-8 px-4 pt-0 py-5 items-center">
		<div class="col-span-12 md:col-span-6">
			<div class="flex items-center justify-between md:justify-start space-x-2">
				<span class=" text-2xl font-bold text-gray-900">Order #{orderId}</span>
				{#if loading}
					<Skeleton class="h4 bg-gray-500" />
				{:else if order?.status}
					<Badge status={getBadgeStatus(order.status)} className="rounded-full px-2">
						{order.status}
					</Badge>
				{/if}
			</div>
		</div>
		<div class="col-span-12 md:col-span-6">
			<div class="flex items-center space-x-2 justify-end">
				<Button
					strokebtn
					afterIcon={DownArrowIcon}
					className="!p-1.5 !px-3 gap-6 w-[215px] justify-between">Actions</Button
				>
				<Dropdown class="w-[215px] space-y-1 ">
					<DropdownItem
						class="flex items-center gap-2 no-underline hover:no-underline"
						on:click={() => {
							fireSendMessageModal();
						}}
					>
						<img src={SendMessageIcon} alt="Resend Confirmation" />Message Attendee</DropdownItem
					>
					<DropdownItem
						class="flex items-center gap-2 no-underline hover:no-underline"
						on:click={() => printTickets()}
					>
						<img src={Print} alt="Resend Confirmation" />Print tickets</DropdownItem
					>
					<DropdownItem
						class="flex items-center gap-2 no-underline hover:no-underline"
						on:click={handleDropdownClick}
					>
						<img src={SendMessageIcon} alt="Resend Confirmation" />
						Resend confirmation
					</DropdownItem>

					<DropdownItem
						on:click={async () => await goto(`/orders/${orderId}/transferOrder`)}
						class="flex items-center gap-2 no-underline hover:no-underline"
					>
						<img src={TransferIcon} alt="transfer" />Transfer
					</DropdownItem>
				</Dropdown>
				<Button danger strokebtn beforeIcon={Cancel} on:click={() => fireOrderRefund()}
					>Cancel order</Button
				>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-12 gap-3 pl-4">
		<div class="col-span-12 md:col-span-8 mr-7 md:mr-0">
			<div class="h-auto">
				<LeftCard
					customerName={order?.firstName + ' ' + order?.lastName}
					email={order?.email}
					phone={order?.phone}
					eventID={eventData?.ID}
					{orderId}
					{venueID}
					orderTotal={'$' + (order?.price / 100).toFixed(2)}
					tickets={ticketsWithQRData.length}
					purchaseDate={new Date(order?.CreatedAt).toLocaleDateString(undefined, {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
					purchaseTime={new Date(order?.CreatedAt).toLocaleTimeString(undefined, {
						hour: 'numeric',
						minute: 'numeric',
						hour12: true
					})}
					paymentMethod="•••• •••• •••• 1865"
					userDetails={{ userProfileUrl: userProfileImg }}
					eventTitle={eventData?.title}
					eventDate={new Date(eventData?.doorsOpenTime).toLocaleDateString(undefined, {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
					eventTime={new Date(eventData?.doorsOpenTime).toLocaleTimeString(undefined, {
						hour: 'numeric',
						minute: 'numeric',
						hour12: true
					})}
					eventLocation={eventData?.venue?.name}
					orderNotes={order?.notes}
				/>
			</div>
			<div
				class="bg-white shadow-sm rounded-lg p-4 align-center sm:p-6 border border-gray-200 my-4"
			>
				<div>
					<h2 class="py-3 pt-1 pb-6 text-xl font-normal text-gray-900">Attendees</h2>
					<div class="grid grid-cols-12 gap-3 md:gap-8">
						<div class="col-span-12 md:col-span-6">
							<Search class="h-10" />
						</div>
						<div class="col-span-12 md:col-span-6">
							<div class="flex items-center justify-end">
								<div class="space-x-4">
									<Button strokebtn afterIcon={DownArrowIcon} className="!p-1.5 !px-3 gap-6"
										>Actions</Button
									>
									<Dropdown class="w-[215px] ">
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
									<Button deemphasized={true}>Check in</Button>
								</div>
							</div>
						</div>
					</div>

					<div class="hidden md:block">
						{#if loading}
							<TableSkeleton columns={8} rows={4} />
						{:else}
							<div class="w-full rounded-[16px] mt-5 flex items-center justify-center">
								<Table placeholder="Search by purchaser name" hoverable={true}>
									<TableHead>
										<TableHeadCell />
										<TableHeadCell>Attendee Name</TableHeadCell>
										<TableHeadCell>Ticket Type</TableHeadCell>
										<TableHeadCell>Price</TableHeadCell>
										<TableHeadCell>Status</TableHeadCell>
										<TableHeadCell />
									</TableHead>
									<TableBody tableBodyClass="divide-y">
										<!--  on:click={() => refundTicket(item.uuid, true)} -->
										{#each tableData as item}
											<TableBodyRow>
												<TableBodyCell>
													{#if !item.refunded}
														<Checkbox
															on:change={(e) => toggleOrderSelection(item.uuid, e.target.checked)}
														/>
													{/if}
												</TableBodyCell>
												<TableBodyCell>{item.attendeeName}</TableBodyCell>
												<TableBodyCell>
													<span
														>Total: {new Intl.NumberFormat('en-US', {
															style: 'currency',
															currency: 'USD'
														}).format(item.price)}</span
													>
												</TableBodyCell>
												<TableBodyCell>
													{item.ticketType}
												</TableBodyCell>
												<TableBodyCell>
													{#if !item.refunded && item.checkedIn}
														<Button
															color="light"
															style="min-width:131px;"
															on:click={() => handleButtonClick(item.ID, false)}>Reset</Button
														>
													{:else if item.refunded}
														Ticket Refunded
													{:else}
														<Button
															style="min-width:131px;"
															on:click={() => handleButtonClick(item.ID, true)}>Check in</Button
														>
													{/if}
												</TableBodyCell>
												<TableBodyCell>
													<DotsHorizontalOutline
														id={`hamburger-menu-${item.id}`}
														style="background-color:white;border-radius:4px;padding:4px;"
													/>
													<Dropdown placement="bottom" triggeredBy={`#hamburger-menu-${item.id}`}>
														<DropdownItem
															href={`/operator/venues/${item.venueId}/${item.id}/details`}
															><div style="display:flex;flex-direction:row;">
																<TicketOutline style="margin-right:4px;" /> Switch ticket type
															</div></DropdownItem
														>
														<DropdownItem href={`/ticketing/events/${item.id}`}
															><div style="display:flex;flex-direction:row;">
																<ArrowsRepeatOutline style="margin-right:4px;" /> Transfer
															</div></DropdownItem
														>
														<DropdownItem href={`/ticketing/events/${item.id}`}
															><div style="display:flex;flex-direction:row;">
																<DollarOutline style="margin-right:4px;" /> Issue refund
															</div></DropdownItem
														>
														<DropdownItem
															><div style="display:flex;flex-direction:row;color:red">
																<TrashBinSolid color="red" style="margin-right:4px;" /> Delete attendee
															</div></DropdownItem
														>
													</Dropdown>
												</TableBodyCell>
											</TableBodyRow>
										{/each}
									</TableBody>
								</Table>
							</div>
						{/if}
					</div>

					<div class="block md:hidden">
						{#each tableData as attend, index}
							<TicketCard
								attendeeName={attend.attendeeName}
								ticketType={attend.ticketType}
								price={attend.price}
								status={attend.status}
								isCheckedIn={attend.isChecked}
								{onSelectDropDown}
							/>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<div class="col-span-12 md:col-span-4 mr-4 sm:ml-4">
			<div class="h-auto">
				<RightCard
					orderItems={items}
					{subtotal}
					{taxRate}
					{tax}
					{serviceFee}
					{total}
					{refundItems}
				/>
			</div>
		</div>
	</div>
</div>

{#if showDeleteModal}
	<DeleteAttendeeModel
		isOpen={showDeleteModal}
		title="Delete attendees"
		message="Are you sure you want to delete the attendees?"
		cancelText="Cancel"
		confirmText="Delete"
		icon={Alert}
		onCancel={handleDeleteConfirm}
		onConfirm={handleDeleteCancel}
	/>
{/if}

<RefundModal
	show={showRefundModal}
	on:close={() => (showRefundModal = false)}
	on:click={() => (showRefundModal = false)}
	title="Are you sure you want to issue a refund?A"
	description="This will refund the cost of the purchase and make any ordered tickets available for resale."
	Actions={[
		{
			label: 'Go back',
			strokebtn: true,
			onClick: handleCancel,
			class: 'w-full rounded-lg text-blue-500 border border-blue-500 text-sm font-medium'
		},
		{ label: 'Refund $' + (order.price / 100).toFixed(2), danger: true, onClick: handleRefund }
	]}
>
	<RightCard orderItems={items} {subtotal} {tax} {serviceFee} {total} hideBorder={true} />
</RefundModal>

<RefundModal
	show={showPartialRefundModal}
	on:close={() => (showPartialRefundModal = false)}
	on:click={() => (showPartialRefundModal = false)}
	title="Are you sure you want to issue a refund?B"
	description="This will refund the cost of the purchase and make any ordered tickets available for resale."
	Actions={[
		{
			label: 'Go back',
			strokebtn: true,
			onClick: handleCancel,
			class: 'w-full rounded-lg text-blue-500 border border-blue-500 text-sm font-medium'
		},
		{
			label: 'Refund $' + partialRefundTotal / 100,
			danger: true,
			onClick: handlePartialRefund
		}
	]}
>
	<RightCard
		orderItems={partialRefundTickets}
		subtotal={partialRefundSubtotal / 100}
		tax={partialRefundTax}
		serviceFee={partialRefundServiceFee}
		total={partialRefundTotal / 100}
		hideBorder={true}
	/>
</RefundModal>
<!-- Send Message Modal -->
<ModalProgress
	bind:show={showSendMessageModal}
	isProcessing={modalIsProcessing}
	isSuccess={isModalSuccess}
>
	<h2 slot="header" class="text-xl font-medium text-gray-900">
		{#if !modalIsProcessing && !isModalSuccess}
			Write a new message
		{/if}
	</h2>
	<div slot="body">
		{#if modalIsProcessing && !isModalSuccess}
			<div
				class="py-2 px-4 flex flex-col items-center justify-center gap-2 text-Text-Primary rounded-lg font-semibold text-base"
			>
				<div class="w-10 h-10 bg-orange-300 rounded-full flex flex-col items-center justify-center">
					<span class="animate-spin">
						<Icon name="Reload" class="animate-spin" size="16" color="#fff" />
					</span>
				</div>
				Sending your message
			</div>
		{:else if isModalSuccess}
			<div class="flex flex-col items-center gap-4">
				<Icon name="CheckCircle" size="40" color="#15A033" />
				<h2 class="text-xl font-medium text-gray-900">Message sent!</h2>
				<p class="text-sm font-medium text-Text-Tartiary text-center">
					Message sent to the venue successfully.
				</p>
				<Button on:click={() => toggleModal('message', false)} size="full">Return to shows</Button>
			</div>
		{:else}
			<div class="flex flex-wrap text-xs font-medium text-Text-Tartiary gap-x-[2%] gap-y-2 mt-4">
				<label class="w-[20%]">From:</label>
				<span class="w-[76%]">{performerFullName}</span>
				<label class="w-[20%]">To:</label>
				<span class="w-[76%]">{venueName}</span>
				<label class="w-[20%]">Show:</label>
				<span class="w-[76%]">{title}</span>
			</div>
			<Input
				type="textarea"
				id="message"
				placeholder="Write your message here"
				bind:value={message}
				className="h-44 mt-2"
				size="full"
			/>
		{/if}
	</div>
	<div slot="footer" class="w-full">
		{#if !modalIsProcessing && !isModalSuccess}
			<div class="w-full flex items-center justify-between md:justify-end gap-4 mt-5">
				<Button
					strokebtn
					deemphasized
					on:click={() => (showSendMessageModal = false)}
					className="w-[48%] min-w-[155px] md:w-auto md:min-w-[130px]"
				>
					Cancel
				</Button>
				<Button
					on:click={() => handleModalAction('sendMessage')}
					className="w-[48%] min-w-[155px] md:w-auto md:min-w-[130px]"
				>
					Send Message
				</Button>
			</div>
		{/if}
	</div>
</ModalProgress>
