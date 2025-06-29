<script context="module">
	import Cropzone from './CropZone.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Components/Cropzone',
		tags: ['autodocs'],
		component: Cropzone,
		argTypes: {
			existingImage: { control: 'text' },
			readonly: { control: 'boolean' },
			shape: {
				control: { type: 'select' },
				options: ['rect', 'round']
			}
		}
	});
</script>

<Story name="Default">
	{#snippet template(args)}
		<Cropzone {...args} />
	{/snippet}
</Story>

<Story name="Default Cropzone" args={{ shape: 'rect', readonly: false }} />

<Story name="Round Shape Cropzone">
	<Cropzone shape="round" />
</Story>
