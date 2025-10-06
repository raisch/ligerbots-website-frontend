
<script>
  import * as DropdownMenu from '$components/components/ui/dropdown-menu'
  import { Button } from '$components/components/ui/button/index.js'
  import LoginIcon from './icons/LoginIcon.svelte'
  import LogoutIcon from './icons/LogoutIcon.svelte'
  import DropDownIcon from './icons/DropDownIcon.svelte'

  import { onMount } from 'svelte'

  import { writable } from "svelte/store";

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

<!-- <nav class="text-white font-sans font-bold tracking-[0.03em] text-[13.5pt] navbar-expand-lg navbar-ligerbots bg-[#0066B3] rounded-sm mb-0 min-h-32"> -->
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

<!--
  I have absolutely no clue why, but the shadow just refused to show up when using Tailwind. So I just put some actual CSS in. 
  I have some choice words for the person who wrote the code for Tailwind's shadows. 
-->

<div class="flex flex-row w-2/3 mx-auto justify-around ligerbots-blue-background h-full pl-[10px] rounded-t-[8px] relative z-50" style="box-shadow: 0 10px 15px -15px #000000"> 
  {#each data.config as item, index}
    <div class="basis-1/12 h-full py-[16px] group transition transition delay-0 duration-150 ease-in-out border-0 hover:bg-[#FFFFFF] ">
      {#if item.children} 
      <DropdownMenu.Root >
      <!--     <DropdownMenu.Trigger class="bg-[#2864ad] hover:bg-white">{item.title}</DropdownMenu.Triggerm -->
        <DropdownMenu.Trigger asChild let:builder>
          <Button variant="navBar" class="text-[#FFFFFF] text-[16px] font-[1000] group-hover:text-[#000000] h-full" builders={[builder]}>
              {item.title} <DropDownIcon /></Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content class="border-0 translate-y-[15px] w-[10%]">
          <DropdownMenu.Group class="rounded-b-xl outline-1 outline-[#C7C7C7]">
            <!-- <div class="flex flex-col"> -->
              {#each item.children as child}
                {#if data.user || !child.requires_login} <!-- This only returns false if there is no user and it requires a login -->
                  <DropdownMenu.Item class="bg-[#FFFFFF] py-[5px] transition delay-0 duration-150 ease-in-out border-0 hover:bg-[#D6D6D6]">
                      <a href={child.url} class="w-full h-full">
                        <Button variant="dropdown" class="w-full text-[16px] font-[Open_Sans]">{child.title}</Button>
                      </a>
                    </DropdownMenu.Item>
                  {#if child.divider_after == true}
                    <DropdownMenu.Separator class="w-full h-5px my-2 flex-none" style="background-color: #FFFFFF" />
                    <DropdownMenu.Separator class="w-full h-2px my-2 flex-none" style="background-color: #D6D6D6" />
                    <DropdownMenu.Separator class="w-full h-5px my-2 flex-none" style="background-color: #FFFFFF" />
                  {/if}
                {/if}
              {/each}
            <!-- </div> -->
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {:else} 
        <a href={item.url} class="w-full py-[16px] h-full">
          <Button variant="navBar" class="h-full text-[#FFFFFF] text-[16px] font-[1000] group-hover:text-[#000000]">{item.title}</Button>
        </a>
      {/if}
    </div>
  {/each}
  {#if data.user}
    <a href="/logout" data-sveltekit-reload class="w-1/8 flex-initial py-[16px] group hover:bg-[#FFFFFF]">
      <Button variant="navBar" class="w-1/2 text-[#FFFFFF] text-[16px] font-[1000] group-hover:text-[#000000]">
        <LogoutIcon /> Logout 
      </Button>
    </a>
    {:else}
    <a href="/login" data-sveltekit-reload class="basis-1/12 shrink flex-initial py-[16px] group hover:bg-[#FFFFFF]">
      <Button variant="navBar" class="w-full text-[#FFFFFF] text-[16px] font-[1000] group-hover:text-[#000000]">

      <LoginIcon /> Login
    </Button>
  </a>

  {/if}
</div>
