<script context="module">
  import DatePicker from './DatePicker.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Components/DatePicker',
    component: DatePicker,
    tags: ['autodocs'],
    argTypes: {} // No props to control yet
  });
</script>

<Story name="Default">
  <DatePicker />
</Story>
  