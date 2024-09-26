<script>
  import App from '../App.svelte'
  import MaintenancePane from '$lib/components/MaintenancePane.svelte'
  import UpcomingEventsBlock from '$lib/components/UpcomingEventsBlock.svelte'
  import BlogBlock from '$lib/components/BlogBlock.svelte'
  import AnnouncementsBlock from '$lib/components/AnnouncementsBlock.svelte'
  import TwitterBlock from '$lib/components/TwitterBlock.svelte'

  /** @type {import('./$types').PageData} */
  export let data

  // @ts-ignore
  const { title } = data.site || { title: 'UNKNOWN TITLE' }
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
</svelte:head>

<App>
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
        <div class="panel panel-brag">
          <!-- svelte-ignore a11y-img-redundant-alt -->
          <img
            src="http://ligerbots.4msg.net:8055/assets/2eb80fd3-8541-415d-9333-6b98f5fa1fb5"
            alt="LigerBots Team Photo 2022"
          />
        </div>
        <div style="text-align:center;">
          <div class="label-blue">
            <a href="https://www.flickr.com/photos/ligerbots/albums/72157712218381043" target="_blank">The LigerBots</a>
          </div>
        </div>
      </div>
    </div>
  {/if}
</App>
