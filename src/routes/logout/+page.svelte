<script>
  import { onMount } from 'svelte'

  const title = 'LigerBots Logout'

  onMount(async () => {
    document.cookie = `auth=; path=/; max-age=0; samesite=strict`
    sessionStorage.removeItem('user')
    document.cookie = `user=; path=/; max-age=0; samesite=strict`
  })
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
</svelte:head>

<center>
  <div id="msg">You have been logged out.</div>
</center>

<style>
  #msg {
    font-size: 24px;
    padding: 60px;
  }
</style>
