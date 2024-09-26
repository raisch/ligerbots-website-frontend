<script>
  import App from '../../App.svelte'

  /** @type {import('./$types').PageData} */
  export let data // = { site: {}, page: { title: 'Page Title', content: '<p>Page Content</p>' } }

  // console.log(`\nin [slug]/+page.svelte, data is:${JSON.stringify(data, null, 2)}\n`)
</script>

<svelte:head>
  <title>{data?.page?.title}</title>
  <meta property="og:title" content={data?.page?.title} />
</svelte:head>

<App>
  <center><div class="notindex-title">{data?.page?.title}</div></center>
  <div class="level4-heading"></div>
  {@html data?.page?.content}
</App>
