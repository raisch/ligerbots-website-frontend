<script>
  import LoginIcon from './icons/LoginIcon.svelte'
  import LogoutIcon from './icons/LogoutIcon.svelte'
  import DropDownIcon from './icons/DropDownIcon.svelte'

  import { onMount } from 'svelte'

  /**
   * @typedef {Object} NavbarConfig
   *
   * @property {string} title
   * @property {string} url
   * @property {NavbarConfig[]} children
   * @property {boolean} divider_after
   * @property {boolean} requires_login
   */

  /**
   * @typedef {Object} PageData
   *
   * @property {NavbarConfig[]} config
   * @property {import('$lib/server/user').UserRecord} [user]
   */

  /**
   * @type {PageData}
   */
  let data = {
    config: []
  }

  onMount(async () => {
    const res = await fetch('/api/navbar')
    const resp = await res.json()
    // console.log('navbar resp:', resp)
    data.config = resp?.result?.navbar_config || []

    const user = sessionStorage.getItem('user')
    // console.log('user:', user)
    data.user = user ? JSON.parse(user) : null
  })
</script>

<nav class="bg-blue-600 shadow-md rounded-t-lg">
  <div class="container mx-auto px-4" id="navbar-container">
    <div class="flex items-center justify-between">
      <button type="button" class="text-white focus:outline-none" data-target="#myNavbar">
        <span class="block w-6 h-0.5 bg-white mb-1"></span>
        <span class="block w-6 h-0.5 bg-white mb-1"></span>
        <span class="block w-6 h-0.5 bg-white"></span>
      </button>
    </div>
    <div class="hidden w-full md:flex md:items-center md:w-auto" id="navbar">
      <ul class="flex flex-col md:flex-row md:space-x-4">
        {#each data.config as elt}
          {#if elt.children}
            <li class="relative group">
              <a class="text-white hover:text-gray-300" href={elt.url}>
                {@html elt.title}<DropDownIcon />
              </a>
              <ul class="absolute hidden group-hover:block bg-white text-black shadow-lg rounded-lg mt-2">
                {#each elt.children as child}
                  {#if child.requires_login && !data.user}
                    <!-- Skip this item -->
                  {:else}
                    <li><a href={child.url} class="block px-4 py-2 hover:bg-gray-200">{@html child.title}</a></li>
                    {#if child.divider_after}
                      <li class="border-t border-gray-300"></li>
                    {/if}
                  {/if}
                {/each}
              </ul>
            </li>
          {:else if elt.requires_login && !data.user}
            <!-- Skip this item -->
          {:else}
            <li class="active"><a href={elt.url} class="text-white hover:text-gray-300">{@html elt.title}</a></li>
          {/if}
        {/each}
        {#if data.user}
          <li><a href="/logout" class="text-white hover:text-gray-300"><LogoutIcon /> Logout</a></li>
        {:else}
          <li class="active"><a href="/login" class="text-white hover:text-gray-300"><LoginIcon /> Login</a></li>
        {/if}
      </ul>
    </div>
  </div>
</nav>
