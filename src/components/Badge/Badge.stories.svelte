<script context="module" lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Badge from "./Badge.svelte";

  import userIcon from "../../assets/svg/edit-user-02.svg";
  import successIcon from "../../assets/icons/Vector.svg";
  import pinIcon from "../../assets/icons/Subtract.svg";
  import crossIcon from "../../assets/icons/cross.svg";
  import dotIcon from "../../assets/icons/Ellipse68.svg";
  import dotBrandIcon from "../../assets/icons/Ellipsebrand.svg";

  const { Story } = defineMeta({
    title: "Components/Badge",
    tags: ["autodocs"],
    component: Badge,
    argTypes: {
      size: { control: "select", options: ["small", "medium", "large"] },
      className: { control: "text" },
      icon: { control: "text" },
      textColor: { control: "color" },
      bgColor: { control: "color" },
      status: { control: "select", options: ["success", "warning", "danger"] },
      noBorder: { control: "boolean" },
      tier: { control: "number" },
      tierVariation: { control: "select", options: ["red", "purple"] },
      event: { control: "select", options: ["squareEvent", "circleEvent"] },
      eventTextColor: { control: "color" },
      eventBgColor: { control: "color" },
      label: { control: "text" }
    }
  });

  function handleAlert() {
    alert("Hi, this is an alert from a clickable badge.");
  }
</script>

 <Story name="Default">
  {#snippet template(args)}
   <Badge on:click={handleAlert} {...args}>
    {args.label}
  </Badge>
  {/snippet}
</Story>

<Story name="Small Badge" args={{ label: "Headliner", size: "small", textColor: "white", className: "bg-[#f66]" }} />
<Story name="Medium Badge" args={{ label: "Headliner", size: "medium", textColor: "white", className: "bg-[#f66]" }} />
<Story name="Large Badge" args={{ label: "Headliner", size: "large", textColor: "white", className: "bg-[#f66]" }} />

<Story name="Success Badge" args={{ label: "Success", size: "large", status: "success", icon: successIcon }} />
<Story name="Warning Badge" args={{ label: "Pinned", size: "large", status: "warning", icon: pinIcon }} />
<Story name="Danger Badge" args={{ label: "Declined", size: "large", status: "danger", icon: crossIcon }} />

<Story name="With Icon" args={{ label: "Invited", size: "large", textColor: "#666C79", bgColor: "#F7F8FA", icon: userIcon }} />

<Story name="No Border" args={{ label: "No Border", size: "medium", status: "warning", icon: dotIcon, noBorder: true }} />

<Story name="Tier 1 (Red)" args={{ label: "1", tier: 1, tierVariation: "red" }} />
<Story name="Tier 1 (Purple)" args={{ label: "1", tier: 1 }} />
<Story name="Tier 2" args={{ label: "2", tier: 2 }} />
<Story name="Tier 3" args={{ label: "3", tier: 3 }} />
<Story name="Tier 4" args={{ label: "4", tier: 4 }} />
<Story name="Tier 5" args={{ label: "5", tier: 5 }} />

<Story name="Event Square" args={{ label: "10:30 Tuesday June 20, 2024", size: "large", event: "squareEvent", eventBgColor: "#ffffff" }} />
<Story name="Event Circle" args={{ label: "10:30 Tuesday June 20, 2024", size: "large", event: "circleEvent", eventTextColor: "rgba(2, 132, 254, 1)", eventBgColor: "rgba(2, 132, 254, 0.15)", icon: dotBrandIcon }} />


<Story name="Clickable Badge" args={{ label: "Click me", size: "large", status: "danger" }} />
