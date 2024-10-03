<script>
  import { onMount } from 'svelte'

  onMount(async () => {
    document.cookie = `auth=; path=/; max-age=0; samesite=strict`
    sessionStorage.removeItem('user')
  })
</script>

<center>
  <div id="msg">You have been logged out.</div>
</center>

<style>
  #msg {
    padding: 60px;
  }
</style>
