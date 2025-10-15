<script>
  import IconList from '$lib/components/Icon-List.svelte'
</script>
<div class="h-min-[10vw] w-[60vw] mx-auto items-center -mb-[5vw] lg:mb-0 mt-[0.5vw]">
  <div class="pb-[15px] grid grid-cols-10 grid-rows-2">
    <a href="/" class="w-full col-span-10 lg:col-span-8">
      <img class="w-full" src="/assets/c632dcdf-27dd-448c-950d-21ec6e97e7ce" alt="masthead text" />
    </a>
    <a href="/" class="w-[10vw] invisible col-span-0 row-span-0 lg:visible lg:col-span-2 lg:row-span-2">
      <img src="/assets/5579e4ad-0648-4819-b917-2ee06be2aad8" alt="logo" />
    </a>
    <div class="col-span-8 -mt-[1vw] lg:mt-[1vw]">
      <IconList />
    </div>
  </div>
</div>
<!-- #masthead -->
