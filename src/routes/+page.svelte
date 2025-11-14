<script>
  import MaintenancePane from '$lib/components/MaintenancePane.svelte'

  import UpcomingEventsBlock from '$lib/components/UpcomingEventsBlock.svelte'
  import BlogBlock from '$lib/components/BlogBlock.svelte'
  import AnnouncementsBlock from '$lib/components/AnnouncementsBlock.svelte'
  import TwitterBlock from '$lib/components/TwitterBlock.svelte'
  import BottomRowBlock from '$lib/components/BottomRowBlock.svelte'

  
  /**
   * @typedef {Object} Props
   * @property {import('./$types').PageData} data
   */

  /** @type {Props} */
  let { data } = $props();

  // @ts-ignore
  const { title } = data.site || { title: 'UNKNOWN TITLE' }
</script>


<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
</svelte:head>

{#if data.site.service_mode === 'maintenance'}
  <MaintenancePane />
{:else}
  <!-- <div class="flex flex-row bottom-margin row-margins"> -->
  <!--   <BlogBlock /> -->
  <!--   <UpcomingEventsBlock /> -->
  <!-- </div> -->
  <!---->
  <!-- <div class="row bottom-margin row-margins"> -->
  <!--   <AnnouncementsBlock /> -->
  <!--   <TwitterBlock /> -->
  <!-- </div> -->
  <!---->
  <!-- <div class="flex flex-col"> -->
  <!--   <BottomRowBlock /> -->
  <!-- </div> -->

  <div class="bg-white w-full px-[5px] -translate-x-[5px]"> <!-- I have the translation because for some reason the padding was only showing up on the right side-->
    <div class="grid grid-cols-1 w-full lg:grid-cols-2 gap-[40px]">
      <div class="pl-[10px] lg:pl-[40px] h-[625px] lg:h-[575px] 2xl:h-[625px]"><BlogBlock /></div>
      
      <div class="max-lg:pl-[10px] lg:pr-[40px] h-[625px] lg:h-[575px] 2xl:h-[625px]"><UpcomingEventsBlock /></div>
      <div class="pl-[10px] lg:pl-[40px] h-full self-stretch"><AnnouncementsBlock /></div>
      <div class="max-lg:pl-[10px] lg:pr-[40px] h-full self-stretch"><TwitterBlock /></div>
      <div class="col-span-full p-[4px]">
        <BottomRowBlock />
      </div>
    </div>
</div>
{/if}
