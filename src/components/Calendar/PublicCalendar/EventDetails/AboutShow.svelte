<script>
  import { onMount, onDestroy } from "svelte";
  import XIcon from "./../../../../assets/icons/xicon.png";
  import InstagramIcon from "./../../../../assets/icons/instagram.png";

  export let performers;
  export let ShowImage;
  export let description;

  let activePerformer = null;
  let characterLimit = 100;
  let showFullComponent = false;

  $: validPerformers = performers.filter(
    (performer) =>
      performer.Event.venue.User.performerProfile.profileImage &&
      (performer.Event.venue.User.performerProfile.firstName ||
        performer.Event.venue.User.performerProfile.lastName)
  );

  function togglePerformer(id) {
    if (activePerformer === id) {
      activePerformer = null;
    } else {
      activePerformer = id;
    }
  }

  function toggleComponent() {
    showFullComponent = !showFullComponent;
  }

  function handleClickOutside(event) {
    if (
      !activePerformer ||
      event.target.closest(".bio-card, .performer-card")
    ) {
      return;
    }
    activePerformer = null;
  }

  onMount(() => {
    window.addEventListener("click", handleClickOutside);
  });

  onDestroy(() => {
    window.removeEventListener("click", handleClickOutside);
  });
</script>

<div class="flex flex-col gap-2">
  <h2 class="font-medium text-2xl text-gray-900">About the Show</h2>
  {#if ShowImage}
    <div>
      <img src={ShowImage} alt="" class="rounded-lg object-cover" />
    </div>
  {/if}
  {#if showFullComponent || description.length + performers.reduce((total, performer) => total + performer.Event.venue.User.performerProfile.description.length, 0) <= characterLimit}
    {#if description}
      <p class="text-[16px] text-Text-Tartiary">{description}</p>
    {/if}
    {#if validPerformers.length > 0}
      <div class="py-4">
        <h2 class="font-medium text-2xl text-gray-900">Featuring</h2>
        <div class="flex flex-wrap justify-start gap-5">
          {#each validPerformers as performer, index}
            <div class="relative performer-card">
              {#if activePerformer === performer.ID}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  class="bio-card w-[342px] sm:w-[384px] absolute bg-white rounded-lg p-4 z-30 border border-blue-600 {index ===
                  0
                    ? 'first-child'
                    : ''}"
                  on:click|stopPropagation
                >
                  <div class="arrow {index === 0 ? 'first-arrow' : ''}"></div>

                  <p class="text-sm mb-2">
                    {performer.Event.venue.User.performerProfile.description}
                  </p>
                  <div class="flex gap-2 items-center">
                    <span>Follow {performer.name}:</span>
                    {#if performer.Event.venue.User.performerProfile.instagram}
                      <a
                        href={performer.Event.venue.User.performerProfile
                          .instagram}
                        target="_blank"
                      >
                        <img
                          src={InstagramIcon}
                          alt="Instagram"
                          class="w-8 h-8"
                        />
                      </a>
                    {/if}
                    {#if performer.Event.venue.User.performerProfile.twitter}
                      <a
                        href={performer.Event.venue.User.performerProfile
                          .twitter}
                        target="_blank"
                      >
                        <img src={XIcon} alt="Twitter" class="w-8 h-8" />
                      </a>
                    {/if}
                  </div>
                </div>
              {/if}

              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div
                class="bg-[#FFFFFF] rounded-lg border mt-2 flex flex-col gap-2 p-2 items-center hover:border-[#1C64F2] w-[96px] h-[140px] cursor-pointer performer-card {activePerformer ===
                performer.ID
                  ? 'active'
                  : ''}"
                on:click={() => togglePerformer(performer.ID)}
              >
                <img
                  src={performer.Event.venue.User.performerProfile.profileImage}
                  alt={"Social Image"}
                  class="size-[72px] rounded-[4px]"
                />
                <h3 class="text-[12px] text-[#666C79] text-center">
                  {performer.Event.venue.User.performerProfile.firstName || ""}
                  {performer.Event.venue.User.performerProfile.lastName || ""}
                </h3>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {:else}
    <div class="text-[16px] text-Text-Tartiary">
      {description.slice(0, characterLimit)}...
    </div>
  {/if}

  {#if description.length + performers.reduce((total, performer) => total + performer.Event.venue.User.performerProfile.description.length, 0) > characterLimit}
    <button
      on:click={toggleComponent}
      class="text-brand-Primary text-[16px] font-semibold mt-2 text-left"
    >
      {showFullComponent ? "Show less" : "Show more"}
    </button>
  {/if}
</div>

<style>
  .bio-card {
    transition: all 0.3s ease;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }

  .bio-card.first-child {
    left: 190%;
  }

  .arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    background: white;
    transform: rotate(45deg);
    border-right: 1px solid #007bff;
    border-bottom: 1px solid #007bff;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
  }

  .arrow.first-arrow {
    left: 20%;
  }

  .performer-card.active {
    border-color: #1c64f2;
  }
</style>
