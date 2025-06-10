<script context="module">
	import { Story, Template } from '@storybook/addon-svelte-csf';
	import FileDropzoneSingle from './FileDropzoneSingle.svelte';

	export const meta = {
		title: 'Components/FileDropzoneSingle',
		component: FileDropzoneSingle
	};
</script>

<Template let:args>
	<FileDropzoneSingle {...args} />
</Template>

<Story name="Default FileDropzone">
	<FileDropzoneSingle />
</Story>

<Story name="Rounded Square Small Shape Dropzone">
	<FileDropzoneSingle shape="32x32-circle" />
</Story>

<Story name="FileDropzone with Existing Images">
	<FileDropzoneSingle
		existingImages={['https://via.placeholder.com/150']}
		shape="256x256-profile-photo"
	/>
</Story>

<Story name="Readonly FileDropzone">
	<FileDropzoneSingle shape="128x128-rounded-square" />
</Story>

<Story name="Rounded Square Shape Dropzone">
	<FileDropzoneSingle shape="64x64-rounded-square" />
</Story>

<Story name="Fullwidth Rounded Rectangle Dropzone">
	<FileDropzoneSingle shape="fullwidth-rounded-rectangle" />
</Story>
