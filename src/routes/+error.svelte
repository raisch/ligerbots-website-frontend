<script>
  import { beforeUpdate } from 'svelte'
  import { page } from '$app/stores'

  /**
   * @typedef {Object} PageData
   * @property {import('../lib/server/site').SiteConfig} site
   */

  /** @type {PageData} */
  export let data

  // console.log(`\nin +error.svelte, page: ${JSON.stringify($page, null, 2)}\n`)

  const title = $page?.error?.message || 'An error has occurred.'
  const status = $page.status

  beforeUpdate(async () => {
    if (!data.site) {
      const res = await fetch('/api/site')
      const site = await res.json()
      console.log(`\nin +error.svelte: load: site: ${JSON.stringify(site)}\n`)
      data = { ...data, site }
      console.log(`\nin +error.svelte: onMount: data: ${JSON.stringify(data, null, 2)}\n`)
    }
  })
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
</svelte:head>

<center>
  <h1>Status: {status}</h1>
  <h2>{title}</h2>
  <h3>Relax! Rest assured that the proper authorities have been notified!</h3>
</center>

<style>
  h2 {
    color: red;
  }
  h3 {
    margin: 3em;
  }
</style>
