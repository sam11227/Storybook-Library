<script context="module">
  import DateRangePicker from './DateRangePicker.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Components/DateRangePicker',
    component: DateRangePicker,
    tags: ['autodocs'],
    argTypes: {
      selectedStartDate: { control: 'text' },
      selectedEndDate: { control: 'text' },
      isDatePickerOpen: { control: 'boolean' },
      currentMonth1: { control: 'number' },
      currentYear1: { control: 'number' },
      currentMonth2: { control: 'number' },
      currentYear2: { control: 'number' }
    }
  });
</script>

<Story
  name="Default Date Range Picker"
  args={{
    selectedStartDate: null,
    selectedEndDate: null,
    isDatePickerOpen: true,
    currentMonth1: new Date().getMonth(),
    currentYear1: new Date().getFullYear(),
    currentMonth2: new Date().getMonth() + 1,
    currentYear2: new Date().getFullYear()
  }}
>
  {#snippet template(args)}
    <DateRangePicker {...args} />
  {/snippet}
</Story>
