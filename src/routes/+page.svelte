<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<svelte:head>
  <title>{data.global.title}</title>
  <meta property="og:title" content="{data.global.title}" />
</svelte:head>

<h1>{data.global.title}</h1>

<p>{@html data.global.description}</p>

<h2>DANGER! This is a WORK IN PROGRESS</h2>

<p>If you expect it to work with complete fidelity to <a href="http://ligerbots.org" target=_blank>ligerbots.org</a>,
   you will be disappointed.</p>

<p>But if you want to see how it's done, or even help out, you're in the right place.</p>

<style>
  h2 {
    color: red;
  }
</style>
