<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { classNames } from "../../utils/utils.js";
  import CancelIcon from "../../assets/icons/cancel-circle.svg";

  const dispatch = createEventDispatcher();

  export let size: "small" | "medium" | "large" | "" = "";
  export let className: string = "";
  export let icon: string = "";
  export let textColor: string = "";
  export let bgColor: string = "";
  export let status: "success" | "warning" | "danger" | "" = "";
  export let noBorder: boolean = false;
  export let tier: 1 | 2 | 3 | 4 | 5 | null = null;
  export let tierVariation: "red" | "purple" | null = null;
  export let event: "squareEvent" | "circleEvent" | null = null;
  export let eventTextColor: string = "";
  export let eventBgColor: string = "";
  export let dismissable: boolean = false;
  export let label: string = "";

  let visible = true;

  const sizeClass = (() => {
    switch (size) {
      case "small":
        return "px-[2px] text-[7px] leading-[7px] rounded-[4px] font-medium";
      case "medium":
        return "px-[8.5px] py-[2px] text-[10px] leading-[14px] font-semibold rounded-[6px]";
      case "large":
        return "px-[15.5px] py-[6px] text-sm leading-[14px] font-medium rounded-[6px]";
      default:
        return "";
    }
  })();

  const statusStyles = (() => {
    switch (status) {
      case "success":
        return {
          textColor: "#15A033",
          bgColor: "rgba(21, 160, 51, 0.15)",
          statusClass: "success-class",
        };
      case "warning":
        return {
          textColor: "rgba(255, 146, 46, 1)",
          bgColor: "rgba(255, 146, 46, 0.15)",
          statusClass: "warning-class",
        };
      case "danger":
        return {
          textColor: "rgba(255, 102, 102, 1)",
          bgColor: "rgba(255, 102, 102, 0.15)",
          statusClass: "danger-class",
        };
      default:
        return { textColor, bgColor, statusClass: "" };
    }
  })();

  const tierStyles = (() => {
    if (tier === null) return { textColor, bgColor, tierClass: "" };

    const baseClass =
      "rounded-md font-semibold flex justify-center items-center w-6 h-[22px]";

    switch (tier) {
      case 1:
        if (tierVariation === "red") {
          return {
            textColor: "#f66",
            bgColor: "rgba(255, 102, 102, 0.15)",
            tierClass: baseClass,
          };
        }
        return {
          textColor: "rgba(108, 43, 217, 1)",
          bgColor: "rgba(108, 43, 217, 0.15)",
          tierClass: baseClass,
        };
      case 2:
        return {
          textColor: "rgba(255, 146, 46, 1)",
          bgColor: "rgba(255, 146, 46, 0.15)",
          tierClass: baseClass,
        };
      case 3:
        return {
          textColor: "rgba(2, 132, 254, 1)",
          bgColor: "rgba(2, 132, 254, 0.15)",
          tierClass: baseClass,
        };
      case 4:
        return {
          textColor: "rgba(21, 160, 51, 1)",
          bgColor: "rgba(21, 160, 51, 0.15)",
          tierClass: baseClass,
        };
      case 5:
        return {
          textColor: "rgba(255, 102, 102, 1)",
          bgColor: "rgba(255, 102, 102, 0.15)",
          tierClass: baseClass,
        };
    }
  })();

  const eventStyles = (() => {
    switch (event) {
      case "squareEvent":
        return {
          textColor: eventTextColor || "rgba(37, 43, 55, 1)",
          bgColor: eventBgColor || "rgba(2, 132, 254, 0.5)",
          eventClass: "square-event",
        };
      case "circleEvent":
        return {
          textColor: eventTextColor || "#000000",
          bgColor: eventBgColor || "#add8e6",
          eventClass: "circle-event",
        };
      default:
        return { textColor, bgColor, eventClass: "" };
    }
  })();

  const finalBgColor = noBorder
    ? "transparent"
    : event
    ? eventStyles.bgColor
    : tier
    ? tierStyles.bgColor
    : statusStyles.bgColor;

  const finalTextColor = event
    ? eventStyles.textColor
    : tier
    ? tierStyles.textColor
    : statusStyles.textColor;

  const finalClass = classNames(
    event
      ? eventStyles.eventClass
      : tier
      ? tierStyles.tierClass
      : statusStyles.statusClass,
    noBorder ? "border-none" : ""
  );

  function handleDismiss(event: MouseEvent) {
    event.stopPropagation();
    visible = false;
    dispatch("dismiss", event);
  }
</script>

{#if visible}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class={classNames(
      "cursor-pointer gap-1 inline-flex items-center",
      sizeClass,
      className,
      finalClass
    )}
    style="color: {finalTextColor}; background-color: {finalBgColor};"
    on:click={() => dispatch("click")}
  >
    {#if icon}
      <img src={icon} alt="Badge Icon" />
    {/if}

    {#if dismissable}
      <button class="dismiss-button" on:click={handleDismiss}>
        <img src={CancelIcon} alt="Dismiss Icon" />
      </button>
    {/if}

    {#if label}
      {@html label}
    {:else}
      <slot />
    {/if}
  </div>
{/if}

<style>
  .square-event {
    padding: 4px;
    gap: 4px;
    border-radius: 4px;
    border: 0.8px solid rgba(2, 132, 254, 0.5);
    box-shadow:
      0px 20px 6px rgba(0, 0, 0, 0),
      0px 13px 5px rgba(0, 0, 0, 0.02),
      0px 7px 4px rgba(0, 0, 0, 0.08),
      0px 3px 3px rgba(0, 0, 0, 0.14),
      0px 1px 2px rgba(0, 0, 0, 0.16);
    font-size: 14px;
    font-weight: 400;
  }

  .circle-event {
    padding: 4px;
    gap: 4px;
    border-radius: 9999px;
    font-size: 14px;
    font-weight: 600;
  }

  .dismiss-button {
    background: none;
    border: none;
    margin-left: 4px;
    cursor: pointer;
  }

  @media (max-width: 640px) {
    .square-event,
    .circle-event {
      padding: 2px;
      font-size: 8px;
      font-weight: 500;
    }
  }
</style>
