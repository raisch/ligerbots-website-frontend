<script>
  import * as DropdownMenu from '$components/components/ui/dropdown-menu'
  import * as Collapsible from '$components/components/ui/collapsible'
  import * as Accordion from '$components/components/ui/accordion'
  import { Button } from '$components/components/ui/button/index.js'
  import LoginIcon from './icons/LoginIcon.svelte'
  import LogoutIcon from './icons/LogoutIcon.svelte'
  import DropDownIcon from './icons/DropDownIcon.svelte'
  import MobileNavbarTrigger from './icons/MobileNavbarTrigger.svelte'

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

<!-- Desktop NavBar -->
<div class="2xl:w-[1300px] lg:w-[1024px] hidden lg:flex flex-row items-center mx-auto justify-around ligerbots-blue-background min-h-[50px] h-[30px] pl-[10px] rounded-t-[8px] relative z-10 font-[Open_Sans]" style="box-shadow: 0 10px 15px -15px #000000"> 
  {#each data.config as item, index}
    <div class="max-w-[7vw] h-full group transition delay-0 duration-150 ease-in-out border-0 hover:bg-[#FFFFFF] cursor-pointer">
      {#if item.children} 
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder class="h-full py-[16px]">
          <Button variant="navBar" class="text-[#FFFFFF] text-[13.5pt] z-12 font-[1000] group-hover:text-[#000000] h-full cursor-pointer flex flex-row items-center" builders={[builder]}>
              {item.title} <DropDownIcon /></Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content class="border-0 w-[10%] shadow-none -mt-[0.5em] -ml-[4px]" align="start">
          <DropdownMenu.Group class="shadow-xs shadow-black/30 overflow-hidden border-0 last:rounded-b-md">
            {#each item.children as child, i (child.url)}
              {#if data.user || !child.requires_login} <!-- This only returns false if there is no user and it requires a login -->
                <a href={child.url} class="w-full h-full no-underline text-left">
                  <DropdownMenu.Item class="-ml-[0.2vw] z-11 relative bg-[#FFFFFF] transition delay-0 duration-150 ease-in-out hover:bg-[#F5F5F5] h-full text-[16px] text-[#000000] font-[Open_Sans] pl-[0.75vw] cursor-pointer">{child.title}</DropdownMenu.Item>
                </a>
                {#if child.divider_after == true}
                  <DropdownMenu.Separator class="bg-white my-0 py-[2px]"/>
                  <DropdownMenu.Separator class="bg-[#D6D6D6] my-0"/>
                  <DropdownMenu.Separator class="bg-white my-0 py-[2px]"/>
                {/if}
              {/if}
            {/each}
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {:else} 
        <a href={item.url} class="w-full py-[16px] h-full">
          <Button variant="navBar" class="cursor-pointer h-full text-[#FFFFFF] text-[13.5pt] font-[1000] group-hover:text-[#000000] flex flex-row items-center">{item.title}</Button>
        </a>
      {/if}
    </div>
  {/each}
  {#if data.user}
    <a href="/logout" data-sveltekit-reload class="basis-1/12 shrink flex-initial pt-[10px] pb-[6px] group transition duration-150 ease-in-out hover:bg-[#FFFFFF] h-full">
      <Button variant="navBar" class="w-full text-[#FFFFFF] text-[13.5pt] font-[1000] transition duration-150 ease-in-out group-hover:text-[#000000] cursor-pointer h-full">
        <LogoutIcon /> Logout 
      </Button>
    </a>
    {:else}
    <a href="/login" data-sveltekit-reload class="basis-1/12 shrink flex-initial transition duration-150 ease-in-out pt-[10px] pb-[6px] group hover:bg-[#FFFFFF] h-full">
      <Button variant="navBar" class="w-full text-[#FFFFFF] text-[13.5pt] font-[1000] transition duration-150 ease-in-out group-hover:text-[#000000] cursor-pointer h-full">

      <LoginIcon /> Login
    </Button>
  </a>

  {/if}
</div>

<!-- Mobile NavBar -->
<div class="lg:hidden xs:min-w-[0px] sm:w-[640px] xs:w-2/3 mx-auto justify-around ligerbots-blue-background min-h-[50px] pl-[10px] rounded-t-[8px] font-[Open_Sans]" style="box-shadow: 0 10px 15px -15px #000000"> 
  <Collapsible.Root>
    <Collapsible.Trigger class="mr-auto p-[10px] text-white cursor-pointer h-[50px]"><MobileNavbarTrigger size="30px" /></Collapsible.Trigger>
    <Collapsible.Content class="lg:hidden ligerbots-blue-background overflow-visible">
      <Accordion.Root type="single" collapsible>
        <div class="flex flex-col justify-left gap-0 [&_*]:rounded-none [&_*]:!no-underline">
          {#each data.config as item, index}
            {#if item.children} 
              <Accordion.Item value={`item-${index}`} class="py-0 my-0 w-full group h-auto transition ease-in-out duration-300">
                <Accordion.Trigger class="w-full h-[20px] cursor-pointer transition ease-in-out duration-300 focus-within:bg-white hover:bg-white focus-within:[&_*]:text-black">
                  <Button variant="navBar" class="h-[20px] text-white group-hover:text-black focus:text-black text-[13.5pt] font-[1000] w-fit cursor-pointer text-left mr-auto [&_*]:!no-underline transition ease-in-out duration-300">
                      {item.title} <DropDownIcon />
                  </Button>
                </Accordion.Trigger>

                <Accordion.Content class="border-0 shadow-none z-10 h-auto text-[14pt] absolute">
                  <div class="flex flex-col justify-evenly -mr-[10px] bg-white w-[150px] border-gray-500 border-1">
                    {#each item.children as child, i (child.url)}
                      {#if data.user || !child.requires_login} <!-- This only returns false if there is no user and it requires a login -->
                        <a href={child.url} class="text-black pl-[20px] w-full text-left no-underline border-gray-500/50 p-1 transition ease-in-out duration-300 hover:bg-gray-200 last:rounded-b-md">
                          {child.title}
                        </a>
                      {/if}
                    {/each}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            {:else} 
              <a href="{item.url}" class="w-full group h-[20px] hover:bg-white transition ease-in-out duration-300 py-[16px] flex flex-col justify-center">
                <Button variant="navBar" class="cursor-pointer w-fit mr-auto h-full text-white text-[13.5pt] font-[1000] group-hover:text-black transition ease-in-out duration-300">
                  {item.title} 
                </Button>
              </a>
              <!-- <a href={item.url} class="w-full py-[16px] h-[20px] group"> -->
              <!--   <Button variant="navBar" class="cursor-pointer h-full text-white text-[13.5pt] font-[1000] group-hover:bg-white group-hover:text-[#000000]">{item.title}</Button> -->
              <!-- </a> -->
            {/if}
          {/each}
          {#if data.user}
            <a href="/logout" class="w-full group h-[20px] hover:bg-white transition ease-in-out duration-300 py-[16px] flex flex-col justify-center mb-[5px]">
              <Button variant="navBar" class="cursor-pointer w-fit mr-auto h-full text-white text-[13.5pt] font-[1000] group-hover:text-black transition ease-in-out duration-300">
                <LogoutIcon /> Logout 
              </Button>
            </a>
            {:else}
              <a href="/login" class="w-full group h-[20px] hover:bg-white transition ease-in-out duration-300 py-[16px] flex flex-col justify-center mb-[5px]">
                <Button variant="navBar" class="cursor-pointer w-fit mr-auto h-full text-white text-[13.5pt] font-[1000] group-hover:text-black transition ease-in-out duration-300">
                  <LoginIcon /> Login
                </Button>
              </a>
          {/if}
        </div>
      </Accordion.Root>
    </Collapsible.Content>
  </Collapsible.Root>
</div>
