<script context="module">
  import DateTimePicker from './DateTimePicker.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Components/DateTimePicker',
    component: DateTimePicker,
    tags: ['autodocs'],
    argTypes: {
      value: {
        control: 'text',
        description: 'Currently selected datetime in MM/DD/YYYY hh:mm A format',
      },
      disabled: {
        control: 'boolean',
        description: 'Disables the picker',
      },
      placeholder: {
        control: 'text',
        defaultValue: 'Select date and time',
        description: 'Input placeholder text',
      }
    }
  });
</script>

<Story name="Default DateTimePicker">
  {#snippet template(args)}
    <DateTimePicker {...args} />
  {/snippet}
</Story>

<Story
  name="With Placeholder"
  args={{
    placeholder: 'Pick a datetime',
  }}
/>

<Story
  name="Disabled Picker"
  args={{
    disabled: true,
    value: '06/28/2025 10:30 AM',
  }}
/>

<Story
  name="Preselected DateTime"
  args={{
    value: '12/25/2025 05:00 PM',
  }}
/>
