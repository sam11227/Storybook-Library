<script>
  export let disclaimer = ` The Crow is located directly behind our favorite restaurant and full bar,
    Birdie G's. If you want to grab a fine dinner there before, we encourage you
    to make a reservation. Birdie G's gives 10% off to performers and ticket
    holders. (Fun Exception: Some shows are dedicated fundraisers for an outside
    organization, in these cases, when set up in advance, the 10% off from
    Birdie G's can be allocated to the specified organization. We
    have a curated selection of fine beer and hard seltzers! They are sourced
    from local brewerys that are owned by females, queer folks, or the BIPOC
    communities! More info can be found at: www.CrowComedy.com
    <br />Safe Space! (Security guards on premises 24/7.) Lineup
    subject to change. <br /><br />The Crow is female/mom/comic owned and
    operated. More about our mission to make the world a better place through
    storytelling, comedy, music, and education can be found here:
    https://www.crowcomedy.com/thecrow`;

  let characterLimit = 400;
  let showFullContent = false;

  function toggleContent() {
    showFullContent = !showFullContent;
  }
</script>

<div class="flex flex-col gap-3">
  <h2 class="font-medium text-2xl text-gray-900">Disclaimer</h2>

  <p class="text-Text-Tartiary text-[16px] font-normal">
    {#if showFullContent || disclaimer.length <= characterLimit}
      {disclaimer}
    {:else}
      {disclaimer.slice(0, characterLimit)}...
    {/if}
  </p>

  {#if disclaimer.length > characterLimit}
    <button
      on:click={toggleContent}
      class="text-brand-Primary text-[16px] font-semibold mt-2 text-left"
    >
      {showFullContent ? "Read less" : "Read more"}
    </button>
  {/if}
</div>
