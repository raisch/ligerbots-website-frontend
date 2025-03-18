<script>
  import Debug from '$lib/debugging'

  /**
   * @typedef {Object} PageData
   *
   * @property {string} currentSeason
   * @property {string} currentEvent
   * @property {string} title
   * @property {string} photos_link
   * @property {string} videos_link
   */

  /** @type {PageData} */
  export let data

  // Debug.on().log('Photos.+page data:', data)

  data.currentSeason = '2024/25'
  data.currentEvent = 'Reefscape'
  data.title = `LigerBots Photos - ${data.currentSeason} ${data.currentEvent}`
  data.photos_link = 'https://www.flickr.com/photos/ligerbots/'
  data.videos_link = 'https://www.youtube.com/c/ligerbots/'
</script>

<svelte:head>
  <link rel="stylesheet" href="/css/gallery.css" />
  <title>{data.title}</title>
  <meta property="og:title" content={data.title} />
</svelte:head>

<div class="flex flex-col">
  <div class="bg-orange-600 text-white font-serif font-bold text-lg text-center py-2 rounded-lg">
    <a href="/gallery" style="color: white;">PHOTOS</a>
  </div>

  <center class="mb-9 word-wrap">
    <h5 class="font-semibold italic text-sm leading-6 m-0">
      To see all LigerBots photos: <a href={data.photos_link} target="_blank">flickr.com/photos/ligerbots/</a>
    </h5>
    <h5 class="font-semibold italic text-sm leading-6 m-0">
      To see all LigerBots videos: <a href={data.videos_link} target="_blank">youtube.com/c/ligerbots</a>
    </h5>
  </center>

  <div class="px-7">
    <div class="flex justify-between items-center mb-3.5">
      <div class="w-1/2 sm:w-1/4 md:w-1/4 lg:w-1/6">
        <a class="text-orange-600 transition duration-100" href="/gallery?year=1">
          <span class="left-guillemet">&laquo;</span>&nbsp;Previous year
        </a>
      </div>
      <div class="w-1/2 sm:w-1/4 md:w-1/4 lg:w-1/6 sm:order-3">
        <a class="text-gray-400 cursor-not-allowed" href="/gallery">
          Next year&nbsp;<span class="right-guillemet">&raquo;</span>
        </a>
      </div>

      <div class="w-full sm:w-1/2 md:w-1/2 lg:w-2/3 sm:order-2">
        <div class="relative inline-block">
          <button class="bg-transparent border-none p-0 m-0 text-orange-600 font-bold text-lg leading-6 transition duration-100" type="button">
            2024/25 Reefscape &nbsp;<span class="down-arrow">&#x25BC;</span>
          </button>
          <ul class="absolute hidden bg-white text-black shadow-lg rounded-lg mt-2">
            <li><a class="block px-4 py-2 bg-blue-600 text-white"> 2024/25 Reefscape </a></li>
            <li><a href="/gallery?year=1" class="block px-4 py-2 hover:bg-gray-200"> 2023/24 Crescendo </a></li>
            <li><a href="/gallery?year=2" class="block px-4 py-2 hover:bg-gray-200"> 2022/23 Charged Up </a></li>
            <li><a href="/gallery?year=3" class="block px-4 py-2 hover:bg-gray-200"> 2021/22 Rapid React </a></li>
            <li><a href="/gallery?year=4" class="block px-4 py-2 hover:bg-gray-200"> 2020/21 Infinite Recharge at Home </a></li>
            <li><a href="/gallery?year=5" class="block px-4 py-2 hover:bg-gray-200"> 2019/20 Infinite Recharge </a></li>
            <li><a href="/gallery?year=6" class="block px-4 py-2 hover:bg-gray-200"> 2018/19 Destination: Deep Space </a></li>
            <li><a href="/gallery?year=7" class="block px-4 py-2 hover:bg-gray-200"> 2017/18 Power Up </a></li>
            <li><a href="/gallery?year=8" class="block px-4 py-2 hover:bg-gray-200"> 2016/17 Steamworks </a></li>
            <li><a href="/gallery?year=9" class="block px-4 py-2 hover:bg-gray-200"> 2015/16 Stronghold </a></li>
            <li><a href="/gallery?year=10" class="block px-4 py-2 hover:bg-gray-200"> 2014/15 Recycle Rush </a></li>
            <li><a href="/gallery?year=11" class="block px-4 py-2 hover:bg-gray-200"> 2014 Aerial Assist </a></li>
            <li><a href="/gallery?year=12" class="block px-4 py-2 hover:bg-gray-200"> 2013 Ultimate Ascent </a></li>
            <li><a href="/gallery?year=13" class="block px-4 py-2 hover:bg-gray-200"> 2012 Rebound Rumble </a></li>
            <li><a href="/gallery?year=14" class="block px-4 py-2 hover:bg-gray-200"> 2011 Logo Motion </a></li>
            <li><a href="/gallery?year=15" class="block px-4 py-2 hover:bg-gray-200"> 2010 Breakaway </a></li>
            <li><a href="/gallery?year=16" class="block px-4 py-2 hover:bg-gray-200"> 2009 Lunacy </a></li>
            <li><a href="/gallery?year=17" class="block px-4 py-2 hover:bg-gray-200"> 2008 FIRST Overdrive </a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="text-center">
      <a href="/gallery?album=72177720320536974" class="no-underline">
        <div class="bg-cover bg-center rounded-lg m-2 border border-gray-300 w-48 h-48 transition duration-300 hover:opacity-70" style="background-image: url(https://farm66.staticflickr.com/65535/54014893604_f3d3d7c808_z.jpg);">
          <div class="bg-blue-600 rounded-b-lg w-full absolute bottom-0 text-center p-1 text-white">
            FRC Robocon NE, 9/21/24
          </div>
        </div>
      </a>
      <a href="/gallery?album=72177720320430286" class="no-underline">
        <div class="bg-cover bg-center rounded-lg m-2 border border-gray-300 w-48 h-48 transition duration-300 hover:opacity-70" style="background-image: url(https://farm66.staticflickr.com/65535/54004511582_905f8cb21f_z.jpg);">
          <div class="bg-blue-600 rounded-b-lg w-full absolute bottom-0 text-center p-1 text-white">
            Newton Upper Falls Village Day, 9/15/24
          </div>
        </div>
      </a>
      <a href="/gallery?album=72177720320425369" class="no-underline">
        <div class="bg-cover bg-center rounded-lg m-2 border border-gray-300 w-48 h-48 transition duration-300 hover:opacity-70" style="background-image: url(https://farm66.staticflickr.com/65535/54002445812_cde9a976bd_z.jpg);">
          <div class="bg-blue-600 rounded-b-lg w-full absolute bottom-0 text-center p-1 text-white">
            STEAM Expo for Neurodivergent Students, 9/15/24
          </div>
        </div>
      </a>
      <a href="/gallery?album=72177720320339316" class="no-underline">
        <div class="bg-cover bg-center rounded-lg m-2 border border-gray-300 w-48 h-48 transition duration-300 hover:opacity-70" style="background-image: url(https://farm66.staticflickr.com/65535/53997209140_838169a304_z.jpg);">
          <div class="bg-blue-600 rounded-b-lg w-full absolute bottom-0 text-center p-1 text-white">
            Countryside Elementary School Picnic, 9/9/24
          </div>
        </div>
      </a>
    </div>
    <div class="flex justify-between items-center mt-3.5">
      <div class="w-1/2 sm:w-1/4 md:w-1/4 lg:w-1/4">
        <a class="text-orange-600 transition duration-100" href="/gallery?year=1">
          <span class="left-guillemet">&laquo;</span>&nbsp;Previous year
        </a>
      </div>
      <div class="w-1/2 sm:w-1/4 md:w-1/4 lg:w-1/4">
        <a class="text-gray-400 cursor-not-allowed" href="/gallery?">
          Next year<span class="right-guillemet">&raquo;</span>
        </a>
      </div>
    </div>
  </div>
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
