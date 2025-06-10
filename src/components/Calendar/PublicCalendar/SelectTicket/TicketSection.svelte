<script>
	import { createEventDispatcher } from 'svelte';
	import Button from '../../../Button/Button.svelte';
	import MinusIcon from './../../../../assets/svg/minus-outline.svg';
	import PlusIcon from './../../../../assets/svg/plus-outline.svg';

	const dispatch = createEventDispatcher();

	export let title;
	export let description;
	export let price;
	export let fees;
	export let quantity = 0;
	export let soldOut = false;
</script>

<div class=" cursor-pointer overflow-hidden {!soldOut ? 'hover:bg-[#C3DDFD29] ' : ''} ">
	<div>
		<div class="p-3 border-t border-l border-r rounded-t-md rouded-r-md">
			<h3 class="font-medium mb-1">{title}</h3>
			<p class="text-xs text-gray-600">{description}</p>
		</div>

		<div class="flex items-center gap-2">
			<div class="border-[1px] w-6 bg-white rounded-full h-6 ml-[-12px] mt-[-2px]" />
			<hr
				class="w-full my-3"
				style="height: 2px; border: none; background-image: repeating-linear-gradient(to right, #D4D6D9 0, #D4D6D9 12px, transparent 10px, transparent 20px);"
			/>
			<div class="border-[1px] w-6 bg-white rounded-full h-6 mr-[-12px] mt-[-2px]" />
		</div>

		<div
			class="flex justify-between items-center p-3 border-b border-l border-r rounded-b-md rouded-r-md mt-[-2px]"
		>
			<div>
				<span class="font-medium">${price}</span>
				<span class="text-xs text-gray-500">incl. ${fees ? fees : 0} fee</span>
			</div>
			{#if soldOut}
				<span class="text-red-500 ml-2">Sold out</span>
			{/if}

			{#if !soldOut}
				<div class="flex items-center border-2 rounded-lg">
					<div class="border-brand-Primary">
						<Button class="p-2" on:click={() => dispatch('decrement')}
							><img src={MinusIcon} alt="icon here" /></Button
						>
					</div>
					<span class="px-2 py-[1.3px] border-l-2 border-r-2">{quantity}</span>

					<div class="border-brand-Primary">
						<Button class="p-2" on:click={() => dispatch('increment')}
							><img src={PlusIcon} alt="icon here" /></Button
						>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
