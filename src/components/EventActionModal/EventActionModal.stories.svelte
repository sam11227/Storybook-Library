<script context="module">
  import EventActionModal from './EventActionModal.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Components/EventActionModal',
    component: EventActionModal,
    tags: ['autodocs'],
    argTypes: {
      show: { control: 'boolean' },
      fromDateTime: { control: 'text' },
      toDateTime: { control: 'text' },
    }
  });
</script>

<Story
  name="Default Event Action Modal"
  args={{
    show: true,
    fromDateTime: '10:30 Tuesday June 20, 2024',
    toDateTime: '12:30 Wednesday June 21, 2024'
  }}
>
  {#snippet template(args)}
    <EventActionModal
      {...args}
      on:reschedule={() => console.log('Rescheduled')}
      on:manage={() => console.log('Managed')}
      on:delete={() => console.log('Deleted')}
    />
  {/snippet}
</Story>

<Story
  name="Hidden Modal"
  args={{
    show: false,
    fromDateTime: '10:30 Tuesday June 20, 2024',
    toDateTime: '12:30 Wednesday June 21, 2024'
  }}
/>
