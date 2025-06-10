<script>
	export let orderItems = [];
	export let refundItems = [];
	export let subtotal = 0;
	export let tax = 0;
	export let taxRate = null;
	export let serviceFee = 0;
	export let total = 0;
	export let hideBorder = false;
	$: formattedSubtotal = Number(subtotal).toFixed(2);
	$: formattedTax = Number(tax / 100).toFixed(2);
	$: formattedServiceFee = Number(serviceFee / 100).toFixed(2);
	$: formattedTotal = Number(total).toFixed(2);
</script>

<div
	class={`bg-white rounded-lg p-6 size-full ${
		hideBorder ? '' : 'shadow-sm border border-gray-200'
	}`}
>
	<h2 class="text-lg font-normal text-gray-900 mb-4">Order summary</h2>
	<div class="space-y-4">
		{#each orderItems as item}
			<div class="flex justify-between items-start">
				<div>
					<p class="text-lg font-semibold text-gray-900">
						{item.quantity} x {item.name}
					</p>
					<p class="text-sm text-gray-500 font-medium">${item.unitPrice} each</p>
				</div>
				<p class="text-base font-normal text-gray-500 mt-1">${item.price}</p>
			</div>
		{/each}
	</div>

	<div class="space-y-4">
		{#each refundItems as item}
			<div class="flex justify-between items-start">
				<div>
					<p class="text-lg font-semibold text-red-600">
						{item.quantity} x {item.name}
						<span
							class="bg-[#FF922E26] text-[#FF922E] text-sm font-semibold px-2.5 py-0.5 rounded-full ml-2"
							>Refund</span
						>
					</p>
					<p class="text-sm text-red-600 font-medium">${item.unitPrice} each</p>
				</div>
				<p class="text-base font-normal text-red-600 mt-1">$({item.price})</p>
			</div>
		{/each}
	</div>
	<hr class="my-4 border-gray-200" />

	<div class="space-y-2">
		<div class="flex justify-between">
			<span class="font-normal text-sm text-Text-Tartiary">Subtotal</span>
			<span class="text-base font-normal text-gray-500">${formattedSubtotal}</span>
		</div>
		<div class="flex justify-between">
			<span class="font-normal text-sm text-Text-Tartiary">
				Tax {#if taxRate !== null}({taxRate}%) {/if}
			</span>
			<span class="text-base font-normal text-gray-500">${formattedTax}</span>
		</div>
		<div class="flex justify-between">
			<span class="font-normal text-sm text-Text-Tartiary">Service Fee</span>
			<span class="text-base font-normal text-gray-500">${formattedServiceFee}</span>
		</div>
	</div>

	<hr class="my-4 border-gray-200" />
	<div class="flex justify-between items-center text-gray-900 text-lg font-semibold">
		<span class="font-normal text-sm text-Text-Tartiary">Total</span>
		<span class="font-semibold text-2xl text-black">${formattedTotal}</span>
	</div>
</div>
