<!--
  TODO: Fix Logout Icon
-->

<script>
  import * as DropdownMenu from '$components/components/ui/dropdown-menu'
  import * as Collapsible from '$components/components/ui/collapsible'
  import * as Accordion from '$components/components/ui/accordion'
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

<!-- Desktop NavBar -->
<div class="lg:min-w-[1024px] hidden lg:flex flex-row w-2/3 items-center mx-auto justify-around ligerbots-blue-background min-h-[50px] h-[3.25vw] pl-[10px] rounded-t-[8px] relative z-10 font-[Open_Sans]" style="box-shadow: 0 10px 15px -15px #000000"> 
  {#each data.config as item, index}
    <div class="basis-1/12 flex-grow max-w-[7vw] h-full group transition delay-0 duration-150 ease-in-out border-0 hover:bg-[#FFFFFF] cursor-pointer">
      {#if item.children} 
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder class="h-full py-[16px]">
          <Button variant="navBar" class="text-[#FFFFFF] text-[13.5pt] z-12 font-[1000] group-hover:text-[#000000] h-full cursor-pointer flex flex-row items-center" builders={[builder]}>
              {item.title} <DropDownIcon /></Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content class="border-0 w-[10%] shadow-none -mt-[0.5em] -ml-[4px]" align="start">
          <DropdownMenu.Group class="shadow-xs shadow-black/30 overflow-hidden border-0 last:rounded-b-md">
            <!-- <div class="flex flex-col"> -->
              {#each item.children as child, i (child.url)}
                {#if data.user || !child.requires_login} <!-- This only returns false if there is no user and it requires a login -->
                  <a href={child.url} class="w-full h-full no-underline text-left">
                    <DropdownMenu.Item class="-ml-[0.2vw] z-11 relative bg-[#FFFFFF] transition delay-0 duration-150 ease-in-out hover:bg-[#F5F5F5] h-full text-[16px] text-[#000000] font-[Open_Sans] pl-[0.75vw] cursor-pointer">{child.title}</DropdownMenu.Item>
                  </a>
                  {#if child.divider_after == true}
                    <!-- <DropdownMenu.Separator class="w-auto flex-none -my-[1/3px] -mx-[4/3px] bg-white" /> -->
                    <!-- <DropdownMenu.Separator class="w-auto flex-none -my-[1/3px] -mx-[4/3px] bg-[#D6D6D6]" /> -->
                    <!-- <DropdownMenu.Separator class="w-auto flex-none -my-[1/3px] -mx-[4/3px] bg-white" /> -->
                    <DropdownMenu.Separator class="bg-white my-0 py-[2px]"/>
                    <DropdownMenu.Separator class="bg-[#D6D6D6] my-0"/>
                    <DropdownMenu.Separator class="bg-white my-0 py-[2px]"/>
                  {/if}
                {/if}
              {/each}
            <!-- </div> -->
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
    <a href="/logout" data-sveltekit-reload class="basis-1/12 shrink flex-initial pt-[10px] pb-[6px] group hover:bg-[#FFFFFF] h-full">
      <Button variant="navBar" class="w-full text-[#FFFFFF] text-[13.5pt] font-[1000] group-hover:text-[#000000] cursor-pointer h-full">
        <LogoutIcon /> Logout 
      </Button>
    </a>
    {:else}
    <a href="/login" data-sveltekit-reload class="basis-1/12 shrink flex-initial pt-[10px] pb-[6px] group hover:bg-[#FFFFFF] h-full">
      <Button variant="navBar" class="w-full text-[#FFFFFF] text-[13.5pt] font-[1000] group-hover:text-[#000000] cursor-pointer h-full">

      <LoginIcon /> Login
    </Button>
  </a>

  {/if}
</div>

<!-- Mobile NavBar -->
<div class="lg:hidden w-2/3 xs:min-w-[0px] sm:min-w-[640px] mx-auto justify-around ligerbots-blue-background min-h-[50px] pl-[10px] rounded-t-[8px] font-[Open_Sans]" style="box-shadow: 0 10px 15px -15px #000000"> 
  <Collapsible.Root>
    <Collapsible.Trigger class="mr-auto pl-[1vw] text-white">Test</Collapsible.Trigger>
    <Collapsible.Content class="lg:hidden ligerbots-blue-background overflow-visible">
      <Accordion.Root type="single" collapsible>
        <div class="flex flex-col justify-left">
          {#each data.config as item, index}
            <div class="basis-1/12 mr-auto pl-[1vw] py-[16px] transition delay-0 duration-150 ease-in-out border-0 cursor-pointer group">
              {#if item.children} 
                <Accordion.Item value={`item-${index}`} class="py-0 my-0 w-full rounded">
                  <Accordion.Trigger class="w-full">
                    <Button variant="navBar" class="text-white h-full group-hover:text-black focus:text-black w-full mr-auto text-left text-[13.5pt] font-[1000] cursor-pointer group-hover:bg-white focus:bg-white">
                        {item.title} <DropDownIcon />
                    </Button>
                  </Accordion.Trigger>

                  <Accordion.Content class="border-0 shadow-none z-10 text-black rounded absolute h-auto text-[14pt] accordionContent">
                    <div class="flex flex-col justify-evenly">
                      <!-- <DropdownMenu.Group class="shadow-xs shadow-black/30"> -->
                        <!-- <div class="flex flex-col"> -->
                          {#each item.children as child, i (child.url)}
                            {#if data.user || !child.requires_login} <!-- This only returns false if there is no user and it requires a login -->
                              <a href={child.url} class="bg-white w-full no-underline border-gray-500/50 last:rounded-b p-2 transition duration-150 ease-in-out hover:bg-gray-100" class:border-b={child.divider_after}>
                                <!-- <DropdownMenu.Item class="bg-[#FFFFFF] transition delay-0 duration-150 ease-in-out hover:bg-[#D6D6D6] h-full text-[16px] text-[#000000] font-[Open_Sans] pl-[0.75vw] cursor-pointer rounded-[0px] {i === item.children.length - 1 ? 'rounded-b-[0.25vw]' : ''}">{child.title}</DropdownMenu.Item> -->
                                {child.title}
                              </a>
                            {/if}
                          {/each}
                        <!-- </div> -->
                      <!-- </DropdownMenu.Group> -->
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              {:else} 
                <a href={item.url} class="w-full py-[16px] h-full">
                  <Button variant="navBar" class="cursor-pointer h-full text-white text-[13.5pt] font-[1000] group-hover:bg-white group-hover:text-[#000000]">{item.title}</Button>
                </a>
              {/if}
            </div>
          {/each}
        </div>
      </Accordion.Root>
      <!-- <Accordion.Root type="single" class="overflow-hidden" collapsible> -->
      <!--   <Accordion.Item value="item-1"> -->
      <!--     <Accordion.Trigger>Section 1</Accordion.Trigger> -->
      <!--     <Accordion.Content> -->
      <!--       <p>This is the content for section 1.</p> -->
      <!--     </Accordion.Content> -->
      <!--   </Accordion.Item> -->
      <!---->
      <!--   <Accordion.Item value="item-2"> -->
      <!--     <Accordion.Trigger>Section 2</Accordion.Trigger> -->
      <!--     <Accordion.Content> -->
      <!--       <p>This is the content for section 2.</p> -->
      <!--     </Accordion.Content> -->
      <!--   </Accordion.Item> -->
      <!---->
      <!--   <div class="object-contain flex flex-col justify-left w-auto"> -->
      <!--     <Button class="w-[10vw]" on:click={() => alert("Clicked!")}> -->
      <!--       Simple Button -->
      <!--     </Button> -->
      <!--   </div> -->
      <!-- </Accordion.Root> -->
      {#if data.user}
        <a href="/logout" data-sveltekit-reload class="w-1/8 flex-initial py-[16px] group hover:bg-[#FFFFFF]">
          <Button variant="navBar" class="w-1/2 text-[#000000] text-[13.5pt] font-[1000] group-hover:text-[#000000] cursor-pointer">
            <LogoutIcon /> Logout 
          </Button>
        </a>
        {:else}
        <a href="/login" data-sveltekit-reload class="basis-1/12 shrink flex-initial pt-[10px] pb-[6px] group hover:bg-[#FFFFFF]">
          <Button variant="navBar" class="w-full text-[#000000] text-[13.5pt] font-[1000] group-hover:text-[#000000] cursor-pointer">

          <LoginIcon /> Login
        </Button>
      </a>

      {/if}
    </Collapsible.Content>
  </Collapsible.Root>
</div>
