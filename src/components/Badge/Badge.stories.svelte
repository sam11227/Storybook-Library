<script context="module">
  import { Story, Template } from "@storybook/addon-svelte-csf";

  import userIcon from "./../../assets/svg/edit-user-02.svg";
  import successIcon from "./../../assets/icons/Vector.svg";
  import pinIcon from "./../../assets/icons/Subtract.svg";
  import crossIcon from "./../../assets/icons/cross.svg";
  import dotIcon from "./../../assets/icons/Ellipse68.svg";
  import dotBrandIcon from "./../../assets/icons/Ellipsebrand.svg";
  import Badge from "./Badge.svelte";

  export const meta = {
    title: "Components/Badge",
    component: Badge,
    argTypes: {
      type: { control: "text" },
      size: { control: "text" },
      label: { control: "text" },
    },
  };

  function handleAlert() {
    alert("Hii, This is Function Alert");
  }
</script>

<Template let:args>
  <Badge on:click={handleAlert} {...args} />
</Template>

<Story
  name="Small Badges"
  args={{
    label: "Headliner",
    textColor: "white",
    size: "small",
    className: "bg-[#f66]",
  }}
/>

<Story
  name="Medium Badges"
  args={{
    label: "Headliner",
    textColor: "white",
    size: "medium",
    className: "bg-[#f66]",
  }}
/>

<Story
  name="Large Badges"
  args={{
    label: "Headliner",
    textColor: "white",
    size: "large",
    className: "bg-[#f66]",
  }}
/>

<Story
  name="Position with Icon"
  args={{
    label: "Invited",
    size: "large",
    textColor: "#666C79",
    bgColor: "#F7F8FA",
    className: "",
    icon: userIcon,
  }}
/>

<Story
  name="Success Badge"
  args={{
    label: "Success",
    size: "large",
    status: "success",
    icon: successIcon,
  }}
/>

<Story
  name="Warning Badge"
  args={{
    label: "Pinned",
    size: "large",
    status: "warning",
    icon: pinIcon,
  }}
/>

<Story
  name="Danger Badge"
  args={{
    label: "Declined",
    size: "large",
    status: "danger",
    icon: crossIcon,
  }}
/>

<Story
  name="No Border Badge"
  args={{
    label: "No Border",
    size: "medium",
    status: "warning",
    icon: dotIcon,
    noBorder: true,
  }}
/>  

<Story
  name="Tier 1 Badge red"
  args={{
    label: "Tier 1",
    tier: 1,
    tierVariation: "red",
  }}
/>

<Story
  name="Tier 1 Badge Violet"
  args={{
    label: "Tier 1",
    tier: 1,
  }}
/>

<Story
  name="Tier 2 Badge"
  args={{
    label: "Tier 2",
    tier: 2,
  }}
/>

<Story
  name="Tier 3 Badge"
  args={{
    label: "Tier 3",
    tier: 3,
  }}
/>

<Story
  name="Tier 4 Badge"
  args={{
    label: "Tier 1",
    tier: 4,
  }}
/>

<Story
  name="Tier 5 Badge"
  args={{
    label: "Tier 1",
    tier: 5,
  }}
/>

<Story
  name="Event Badge"
  args={{
    label: "10:30 Tuesday June 20, 2024",
    size: "large",
    event: "squareEvent",
    eventBgColor: "#ffffff",
  }}
/>

<Story
  name="Event Circle Badge"
  args={{
    label: "10:30 Tuesday June 20, 2024",
    size: "large",
    event: "circleEvent",
    eventTextColor: "rgba(2, 132, 254, 1)",
    eventBgColor: "rgba(2, 132, 254, 0.15)",
    icon: dotBrandIcon,
  }}
/>