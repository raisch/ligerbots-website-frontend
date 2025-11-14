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
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();

  /** @type {Object|null} */
  let user = $derived({})

  onMount(async () => {
    user = document.cookie.split('; ').find(row => row.startsWith('user='))?.split('=', 1)[1] || sessionStorage.getItem('user')
    // console.log(`layout user:`, user)
  })
</script>

<div id="header-ghost"></div>

<div class="bg-[linear-gradient(to_bottom,white_0%,rgba(0,0,0,0)_40vw),url('/images/background.jpg')] bg-no-repeat bg-cover pb-[130px] h-max w-max z-[-1] absolute">
  <div class="w-[100vw] mx-auto h-full overflow-visible px-0">
    <Masthead />
    <div class="w-full 2xl:w-[1300px] sm:w-[640px] lg:w-[1024px] mx-auto shadow-md shadow-black/30 rounded-t-md">
      <!-- <IconList /> -->
      <div class="xl:max-2xl:-mt-[40px] mt-0">
        {#key user}
          <Navbar />
        {/key}
        <div class="justify-center">
          <div class="w-full overflow-visible">
            <MainPane>
              {@render children?.()}
            </MainPane>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  </div>
</div>
