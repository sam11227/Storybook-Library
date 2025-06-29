<script context="module">
  import Modal from './Modal.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import TickIcon from './../../assets/icons/tick-01.png';
  import SuccessIcon from './../../assets/svg/Success-icon.svg';
  import AttachmentIcon from './../../assets/svg/attachment-square.svg';
  import ArrowLeft from './../../assets/svg/arrow-left-02.svg';

  const { Story } = defineMeta({
    title: 'Components/Modal',
    component: Modal,
    tags: ['autodocs'],
    argTypes: {
      title: { control: 'text' },
      description: { control: 'text' },
      warningText: { control: 'text' },
      show: { control: 'boolean' },
    }
  });
</script>

<script>
  function handleAction(label) {
    console.log(label + ' clicked');
  }
</script>

<Story name="Interactive Custom Modal" args={{
  show: true,
  title: 'Are you sure?',
  description: 'Please confirm that you want to proceed with this action.',
  warningText: 'This action is irreversible!',
  actions: [
    { label: 'Cancel', onClick: () => console.log('Cancelled'), strokebtn: true },
    { label: 'Confirm', onClick: () => console.log('Confirmed') }
  ],
  icon: SuccessIcon
}}>
  {#snippet template(args)}
    <Modal {...args} on:cancel={() => handleAction('cancel')} on:confirm={() => handleAction('confirm')} />
  {/snippet}
</Story>

<Story name="Success Modal" args={{
  show: true,
  title: 'Avail requests sent',
  actions: [{ label: 'Confirm', onClick: () => console.log('Confirmed') }],
  icon: SuccessIcon
}} />

<Story name="Confirm Modal" args={{
  show: true,
  title: 'Create New Tracking Link',
  description: 'Enter a name for your tracking link. This name will be used for reference on your dashboard.',
  actions: [
    { label: 'Cancel', onClick: () => console.log('Cancelled'), strokebtn: true },
    { label: 'Confirm', onClick: () => console.log('Confirmed') }
  ],
  icon: AttachmentIcon
}} />

<Story name="Password Reset Modal" args={{
  show: true,
  title: 'Password Reset!',
  description: 'Your password has been successfully reset, click below to continue your access.',
  actions: [
    {
      label: 'Return to the login Screen',
      onClick: () => console.log('Back to login'),
      textBtn: true,
      beforeIcon: ArrowLeft
    }
  ],
  icon: TickIcon
}} />

<Story name="Info Modal" args={{
  show: true,
  title: 'Please fill out your profile',
  description: 'Your information may be used for show promotion, so please provide as much as you can.',
  actions: [{ label: 'Confirm', onClick: () => console.log('Confirmed') }]
}} />

<Story name="Warning Modal" args={{
  show: true,
  title: 'Are you sure?',
  description: 'Please confirm that you want to proceed with this action.',
  closeBtn: true,
  warningText: 'This action is irreversible!'
}} />
