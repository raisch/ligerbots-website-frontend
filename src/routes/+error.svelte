<script>
  import { beforeUpdate } from 'svelte'
  import { page } from '$app/stores'

  /**
   * @typedef {Object} PageData
   * @property {import('../lib/server/site').SiteConfig} [site]
   */

  /** @type {PageData} */
  export let data = {}

  const title = $page?.error?.message || 'An error has occurred.'
  const status = $page.status

  beforeUpdate(async () => {
    if (!data.site) {
      try {
        const res = await fetch('/api/site')
        const site = await res.json()
        data = { ...data, site }
      } catch (err) {
        console.error(`\nin +error.svelte: onMount: fetch('/api/site'): ${err}\n`)
      }
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
