<script>
	import { Accordion, AccordionItem, Checkbox, Radio } from 'flowbite-svelte';
	import Outline from '../../../assets/icons/ticket-outline.svg';
	export let tickets = [];
	export let selectedTicket = null;
	export let capacity = '';

	function selectTicket(ticket) {
		selectedTicket = ticket;
	}
</script>

<div class="bg-white p-0 pb-4">
	<Accordion>
		<AccordionItem open={true} border={false} borderOpenClass>
			<div slot="header" class=" flex w-full items-center justify-between">
				<div class="flex gap-2 items-center">
					<div>
						<img src={Outline} alt="outline" />
					</div>
					<h3 class=" text-sm sm:text-base font-normal text-gray-900 text-nowrap">
						Cameron Williamson
					</h3>
				</div>
				<div class="text-sm text-gray-500 font-normal pr-5">$14.99</div>
			</div>
			<div>
				{#each tickets as ticket}
					<div class="border-b border-gray-300">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div
							class={`grid grid-cols-2 items-center p-2 transition hover:shadow-md cursor-pointer 
                          ${
														selectedTicket === ticket.type
															? 'border-blue-500 bg-blue-50'
															: 'border-gray-300'
													}`}
							on:click={() => selectTicket(ticket.type)}
						>
							<div class="flex items-center gap-3">
								<Radio name="example" class="text-gray-500 font-normal text-sm">{ticket.type}</Radio
								>
							</div>
							<div class="flex justify-between">
								<div class="flex flex-col items-start">
									<span class="text-xs font-semibold text-gray-500 pb-1">New Price</span>
									<div class="text-sm font-normal text-gray-500">
										${ticket.newPrice.toFixed(2)}
									</div>
								</div>
								<div class="flex flex-col items-start">
									<span class="text-xs font-semibold text-gray-500 pb-1">Difference</span>
									<div
										class={`text-sm font-semibold ${
											ticket.difference < 0 ? 'text-green-500' : 'text-red-500'
										}`}
									>
										{ticket.difference < 0 ? '-' : '+'}${Math.abs(ticket.difference).toFixed(2)}
									</div>
								</div>
							</div>
						</div>

						<div class="grid grid-cols-2 items-center pb-5">
							<div />
							<div>
								<span class="text-xs font-semibold text-gray-500 pb-2">Capacity</span>
								<div class="text-xs font-normal text-gray-500 pb-2">
									{capacity}
								</div>
								<div class="gap-2 w-full">
									<div class="gap-2 w-full pr-2">
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
							</div>
						</div>

						<div class="grid grid-cols-2 items-center pb-8">
							<div />
							<Checkbox checked class="text-xs font-semibold text-gray-500">Complimentary</Checkbox>
						</div>
					</div>
				{/each}
			</div>
		</AccordionItem>
	</Accordion>
</div>
