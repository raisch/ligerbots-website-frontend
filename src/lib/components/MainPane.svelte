<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<div class="flex flex-row justify-center" id="main-pane">
  <div class="w-full 2xl:w-[1300px] sm:w-[640px] lg:w-[1024px] flex-none px-[5px] pt-[40px] bg-[#FFFFFF] overflow-visible">
    <div class="w-full">
      {@render children?.()}
    </div>
  </div>
</div>
