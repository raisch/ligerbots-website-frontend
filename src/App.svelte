<script>
  import Masthead from '$lib/components/Masthead.svelte'
  import Navbar from '$lib/components/Navbar.svelte'
  import MainPane from '$lib/components/MainPane.svelte'
  import Footer from '$lib/components/Footer.svelte'
</script>

<div id="header-ghost"></div>

<div class="container-fluid no-side-padding" id="page-container">
  <div class="col-xs-12 no-side-padding">
    <Masthead />
    <Navbar />
    <MainPane>
      <slot />
    </MainPane>
    <Footer />
  </div>
</div>
