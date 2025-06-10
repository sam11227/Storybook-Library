<script>
	import Icon from '../../components/Icons/Icon.svelte';
	export let headerTitle = '';
</script>

<button
	type="button"
	class="my-0.5 sm:my-1 flex items-center gap-1.5 sm:gap-2 font-semibold text-xl text-Text-Primary"
	on:click={() => history.back()}
>
	<Icon name="back-left" />
	{headerTitle}
</button>
