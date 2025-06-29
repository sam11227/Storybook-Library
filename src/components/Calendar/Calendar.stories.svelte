<script context="module">
  import Calendar from './Calendar.svelte';
  import imageView from './../../assets/images/image.png';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const eventsData = [
    {
      name: 'Event Sample',
      date: new Date('Sat Oct 05 2024 05:00:00 GMT+0500'),
      image: imageView,
      description: 'This is a successfully modified Event.',
      timeline: '6:00 PM - 9:00 PM'
    },
    {
      name: 'Tech Roast Show',
      date: new Date('Tue Oct 08 2024 05:00:00 GMT+0500'),
      image: imageView,
      description: 'This is a sample event.',
      timeline: '6:00 PM - 9:00 PM'
    }
  ];

  const { Story } = defineMeta({
    title: 'Components/Calendar',
    component: Calendar,
    tags: ['autodocs'],
    argTypes: {
      currentMonth: { control: { type: 'number', min: 0, max: 11 } },
      currentYear: { control: 'number' },
      isScheduledBtn: { control: 'boolean' },
      embedCalendar: { control: 'boolean' },
      eventCalendar: { control: 'boolean' },
      scheduleRecurring: { control: 'boolean' },
      currentevents: {
        control: 'object',
        table: { disable: true } // Too complex for controls panel
      }
    }
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <Calendar {...args} />
  {/snippet}
</Story>

<Story name="Default Calendar" args={{ currentMonth: 10, currentYear: 2024 }} />

<Story
  name="With Scheduled Button"
  args={{ currentMonth: 10, currentYear: 2024, isScheduledBtn: true }}
/>

<Story
  name="Embed Calendar"
  args={{ currentMonth: 9, currentYear: 2024, embedCalendar: true, currentevents: eventsData }}
/>

<Story
  name="Event Calendar"
  args={{ currentMonth: 9, currentYear: 2024, eventCalendar: true, currentevents: eventsData }}
/>

<Story
  name="Schedule Recurring Calendar"
  args={{ currentMonth: 9, currentYear: 2024, scheduleRecurring: true, currentevents: eventsData }}
/>
