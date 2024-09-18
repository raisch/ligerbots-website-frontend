<script>
  import Footer from "./components/Footer.svelte"
  import MainPane from "./components/MainPane.svelte"
  import Masthead from "./components/Masthead.svelte"
  import Navbar2 from "./components/Navbar2.svelte"

  import { browser } from "$app/environment"
</script>

<div id="header-ghost"></div>

<div class="container-fluid no-side-padding" id="page-container">
  <div class="col-xs-12 no-side-padding">
    <Masthead />
    <Navbar2 />
    <MainPane>
      <slot />
    </MainPane>
    <Footer />
  </div>
</div>
