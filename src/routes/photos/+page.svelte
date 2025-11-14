<script>
  import Debug from '$lib/debugging'
  import * as DropdownMenu from '$components/components/ui/dropdown-menu'

  // TODO: Add these two constants into Directus?
  const years = ['2024/25', '2023/24', '2022/23', '2021/22', '2020/21', '2019/20', '2018/19', '2017/18', '2016/17', '2015/16', '2014/15', '2013/14', '2012/13', '2011/12', '2010/11', '2009/10', '2008/9']
  const seasons = [ "Reefscape", "Crescendo", "Charged Up", "Rapid React", "Infinite Recharge", "Infinite Recharge", "Destination: Deep Space", "First Power Up", "First Steamworks", "First Stronghold", "Recycle Rush", "Aerial Assist", "Ultimate Ascent", "Rebound Rumble", "Logomotion", "Breakaway", "Lunacy", "Overdrive" ];

  /**
   * @typedef {Object} PageData
   *
   * @property {string} currentSeason
   * @property {string} currentEvent
   * @property {string} title
   * @property {string} photos_link
   * @property {string} videos_link
   */

  
  /**
   * @typedef {Object} Props
   * @property {PageData} data
   */

  /** @type {Props} */
  let { data = $bindable() } = $props();

  year = data.year ?? 0
  data = data.data

  Debug.on().log('Photos.+page data:', data)
  Debug.on().log('Photos.+page year:', year)

  // data.currentSeason = '2024/25'
  // data.currentEvent = 'Reefscape'
  // data.title = `LigerBots Photos - ${data.currentSeason} ${data.currentEvent}`
  // data.photos_link = 'https://www.flickr.com/photos/ligerbots/'
  // data.videos_link = 'https://www.youtube.com/c/ligerbots/'
</script>

<svelte:head>
  <!-- <link rel="stylesheet" href="/css/gallery.css" /> -->
  <title>LigerBots Photos - {years[year]} {seasons[year]}</title>
  <meta property="og:title" content="LigerBots Photos - {years[year]} {seasons[year]}" />
</svelte:head>

