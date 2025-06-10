<script>
  import NotificationGroup from "./NotificationGroup.svelte";

  export let notifications = [];
</script>

<div
  class="bg-white shadow max-w-lg mx-auto rounded-[16px] border border-gray-100"
>
  <div class="p-5 flex justify-between items-center">
    <h2 class="text-[20px] font-[400] text-Text-Primary leading-[30px]">
      Notifications
    </h2>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a
      href="/notifications"
      class="text-[#0284FE] text-sm font-medium leading-[14px] hover:no-underline"
      >Show all</a
    >
  </div>

  <NotificationGroup {notifications} />
</div>
