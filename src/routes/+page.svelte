<script>
  import MaintenancePane from '$lib/components/MaintenancePane.svelte'

  import UpcomingEventsBlock from '$lib/components/UpcomingEventsBlock.svelte'
  import BlogBlock from '$lib/components/BlogBlock.svelte'
  import AnnouncementsBlock from '$lib/components/AnnouncementsBlock.svelte'
  import TwitterBlock from '$lib/components/TwitterBlock.svelte'
  import BottomRowBlock from '$lib/components/BottomRowBlock.svelte'

  /** @type {import('./$types').PageData} */
  export let data

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
  <div class="row bottom-margin row-margins">
    <BlogBlock />
    <UpcomingEventsBlock />
  </div>

  <div class="row bottom-margin row-margins">
    <AnnouncementsBlock />
    <TwitterBlock />
  </div>

  <div class="row row-margins">
    <div class="col-xs-12">
      <BottomRowBlock />
    </div>
  </div>
{/if}
