<script>
  import Button from "@components/Button/Button.svelte";
  import { Dropdown, DropdownItem } from "flowbite-svelte";
  import { DotsHorizontalOutline } from "flowbite-svelte-icons";

  export let ticket;
  export let loading = false;
  export let menuItems = [
    {
      label: "Edit",
      icon: null,
      action: () => {},
      color: "text-gray-700",
    },
    {
      label: "Copy",
      icon: null,
      action: () => {},
      color: "text-gray-700",
    },
    {
      label: "Delete",
      icon: null,
      action: () => {},
      color: "text-red-500",
      disabled: false,
    },
  ];
  export let dropdownId = "";
  export let closeDropdown = () => {};
  export let triggerIcon = DotsHorizontalOutline;
  export let triggerIconProps = { class: "w-8 h-8" };
</script>

<div class="relative md:block hidden">
  <Button class="text-gray-500 !p-2" id={dropdownId}>
    <svelte:component this={triggerIcon} {...triggerIconProps} />
  </Button>

  <Dropdown
    placement="left"
    triggeredBy={`#${dropdownId}`}
    style="z-index: 99"
    class="bg-white shadow-lg rounded-lg border border-gray-200 w-48 z-50 absolute right-[-1rem]"
  >
    {#each menuItems as item}
      <DropdownItem
        on:click={() => {
          item.action(ticket);
          closeDropdown(ticket.ID);
        }}
        class={item.color}
      >
        <Button
          class="flex items-center justify-start gap-3 w-full py-2 hover:bg-none text-left {item.color}"
          disabled={item.disabled || loading}
        >
          {#if item.icon}
            <svelte:component this={item.icon} />
          {/if}
          <span>{item.label}</span>
        </Button>
      </DropdownItem>
    {/each}
  </Dropdown>
</div>
