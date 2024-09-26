<script>
  import { page } from '$app/stores'

  // console.log(`\nin Navbar.svelte: page: ${JSON.stringify($page)}\n`)

  const config = Array.isArray($page?.data?.site?.navbar_config)
    ? $page?.data?.site?.navbar_config
    : $page?.data?.navbar_config || []

  if (!config) {
    console.error('Navbar.svelte: config not found in $page?.data?.navbar_config')
  }
  // console.log(`\nin Navbar.svelte, navbar_definition: ${JSON.stringify(config)}\n`)

  // /** @type {import('../../routes/$types').PageData} */
  export let data = config
</script>

<nav class="navbar navbar-ligerbots">
  <div class="container-fluid" id="navbar-container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle navbar-toggle-ligerbots" data-target="#myNavbar">
        <span class="icon-bar icon-bar-ligerbots">...</span>
        <span class="icon-bar icon-bar-ligerbots"></span>
        <span class="icon-bar icon-bar-ligerbots"></span>
      </button>
    </div>
    <div class="collapse navbar-collapse" id="navbar2">
      <ul class="nav navbar-nav nav-stacked">
        {#each data as elt}
          {#if elt.children}
            <li class="dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown" href={elt.url}>
                {@html elt.title}
                <span class="caret"></span>
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
      </ul>
    </div>
  </div>
</nav>
