<script>
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import Badge from '../Badges/Badge.svelte';

	export let orders = [];

	let openIndex = -1;

	const handleClick = (index) => {
		openIndex = openIndex === index ? -1 : index;
	};
</script>

<div class="w-full">
	<div class="flex justify-around text-gray-600 bg-gray-100 rounded-md py-8 items-center">
		<h2 class="text-lg font-medium">ORDER ID</h2>
		<h2 class="text-lg font-medium">ORDER TOTAL</h2>
	</div>

	<Accordion flush class="divide-y divide-gray-200">
		{#each orders as order, index}
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
							<span class="col-span-7 text-lg font-medium pl-2">{order.purchasedBy.name}</span>
							<span class="col-span-5 text-lg text-green-500 font-medium text-left">
								{order.total}
							</span>
						</div>
					</svelte:fragment>
					<div
						class="py-5 grid grid-cols-2 pl-6 border-l-4 border-l-primary-400 group-first:rounded-none"
					>
						<div class="space-y-8">
							<div>
								<h3 class="text-gray-600 mb-1">Email</h3>
								<p>{order.purchasedBy.email}</p>
							</div>
							<div>
								<h3 class="text-gray-600 mb-1">Quantity</h3>
								<p>{order.quantity}</p>
							</div>
							<div>
								<h3 class="text-gray-600 mb-1">Status</h3>
								<Badge
									status={order.status?.includes('Refunded')
										? 'warning'
										: order.status === 'Cancelled'
										? 'danger'
										: 'success'}
									className="rounded-full px-2"
								>
									{order.status}
								</Badge>
							</div>
							{#if order.note}
								<div>
									<h3 class="text-gray-600 mb-1">Notes</h3>
									<p class="text-gray-600 italic">{order.note}</p>
								</div>
							{/if}
						</div>

						<div class="space-y-8">
							<div>
								<h3 class="text-gray-600 mb-1">Order ID</h3>
								<p>{order.orderId}</p>
							</div>
							<div>
								<h3 class="text-gray-600 mb-1">Date of Purchase</h3>
								<p>{order.dateOfPurchase}</p>
							</div>
							<div>
								<h3 class="text-gray-600 mb-1">Sale Type</h3>
								<Badge status="success" className="rounded-full px-2">
									{order.saleType}
								</Badge>
							</div>
						</div>
					</div>
				</AccordionItem>
			</span>
		{/each}
	</Accordion>
</div>
