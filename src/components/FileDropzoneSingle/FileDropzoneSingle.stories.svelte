<script context="module">
  import FileDropzoneSingle from './FileDropzoneSingle.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Components/FileDropzoneSingle',
    component: FileDropzoneSingle,
    tags: ['autodocs'],
    argTypes: {
      shape: {
        control: { type: 'select' },
        options: [
          '32x32-circle',
          '64x64-rounded-square',
          '128x128-rounded-square',
          '256x256-profile-photo',
          'fullwidth-rounded-rectangle'
        ]
      },
      readonly: { control: 'boolean' },
      existingImages: {
        control: 'array',
        description: 'An array with a single image URL for prefill'
      }
    }
  });
</script>

<Story name="Default FileDropzone">
  {#snippet template(args)}
    <FileDropzoneSingle {...args} />
  {/snippet}
</Story>

<Story
  name="Rounded Square Small Shape Dropzone"
  args={{
    shape: '32x32-circle'
  }}
/>

<Story
  name="FileDropzone with Existing Images"
  args={{
    shape: '256x256-profile-photo',
    existingImages: ['https://via.placeholder.com/150']
  }}
/>

<Story
  name="Readonly FileDropzone"
  args={{
    shape: '128x128-rounded-square',
    readonly: true
  }}
/>

<Story
  name="Rounded Square Shape Dropzone"
  args={{
    shape: '64x64-rounded-square'
  }}
/>

<Story
  name="Fullwidth Rounded Rectangle Dropzone"
  args={{
    shape: 'fullwidth-rounded-rectangle'
  }}
/>
