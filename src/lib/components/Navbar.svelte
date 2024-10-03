<script>
  import LoginIcon from './icons/LoginIcon.svelte'
  import DropDownIcon from './icons/DropDownIcon.svelte'
  import { onMount } from 'svelte'

  /**
   * @typedef {Object} NavbarConfig
   *
   * @property {string} title
   * @property {string} url
   * @property {NavbarConfig[]} children
   * @property {boolean} divider_after
   */

  let data = {
    /** @type {Array.<NavbarConfig>} */ config: []
  }

  onMount(async () => {
    const res = await fetch('/api/site')
    const site = await res.json()
    data.config = site.navbar_config
  })
</script>

<nav class="navbar navbar-expand-lg navbar-ligerbots">
  <div class="container-fluid" id="navbar-container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle navbar-toggle-ligerbots" data-target="#myNavbar">
        <span class="icon-bar icon-bar-ligerbots">...</span>
        <span class="icon-bar icon-bar-ligerbots"></span>
        <span class="icon-bar icon-bar-ligerbots"></span>
      </button>
    </div>
    <div class="collapse navbar-collapse" id="navbar">
      <ul class="nav navbar-nav nav-stacked">
        {#each data.config as elt}
          {#if elt.children}
            <li class="dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown" href={elt.url}>
                {@html elt.title}<DropDownIcon />
              </a>
              <ul class="dropdown-menu">
                {#each elt.children as child}
                  <li><a href={child.url}>{@html child.title}</a></li>
                  {#if child.divider_after}
                    <li role="separator" class="divider"></li>
                  {/if}
                {/each}
              </ul>
            </li>
          {:else}
            <li class="active"><a href={elt.url}>{@html elt.title}</a></li>
          {/if}
        {/each}
        {#if false}
          <li><a href="/logout"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>
        {:else}
          <!-- <li class="active"><a href="/login"><span class="glyphicon glyphicon-log-in"></span> Login</a></li> -->
          <li class="active"><a href="/login"><LoginIcon /> Login</a></li>
        {/if}
      </ul>
    </div>
  </div>
</nav>
