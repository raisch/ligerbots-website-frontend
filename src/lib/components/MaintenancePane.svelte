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

<div class="flex flex-col space-y-4">
  <div class="w-full">
    <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-lg">
      <div class="bg-yellow-200 text-yellow-800 font-bold p-2 rounded-t-lg">
        <h1 class="text-red-600">{data.maintenance_page_title}</h1>
      </div>
      <div class="p-4 text-darkred">
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
