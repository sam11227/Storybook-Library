<script context="module">
  import Form from './Form.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Components/Form',
    component: Form,
    tags: ['autodocs'],
    argTypes: {
      show: { control: 'boolean' }
      // Add more props here if needed
    }
  });
</script>

<Story
  name="Interactive Custom Form"
  args={{
    show: true
  }}
>
  {#snippet template(args)}
    <Form {...args} />
  {/snippet}
</Story>
