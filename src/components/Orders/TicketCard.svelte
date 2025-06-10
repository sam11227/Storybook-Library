<script>
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
	import CurrencyDollar from 'carbon-icons-svelte/lib/CurrencyDollar.svelte';
	import OverflowMenuVertical from 'carbon-icons-svelte/lib/OverflowMenuVertical.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import Message from '../../assets/icons/message.svg';
	import TicketOutline from '../../assets/icons/ticket-outline.svg';
	import TransferIcon from '../../assets/icons/transfer.svg';
	import Badge from '../Badges/Badge.svelte';
	import Button from '../Button/Button.svelte';

	export let attendeeName = '';
	export let ticketType = '';
	export let price = '';
	export let status = '';
	export let isCheckedIn = false;
	export let onSelectDropDown = () => {};
</script>

<div class="bg-white p-6 shadow-sm w-full max-w-2xl">
	<div class="border-b-2">
		<div class="flex justify-between items-start mb-8">
			<h2 class="text-sm font-medium text-gray-900">{attendeeName}</h2>
			<div>
				<OverflowMenuVertical
					data-testid="dropdown-menu"
					triggeredBy=".dots-menu"
					class="dots-menu dark:text-white cursor-pointer"
				/>
				<Dropdown class="shadow-none min-w-[200px]" triggeredBy=".dots-menu">
					<DropdownItem
						on:click={() => onSelectDropDown('message_attendee')}
						class="flex items-center gap-2 no-underline hover:no-underline font-normal "
						><img src={Message} alt="Print Tickets" />Message attendee</DropdownItem
					>
					<DropdownItem
						on:click={() => onSelectDropDown('switch_ticket_type')}
						class="flex items-center gap-2 no-underline hover:no-underline font-normal"
					>
						<img src={TicketOutline} alt="Resend Confirmation" class="font-normal" />Switch ticket
						type</DropdownItem
					>
					<DropdownItem
						on:click={() => onSelectDropDown('transfer')}
						class="flex items-center gap-2 no-underline hover:no-underline font-normal"
					>
						<img src={TransferIcon} alt="transfer" />Transfer</DropdownItem
					>
					<DropdownItem
						on:click={() => onSelectDropDown('issue_refund')}
						class="flex items-center gap-2 no-underline hover:no-underline font-normal"
					>
						<CurrencyDollar />Issue refund</DropdownItem
					>
					<DropdownItem
						on:click={() => onSelectDropDown('delete_attendee')}
						class="flex items-center gap-2 no-underline hover:no-underline text-red-600 font-normal"
					>
						<TrashCan />Delete attendee</DropdownItem
					>
				</Dropdown>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<h3 class="font-semibold text-gray-500 text-xs mb-2">Ticket Type</h3>
				<p class="text-sm font-normal text-gray-500">{ticketType}</p>
			</div>

			<div>
				<h3 class="font-semibold text-gray-500 text-xs mb-2">Price</h3>
				<p class="text-sm font-normal text-gray-500">${price}</p>
			</div>
		</div>

		<div class="mt-6 mb-3">
			<h3 class="text-xs font-semibold text-gray-500 mb-2">Status</h3>
			{#if isCheckedIn}
				<Badge
					icon={Checkmark}
					status={status === 'Refunded' ? 'warning' : status === 'Cancelled' ? 'danger' : 'success'}
					className="rounded-full font-semibold text-sm p-1 px-2 "
				>
					{status}
				</Badge>
			{:else}
				<Button variant="outline">Check in</Button>
			{/if}
		</div>
	</div>
</div>
