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

<div class="flex flex-col items-center">
  <h1 class="text-red-600">Status: {status}</h1>
  <h2 class="mb-[3em]">{title}</h2>
  {#if title == "Page not found"}
    <h3>Whoopsie daisy! It seems that you went somewhere that doesn't exist! That sucks, doesn't it?</h3>
  {:else}
    <h3>Relax! Rest assured that the proper authorities have been notified!</h3>
  {/if}
  <br />
</div>
