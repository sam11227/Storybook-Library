<script lang="ts">
  export let variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  export let weight: "bold" | "semibold" | "medium" | "regular";
  export let className: string = "";
  export let slot: string = "";

  const typographyStyles = {
    h1: {
      bold: "text-3xl font-bold",
      semibold: "text-3xl font-semibold",
      medium: "text-3xl font-medium",
      regular: "text-3xl font-normal",
    },
    h2: {
      bold: "text-2xl  font-bold",
      semibold: "text-2xl  font-semibold",
      medium: "text-2xl  font-medium",
      regular: "text-2xl  font-normal",
    },
    h3: {
      bold: "text-xl font-bold",
      semibold: "text-xl font-semibold",
      medium: "text-xl font-medium",
      regular: "text-xl font-normal",
    },
    h4: {
      bold: "text-lg  font-bold",
      semibold: "text-lg  font-semibold",
      medium: "text-lg  font-medium",
      regular: "text-lg  font-normal",
    },
    h5: {
      bold: "text-base font-bold",
      semibold: "text-base font-semibold",
      medium: "text-base font-medium",
      regular: "text-base font-normal",
    },
    h6: {
      bold: "text-xs  font-bold",
      semibold: "text-xs  font-semibold",
      medium: "text-xs  font-medium",
      regular: "text-xs  font-normal",
    },
    p: {
      bold: "text-sm font-bold",
      semibold: "text-sm font-semibold",
      medium: "text-sm font-medium",
      regular: "text-sm font-normal",
    },
  };

  const tagMap: Record<typeof variant, keyof HTMLElementTagNameMap> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    p: "p",
  };

  const Component = tagMap[variant];
  const style = `${typographyStyles[variant][weight]} ${className}`;
</script>

<svelte:element this={Component} class={style}>
  {#if slot}
    {slot}
  {:else}
    <slot />
  {/if}
</svelte:element>
