<script>
	import {
		Accordion,
		AccordionItem,
		Checkbox,
		Radio,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead
	} from 'flowbite-svelte';
	import Outline from '../../assets/icons/ticket-outline.svg';
	export let tickets = [];
	export let selectedTicket = null;
	export let capacity = '';

	function selectTicket(ticket) {
		selectedTicket = ticket;
	}
</script>

<div class="bg-white p-4 pt-2">
	<Accordion>
		<AccordionItem open={true} border={false} borderOpenClass="p-0">
			<div slot="header" class=" flex w-full items-center justify-between">
				<div class="flex gap-2 items-center">
					<div>
						<img src={Outline} alt="outline" />
					</div>
					<h3 class="text-base font-normal text-gray-900">Cameron Williamson</h3>
				</div>
				<div class="text-sm text-gray-500 font-normal pr-5">General Admission $14.99</div>
			</div>
			<Table theadClass="bg-red-400">
				<TableHead class=" bg-white border-b">
					<TableBodyCell class="text-xs font-semibold text-gray-500" colspan="2"
						>New Ticket Type</TableBodyCell
					>
					<TableBodyCell class="text-xs font-semibold text-gray-500">New Price</TableBodyCell>
					<TableBodyCell class="text-xs font-semibold text-gray-500">Difference</TableBodyCell>
					<TableBodyCell class="text-xs font-semibold text-gray-500">Complimentary</TableBodyCell>
					<TableBodyCell class="text-xs font-semibold text-gray-500">Capacity</TableBodyCell>
				</TableHead>
				{#each tickets as ticket}
					<TableBody tableBodyClass="divide-y">
						<TableBodyRow>
							<TableBodyCell class="!p-4">
								<Radio />
							</TableBodyCell>

							<TableBodyCell class="text-gray-500 font-normal text-sm">{ticket.type}</TableBodyCell>
							<TableBodyCell class="text-gray-500 text-sm font-normal"
								>${ticket.newPrice.toFixed(2)}</TableBodyCell
							>
							<TableBodyCell class="text-sm font-normal"
								><div
									class={` text-sm font-semibold ${
										ticket.difference < 0 ? 'text-green-500' : 'text-red-500'
									}`}
								>
									{ticket.difference < 0 ? '-' : '+'}${Math.abs(ticket.difference).toFixed(2)}
								</div></TableBodyCell
							>
							<TableBodyCell><Checkbox /></TableBodyCell>
							<TableBodyCell class="text-gray-500 text-sm font-normal"
								><div class="">
									<div class="text-gray-500 text-xs text-right pb-2">
										{`${ticket.capacityPercentage}/100`}
									</div>
									<div class="text-xs font-normal text-gray-500">
										{capacity}
									</div>
									<div class="gap-2">
										<div class="gap-2">
											<div class="h-2 w-full bg-gray-200 rounded-full">
												<div
													class="h-2 {ticket.capacityPercentage < 30
														? 'bg-red-500'
														: ticket.capacityPercentage < 70
														? 'bg-yellow-500'
														: 'bg-green-500'} rounded-full"
													style="width: {ticket.capacityPercentage}%"
												/>
											</div>
										</div>
									</div>
								</div></TableBodyCell
							>
						</TableBodyRow>
					</TableBody>
				{/each}
			</Table>
		</AccordionItem>
	</Accordion>
</div>
