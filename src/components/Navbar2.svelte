<script context="module">
  /** @type {() => Promise<any>} */
  async function getData() {
    const resp = await fetch("/api/navbar")
    return await resp.json()
  }
</script>

{#await getData()}
  <p>...</p>
{:then data}
  <nav class="navbar navbar-ligerbots">
    <div class="container-fluid" id="navbar-container">
      <div class="navbar-header">
        <button
          type="button"
          class="navbar-toggle navbar-toggle-ligerbots"
          data-toggle="collapse"
          data-target="#myNavbar"
        >
          <span class="icon-bar icon-bar-ligerbots"></span>
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
{/await}
