<script>
	import { Checkmark } from 'carbon-icons-svelte';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import Badge from '../Badges/Badge.svelte';

	export let attendees = [];

	let openIndex = -1;

	const handleClick = (index) => {
		openIndex = openIndex === index ? -1 : index;
	};
</script>

<div class="w-ful pt-4">
	<div class="flex text-gray-600 bg-gray-100 p-5 items-center space-x-32 uppercase">
		<h2 class="text-xs font-semibold text-gray-500">Attendee name</h2>
		<h2 class="text-xs font-semibold text-gray-500">Status</h2>
	</div>

	<Accordion flush class="divide-y divide-gray-200">
		{#each attendees as attendee, index}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<span on:click={() => handleClick(index)} class="cursor-pointer">
				<AccordionItem
					paddingFlush="py-5 {openIndex === index ? 'p-0' : ''} "
					class="relative  {openIndex === index
						? 'border-l-4 border-l-primary-400 border-b-0 group-first:rounded-none '
						: ''}"
					open={openIndex === index}
				>
					<svelte:fragment slot="header">
						<div
							class="grid grid-cols-12 items-center py-2 w-full {openIndex === index
								? 'pt-5 pl-1'
								: ''}"
						>
							<span class="col-span-4 text-sm font-medium pl-4 text-gray-900"
								>{attendee.attendees.name}</span
							>
							<div class="flex justify-end w-full text-sm font-medium col-span-8 text-nowrap">
								{#if attendee.isChecked}
									<Badge
										status="success"
										icon={Checkmark}
										className="rounded-full text-sm  font-medium px-2 mr-7"
									>
										{attendee.status}
									</Badge>
								{:else}
									<div
										class="px-2 py-2 mr-7 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-200"
									>
										{attendee.status}
									</div>
								{/if}
							</div>
						</div>
					</svelte:fragment>
					<div
						class="py-5 pl-6 p-6 shadow-sm bg-white border-l-4 border-l-primary-400 group-first:rounded-none"
					>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<p class="text-xm text-gray-500 font-semibold">Email</p>
								<div class="flex flex-col w-full md:w-96 px-1">
									<p class="text-sm text-gray-500 font-normal break-words">
										{attendee.attendees.email}
									</p>
								</div>
							</div>
							<div>
								<p class="text-xm text-gray-500 font-semibold">Order ID</p>
								<p class="text-sm text-gray-500 font-normal break-words">
									{attendee.orderId}
								</p>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4 mt-6">
							<div>
								<p class="text-xm text-gray-500 font-semibold">Ticket ID</p>
								<p class="text-sm text-gray-500 font-normal break-words">
									{attendee.ticketId}
								</p>
							</div>
							<div>
								<p class="text-xm text-gray-500 font-semibold">Sale Type</p>
								<p>
									<span
										class="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-normal"
									>
										{attendee.saleType}
									</span>
								</p>
							</div>
						</div>

						<div class="mt-6">
							<p class="text-xm text-gray-500 font-semibold">Ticket Type</p>
							<p class="text-sm text-gray-500 font-normal break-words">
								{attendee.ticketType}
							</p>
						</div>

						<div class="mt-6">
							<p class="text-xs text-gray-500 font-semibold">Notes</p>
							<p class="text-sm text-gray-500 font-normal break-words italic">
								{attendee.notes}
							</p>
						</div>
					</div>
				</AccordionItem>
			</span>
		{/each}
	</Accordion>
</div>