<div class="flex flex-col">
  <div>
    <br />
    <center class="basis-1/12 font-[Open_Sans] text-[13pt] w-auto text-black/80">
      <div class="bg-[#D04E1D] text-white text-[20pt] font-[PT_Serif] font-bold text-ellipsis overflow-hidden w-min h-full px-[2em] py-[0.5em] rounded-md">PHOTOS</div>
      <br />
    </center>
  </div>

  <center class="mb-[2.25em] break-all font-[Open_Sans] tracking-[0.04em]">
    <h5 class="italic text-[11.5pt] leading-[24pt] m-0 text-black">
      To see all LigerBots photos: <a class="text-[#3B64A9] no-underline transition ease-in-out duration-150 hover:text-black hover:underline cursor-pointer" href={data.photos_link} target="_blank">flickr.com/photos/ligerbots/</a>
    </h5>
    <h5 class="italic text-[11.5pt] leading-[24pt] m-0 text-black">
      To see all LigerBots videos: <a class="text-[#3B64A9] no-underline transition ease-in-out duration-150 hover:text-black hover:underline cursor-pointer" href={data.videos_link} target="_blank">youtube.com/c/ligerbots</a>
    </h5>
  </center>

  <div>
    <a class="float-left ml-[3vw] text-[rgb(208,78,29)] text-[12pt] font-medium font-[Open_Sans] transition ease-in-out duration-150 hover:text-black" href="/gallery?year=1">
      <!--span class="glyphicon glyphicon-chevron-left"></span><span class="glyphicon glyphicon-chevron-left"></span-->
      <span class="font-bold">&laquo;</span>&nbsp;Previous year
    </a>
    <a class="float-right mr-[3vw] text-[rgba(208,78,29,0.5)] text-[12pt] font-medium font-[Open_Sans] cursor-not-allowed" href="/gallery">
      Next year&nbsp;<span class="font-bold">&raquo;</span>
      <!-- span class="glyphicon glyphicon-chevron-right"></span>
        <span class="glyphicon glyphicon-chevron-right"></span-->
    </a>
    <div class="flex flex-row justify-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger class="text-[#2B65AE] font-bold text-[18pt] transition ease-in-out duration-150 hover:text-black cursor-pointer text-center">
          {years[year]} {seasons[year]} &nbsp;<span class="down-arrow">&#x25BC;</span>
        </DropdownMenu.Trigger>
          <DropdownMenu.Content class="mx-auto text-center absolute bg-white !shadow-xl shadow-black/30 !border-gray-500/50">
            {#each years as _, i}
            <div><a href="/gallery?year={i}" class="text-[rgb(0,102,179)] hover:underline hover:text-black {i == year ? "hidden" : ""}"> {years[i]} {seasons[i]} </a></div>
            {/each}
          </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  </div>

  <div class="flex flex-row justify-center flex-wrap w-full"> <!-- It's not just good; it's good enough. -->
    <a href="/gallery?album=72177720320536974" class="opacity-full transition ease-in-out duration-200 hover:opacity-70">
      <div
        class="w-[189.75pt] h-[189.75pt] m-[7.71pt] relative p-0 rounded-[4px] border border-[#939598] bg-[url(https://farm66.staticflickr.com/65535/54014893604_f3d3d7c808_z.jpg)] bg-cover bg-center"
      >
        <div class="bg-[#0066b3] z-1 absolute bottom-0 w-full text-center text-white py-[3pt] px-[1pt]">FRC Robocon NE, 9/21/24</div>
      </div>
    </a>
    <a href="/gallery?album=72177720320430286" class="opacity-full transition ease-in-out duration-200 hover:opacity-70">
      <div
        class="w-[189.75pt] h-[189.75pt] m-[7.71pt] relative p-0 rounded-[4px] border border-[#939598] bg-cover bg-center bg-[url(https://farm66.staticflickr.com/65535/54004511582_905f8cb21f_z.jpg)]"
      >
        <div class="bg-[#0066b3] z-1 absolute bottom-0 w-full text-center text-white py-[3pt] px-[1pt]">Newton Upper Falls Village Day, 9/15/24</div>
      </div>
    </a>
    <a href="/gallery?album=72177720320425369" class="opacity-full transition ease-in-out duration-200 hover:opacity-70">
      <div
        class="w-[189.75pt] h-[189.75pt] m-[7.71pt] relative p-0 rounded-[4px] border border-[#939598] bg-cover bg-center bg-[url(https://farm66.staticflickr.com/65535/54002445812_cde9a976bd_z.jpg)]"
      >
        <div class="bg-[#0066b3] z-1 absolute bottom-0 w-full text-center text-white py-[3pt] px-[1pt]">STEAM Expo for Neurodivergent Students, 9/15/24</div>
      </div>
    </a>
    <a href="/gallery?album=72177720320339316" class="opacity-full transition ease-in-out duration-200 hover:opacity-70">
      <div
        class="w-[189.75pt] h-[189.75pt] m-[7.71pt] relative p-0 rounded-[4px] border border-[#939598] bg-cover bg-center bg-[url(https://farm66.staticflickr.com/65535/53997209140_838169a304_z.jpg)]"
      >
        <div class="bg-[#0066b3] z-1 absolute bottom-0 w-full text-center text-white tpy-[3pt] px-[1pt]">Countryside Elementary School Picnic, 9/9/24</div>
      </div>
    </a>
  </div>
  <!-- <div class="row gallery-buttons-bar-container-bottom"> -->
  <!--   <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3"> -->
  <!--     <a style="float: left;" class="gallery-nav-button" href="/gallery?year=1"> -->
  <!--       <span class="glyphicon glyphicon-chevron-left"></span><span class="glyphicon glyphicon-chevron-left"></span> -->
  <!--       Previous year -->
  <!--     </a> -->
  <!--   </div> -->
  <!--   <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3"> -->
  <!--     <a style="float: right;" class="gallery-nav-button-disabled" href="/gallery?"> -->
  <!--       Next year<span class="glyphicon glyphicon-chevron-right"></span><span  -->
  <!--         class="glyphicon glyphicon-chevron-right" -->
  <!--       ></span> -->
  <!--     </a> -->
  <!--   </div> -->
  <!-- </div> -->
</div>

<style>
  .down-arrow {
    color: rgb(208, 78, 29);
    font-size: 16px;
  }
  .left-guillemet {
    font-size: 18px !important;
  }
  .right-guillemet {
    font-size: 16px;
  }
</style>
