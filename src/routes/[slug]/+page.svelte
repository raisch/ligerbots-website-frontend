<script>
  

  /**
   * @typedef {Object} Props
   * @property {import('./$types').PageData} data
   * @property {any} [title]
   * @property {any} [script]
   * @property {any} [style]
   * @property {any} [content]
   */

  /** @type {Props} */
  let {
    data,
    title = data?.page?.title,
    script = data?.page?.script,
    style = data?.page?.style,
    content = data?.page?.content
  } = $props();
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
