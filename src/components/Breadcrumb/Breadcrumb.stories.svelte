<script context="module" lang="ts">
  import Breadcrumb from "./Breadcrumb.svelte";
  import { defineMeta } from "@storybook/addon-svelte-csf";

  const { Story } = defineMeta({
    title: "Components/Breadcrumb",
    component: Breadcrumb,
    tags: ["autodocs"],
    argTypes: {
      data: {
        control: "object",
        description: "Array of breadcrumb items with name and href"
      },
      onClick: { action: "click" }
    }
  });
</script>

<!-- Default example using the snippet template -->
<Story name="Default">
  {#snippet template(args)}
    <Breadcrumb {...args} />
  {/snippet}
</Story>

<!-- Examples using 'args' shorthand -->
<Story
  name="Default Trail"
  args={{
    data: [
      { name: "Home", href: "/" },
      { name: "Category", href: "/category" },
      { name: "Subcategory", href: "/category/sub" },
      { name: "Current Page" }
    ]
  }}
/>

<Story
  name="Two-Level Trail"
  args={{
    data: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Reports" }
    ]
  }}
/>

<Story
  name="Deep Navigation Trail"
  args={{
    data: [
      { name: "Root", href: "/" },
      { name: "Section", href: "/section" },
      { name: "Chapter", href: "/section/chapter" },
      { name: "Topic", href: "/section/chapter/topic" },
      { name: "Details" }
    ]
  }}
/>

<Story
  name="Custom Labels"
  args={{
    data: [
      { name: "Start", href: "/start" },
      { name: "Middle", href: "/middle" },
      { name: "Finish" }
    ]
  }}
/>
