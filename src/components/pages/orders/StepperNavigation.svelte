<script>
	import Icon from '../../../assets/icons/chevron-double-right.svg';
	export let steps = [];
	export let currentStep = 1;
</script>

<div class="flex items-center space-x-2 pb-5 md:pb-0">
	{#each steps as step, index}
		<div class="flex items-center">
			<div
				class={`flex items-center justify-center w-7 h-7 rounded-full border text-sm font-medium leading-none ${
					index + 1 === currentStep
						? 'border-blue-600 text-blue-600'
						: 'border-gray-300 text-gray-500'
				}`}
			>
				{index + 1}
			</div>
			<span
				class={`ml-2 text-base font-medium ${
					index + 1 === currentStep ? 'text-blue-600' : 'text-gray-500'
				}`}
			>
				{step}
			</span>
		</div>
		{#if index < steps.length - 1}
			<span class="text-gray-300 mx-2 p-4"><img src={Icon} alt="icon" /></span>
		{/if}
	{/each}
</div>
