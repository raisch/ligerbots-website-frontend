<script>
  import App from "../App.svelte"
  const title = "WHOOPS! Page Not Found"
  const status = 404
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
</svelte:head>

<App>
  <center>
    <h2>Status: {status}</h2>
    <h3>{title}</h3>
    <p>Relax, we assure you that the proper authorities have been notified!</p>
  </center>
</App>
