<script>
  import { Skeleton } from "flowbite-svelte";
</script>

<div class="p-6 bg-white rounded-lg shadow-md h-[568px]">
  <Skeleton class="h-2 p-6 pb-0  w-full mb-1 " />
  <div class="flex gap-2 p-0">
    <Skeleton class="rounded-lg" />
  </div>
  <div class=" gap-5 p-6">
    <Skeleton class="rounded-lg" />
    <Skeleton class="rounded-lg mt-10" />
  </div>
</div>
