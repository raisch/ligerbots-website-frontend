<script>
  import { page } from '$app/stores'

  const DEFAULT_MAINTENANCE_PAGE_TITLE = 'Site Maintenance'
  const DEFAULT_MAINTENANCE_PAGE_BODY = 'The site is currently undergoing maintenance. Please check back later.'

  const config = $page?.data?.site || $page?.data || {}

  if (!config) {
    console.error('ERROR: in Navbar.svelte, config not found')
  }

  config.maintenance_page_title = config.maintenance_page_title || DEFAULT_MAINTENANCE_PAGE_TITLE
  config.maintenance_page_body = config.maintenance_page_body || DEFAULT_MAINTENANCE_PAGE_BODY

  // /** @type {import('../../routes/$types').PageData} */
  export let data = config
</script>

<div class="row row-margins">
  <div class="col-xs-12">
    <div class="panel panel-warning">
      <div class="panel-heading">
        <h1 class="maintenance-alert">{data.maintenance_page_title}</h1>
      </div>
      <div class="panel-body maintenance-body">
        {@html data.maintenance_page_body}
      </div>
    </div>
  </div>
</div>

<style>
  .maintenance-alert {
    color: red;
  }
  .maintenance-body {
    color: darkred;
  }
</style>
