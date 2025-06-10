<script context="module">
	import Form from './Form.svelte';

	export const meta = {
		title: 'Components/Form',
		component: Form,
		argTypes: {}
	};
</script>

<script>
	import { Story, Template } from '@storybook/addon-svelte-csf';

	function handleAction(label) {}
</script>

<Template let:args>
	<Form {...args} />
</Template>

<Story
	name="Interactive Custom Form"
	args={{
		show: true
	}}
/>
