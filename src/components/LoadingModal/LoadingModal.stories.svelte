<script context="module">
  import LoadingModal from './LoadingModal.svelte';
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Components/LoadingModal',
    component: LoadingModal,
    tags: ['autodocs'],
    argTypes: {
      show: { control: 'boolean' }
    }
  });
</script>

<script>
  let show = true;

  function handleClose() {
    show = false;
  }
</script>

<Story
  name="Default Loading Modal"
  args={{ show: true }}
>
  {#snippet template(args)}
    <LoadingModal {...args} on:close={handleClose} />
  {/snippet}
</Story>
