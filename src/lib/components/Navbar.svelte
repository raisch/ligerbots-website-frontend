<script>
  import LoginIcon from './icons/LoginIcon.svelte'
  import LogoutIcon from './icons/LogoutIcon.svelte'
  import DropDownIcon from './icons/DropDownIcon.svelte'

  import { onMount } from 'svelte'

  import { writable } from "svelte/store";

  let items = [
    { name: "Item 1", count: 0 },
    { name: "Item 2", count: 0 },
    { name: "Item 3", count: 0 }
  ];

  // Make `openDropdown` reactive using Svelte store
  let openDropdown = writable(new Array(items.length).fill(false));

  const handleDropdownClick = (index) => {
    openDropdown.update((state) => {
      state[index] = !state[index]; // Toggle dropdown
      return [...state]; // Return a new array for reactivity
    });
  };

  const handleDropdownFocusLoss = (index) => {
    setTimeout(() => {
      openDropdown.update((state) => {
        state[index] = false;
        return [...state];
      });
    }, 100);
  };
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

<!-- <nav class="text-white font-sans font-bold tracking-[0.03em] text-[13.5pt] navbar-expand-lg navbar-ligerbots bg-[#0066B3] rounded-sm mb-0 min-h-32 shadow-sm relative"> -->
<!--   <div class="max-w-[1200px]" id="navbar-container"> -->
<!--     <div class="navbar-header"> -->
<!--       <button type="button" class="navbar-toggle navbar-toggle-ligerbots" data-target="#myNavbar"> -->
<!--         <span class="icon-bar icon-bar-ligerbots">...</span> -->
<!--         <span class="icon-bar icon-bar-ligerbots"></span> -->
<!--         <span class="icon-bar icon-bar-ligerbots"></span> -->
<!--       </button> -->
<!--     </div> -->
<!--     <div class="collapse navbar-collapse" id="navbar"> -->
<!--       <ul class="nav navbar-nav nav-stacked"> -->
<!--         {#each data.config as elt} -->
<!--           {#if elt.children} -->
<!--             <li class="dropdown"> -->
<!--               <a class="dropdown-toggle" data-toggle="dropdown" href={elt.url}> -->
<!--                 {@html elt.title}<DropDownIcon /> -->
<!--               </a> -->
<!--               <ul class="dropdown-menu"> -->
<!--                 {#each elt.children as child} -->
<!--                   {#if child.requires_login && !data.user} -->
<!--                     <!-- Skip this item -->
<!--                   {:else} -->
<!--                     <li><a href={child.url} data-sveltekit-reload>{@html child.title}</a></li> -->
<!--                     {#if child.divider_after} -->
<!--                       <li role="separator" class="divider"></li> -->
<!--                     {/if} -->
<!--                   {/if} -->
<!--                 {/each} -->
<!--               </ul> -->
<!--             </li> -->
<!--           {:else if elt.requires_login && !data.user} -->
<!--             <!-- Skip this item -->
<!--           {:else} -->
<!--             <li class="active"><a href={elt.url} data-sveltekit-reload>{@html elt.title}</a></li> -->
<!--           {/if} -->
<!--         {/each} -->
<!--         {#if data.user} -->
<!--           <li><a href="/logout" data-sveltekit-reload><LogoutIcon /> Logout</a></li> -->
<!--         {:else} -->
<!--           <li class="active"><a href="/login" data-sveltekit-reload><LoginIcon /> Login</a></li> -->
<!--         {/if} -->
<!--       </ul> -->
<!--     </div> -->
<!--   </div> -->
<!-- </nav> -->

<div class="flex">
  {#each data.config as item, index}
    {#if item.children} 
      <div on:focusout={() => handleDropdownFocusLoss(index)}>
      <button on:click={() => handleDropdownClick(index)}>
        {item.title}
      </button>
      {#if $openDropdown[index]}
        {#each item.children as child}
            <a href={child.url}>{child.title}</a>
        {/each}
    {/if}
    </div>
    {:else} 
      <a href=item.url>{item.title}</a>
    {/if}
  {/each}
</div>

