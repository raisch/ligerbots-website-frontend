<script>
  import { getContext, onMount } from 'svelte'
  import Masthead from '$lib/components/Masthead.svelte'
  import Navbar from '$lib/components/Navbar.svelte'
  import MainPane from '$lib/components/MainPane.svelte'
  import Footer from '$lib/components/Footer.svelte'

  /** @type {Object|null} */
  $: user = {}

  onMount(async () => {
    user = document.cookie.split('; ').find(row => row.startsWith('user='))?.split('=', 1)[1] || sessionStorage.getItem('user')
    // console.log(`layout user:`, user)
  })
</script>

<div id="header-ghost"><!-- provides white-to-transparent shading at top of page --></div>
<div class="container-fluid no-side-padding" id="page-container">
  <div class="col-xs-12 no-side-padding" id="main-column">
    <Masthead />
    {#key user}
      <Navbar />
    {/key}
    <MainPane>
      <slot />
    </MainPane>
    <Footer />
  </div>
</div>
