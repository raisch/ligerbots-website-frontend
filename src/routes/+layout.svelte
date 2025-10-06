<!--
  TODO: Add a Team Links Page 
-->

<script>
  import { getContext, onMount } from 'svelte'
  import Masthead from '$lib/components/Masthead.svelte'
  import IconList from '$lib/components/Icon-List.svelte'
  import Navbar from '$lib/components/Navbar.svelte'
  import MainPane from '$lib/components/MainPane.svelte'
  import Footer from '$lib/components/Footer.svelte'

  /** @type {Object|null} */
  $: user = {}

  onMount(async () => {
    user = sessionStorage.getItem('user')
    // console.log(`layout user:`, user)
  })
</script>

<div id="header-ghost"></div>

<div class="w-full h-full overflow-visible px-0" id="page-container">
  <div class="col-xs-12 w-full px-0 overflow-visible" id="main-column">
    <Masthead />
    <div class="flex justify-center">
    <IconList />
</div>
    {#key user}
      <Navbar />
    {/key}
    <div class="justify-center">
      <div class="w-full overflow-visible">
        <MainPane>
          <slot />
        </MainPane>
      </div>
      <Footer />
    </div>
  </div>
</div>
