<script>
  import Masthead from '$lib/components/Masthead.svelte'
  import Navbar from '$lib/components/Navbar.svelte'
  import MainPane from '$lib/components/MainPane.svelte'
  import Footer from '$lib/components/Footer.svelte'

  /** @type {import('./$types').PageServerLoad} */
  // import getSiteConfig from '$lib/server/site'
  // // import getNavbarConfig from '$lib/server/navbar'

  // export async function load({ fetch }) {
  //   const site = await getSiteConfig()
  //   // console.log(
  //   //   `\nin +page.server.js/getSiteConfig, config: ${JSON.stringify(site)}\n`
  //   // )

  //   return { site }
  // }
</script>

<div id="header-ghost"></div>
<div class="container-fluid no-side-padding" id="page-container">
  <div class="col-xs-12 no-side-padding" id="main-column">
    <Masthead />
    <Navbar />
    <MainPane>
      <slot />
    </MainPane>
    <Footer />
  </div>
</div>
