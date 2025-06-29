<script context="module" lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';

  import ArrowDown from '../../assets/svg/arrow-down-01.svg';
  import Notification from '../../assets/svg/notification-02.svg';
  import Add from '../../assets/svg/add-main.svg';
  import ArrowLeft from '../../assets/svg/arrow-left-02.svg';
  import Share from '../../assets/svg/share-08.svg';
  import DeleteIcon from '../../assets/svg/delete-02.svg';
  import AddMainBlue from '../../assets/svg/add-main-blue.svg';

  const { Story } = defineMeta({
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      label: { control: 'text' },
      alert: { control: 'boolean' },
      danger: { control: 'boolean' },
      deemphasized: { control: 'boolean' },
      textBtn: { control: 'boolean' },
      size: { control: 'text' },
      disabled: { control: 'boolean' },
      className: { control: 'text' },
      lightbtn: { control: 'boolean' },
      strokebtn: { control: 'boolean' },
      ScheduledBtn: { control: 'boolean' },
      beforeIcon: { control: 'text' },
      afterIcon: { control: 'text' }
    }
  });

  function handleAlert() {
    alert('Hi, this is an alert!');
  }
</script>

<Story name="Default">
  {#snippet template(args)}
    <Button on:click={handleAlert} {...args}>{args.label}</Button>
  {/snippet}
</Story>

<Story name="Default Button" args={{ label: 'Default Button' }} />
<Story name="Danger Button" args={{ label: 'Danger Button', danger: true }} />
<Story name="Alert Button" args={{ label: 'Alert Button', alert: true }} />
<Story name="Full Width Button" args={{ label: 'Full Width Button', size: 'full' }} />
<Story name="Disabled Button" args={{ label: 'Disabled Button', disabled: true }} />
<Story name="De-emphasized Button" args={{ label: 'De-emphasized Button', deemphasized: true }} />
<Story name="Light Button" args={{ label: 'Light Button', lightbtn: true }} />
<Story name="Stroke Button" args={{ label: 'Stroke Button', strokebtn: true }} />
<Story name="StrokeWithDelete Button" args={{ label: 'Delete', strokebtn: true, danger: true }} />

<Story name="Save & Notify Button">
  <Button on:click={handleAlert} beforeIcon={Notification}>Save & Notify</Button>
</Story>
<Story name="Add Button">
  <Button on:click={handleAlert} beforeIcon={Add}>Add</Button>
</Story>
<Story name="Go back Button">
  <Button strokebtn on:click={handleAlert} beforeIcon={ArrowLeft}>Go back</Button>
</Story>
<Story name="Share Button">
  <Button strokebtn on:click={handleAlert} beforeIcon={Share}>Share</Button>
</Story>
<Story name="Delete unused Button">
  <Button strokebtn danger on:click={handleAlert} beforeIcon={DeleteIcon}>Delete unused</Button>
</Story>
<Story name="Stroke Button with icon">
  <Button strokebtn on:click={handleAlert} afterIcon={ArrowDown}>2</Button>
</Story>
<Story name="Text Button with icon">
  <Button textBtn on:click={handleAlert} beforeIcon={ArrowLeft}>Return to Login Screen</Button>
</Story>
<Story name="Schedule Button with icon">
  <Button ScheduledBtn on:click={handleAlert} beforeIcon={AddMainBlue}>Schedule</Button>
</Story>
