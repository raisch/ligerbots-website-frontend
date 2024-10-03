<script>
  /** @type {import('./$types').PageData} */
  export let data

  export let title = data?.page?.title
  export let script = data?.page?.script
  export let style = data?.page?.style
  export let content = data?.page?.content
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
</svelte:head>

<center><div class="notindex-title">{title}</div></center>
<div class="level4-heading"></div>
{#if script}
  {@html script}
{/if}
{#if style}
  {@html style}
{/if}
{@html content}
