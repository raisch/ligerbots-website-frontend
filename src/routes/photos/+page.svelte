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

<div class="row">
  <div class="title-bar">
    <center>
      <div class="notindex-title">
        <a href="/gallery" style="color: white;">PHOTOS</a>
      </div>
    </center>
    <br />
  </div>

  <center style="margin-bottom: 2.25em; word-wrap: break-word;">
    <h5 class="gallery-link">
      To see all LigerBots photos: <a href={data.photos_link} target="_blank">flickr.com/photos/ligerbots/</a>
    </h5>
    <h5 class="gallery-link">
      To see all LigerBots videos: <a href={data.videos_link} target="_blank">youtube.com/c/ligerbots</a>
    </h5>
  </center>

  <div class="gallery-container">
    <div class="row gallery-buttons-bar-container-top">
      <div class="col-xs-6 col-sm-3 col-md-3 col-lg-2">
        <a style="float: left;" class="gallery-nav-button" href="/gallery?year=1">
          <!--span class="glyphicon glyphicon-chevron-left"></span><span class="glyphicon glyphicon-chevron-left"></span-->
          <span class="left-guillemet">&laquo;</span>&nbsp;Previous year
        </a>
      </div>
      <div class="col-xs-6 col-sm-3 col-md-3 col-lg-2 col-sm-push-6 col-md-push-6 col-lg-push-8">
        <a style="float: right;" class="gallery-nav-button-disabled" href="/gallery">
          Next year&nbsp;<span class="right-guillemet">&raquo;</span>
          <!-- span class="glyphicon glyphicon-chevron-right"></span>
            <span class="glyphicon glyphicon-chevron-right"></span-->
        </a>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-8 col-sm-pull-3 col-md-pull-3 col-lg-pull-2">
        <div class="gallery-dropdown">
          <button class="btn btn-primary dropdown-toggle gallery-dropdown-button" type="button" data-toggle="dropdown"
            >2024/25 Reefscape &nbsp;<span class="down-arrow">&#x25BC;</span>
          </button>
          <ul class="dropdown-menu gallery-dropdown-content">
            <!-- svelte-ignore a11y-missing-attribute -->
            <li><a class="gallery-dropdown-item-active active"> 2024/25 Reefscape </a></li>
            <li><a href="/gallery?year=1" class="gallery-dropdown-item"> 2023/24 Crescendo </a></li>
            <li><a href="/gallery?year=2" class="gallery-dropdown-item"> 2022/23 Charged Up </a></li>
            <li><a href="/gallery?year=3" class="gallery-dropdown-item"> 2021/22 Rapid React </a></li>
            <li>
              <a href="/gallery?year=4" class="gallery-dropdown-item"> 2020/21 Infinite Recharge at Home </a>
            </li>
            <li><a href="/gallery?year=5" class="gallery-dropdown-item"> 2019/20 Infinite Recharge </a></li>
            <li><a href="/gallery?year=6" class="gallery-dropdown-item"> 2018/19 Destination: Deep Space </a></li>
            <li><a href="/gallery?year=7" class="gallery-dropdown-item"> 2017/18 Power Up </a></li>
            <li><a href="/gallery?year=8" class="gallery-dropdown-item"> 2016/17 Steamworks </a></li>
            <li><a href="/gallery?year=9" class="gallery-dropdown-item"> 2015/16 Stronghold </a></li>
            <li><a href="/gallery?year=10" class="gallery-dropdown-item"> 2014/15 Recycle Rush </a></li>
            <li><a href="/gallery?year=11" class="gallery-dropdown-item"> 2014 Aerial Assist </a></li>
            <li><a href="/gallery?year=12" class="gallery-dropdown-item"> 2013 Ultimate Ascent </a></li>
            <li><a href="/gallery?year=13" class="gallery-dropdown-item"> 2012 Rebound Rumble </a></li>
            <li><a href="/gallery?year=14" class="gallery-dropdown-item"> 2011 Logo Motion </a></li>
            <li><a href="/gallery?year=15" class="gallery-dropdown-item"> 2010 Breakaway </a></li>
            <li><a href="/gallery?year=16" class="gallery-dropdown-item"> 2009 Lunacy </a></li>
            <li><a href="/gallery?year=17" class="gallery-dropdown-item"> 2008 FIRST Overdrive </a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="gallery-content">
      <a href="/gallery?album=72177720320536974" style="text-decoration: none;">
        <div
          class="gallery-thumbnail"
          style="background-image: url(https://farm66.staticflickr.com/65535/54014893604_f3d3d7c808_z.jpg);"
        >
          <div class="gallery-caption">FRC Robocon NE, 9/21/24</div>
        </div>
      </a>
      <a href="/gallery?album=72177720320430286" style="text-decoration: none;">
        <div
          class="gallery-thumbnail"
          style="background-image: url(https://farm66.staticflickr.com/65535/54004511582_905f8cb21f_z.jpg);"
        >
          <div class="gallery-caption">Newton Upper Falls Village Day, 9/15/24</div>
        </div>
      </a>
      <a href="/gallery?album=72177720320425369" style="text-decoration: none;">
        <div
          class="gallery-thumbnail"
          style="background-image: url(https://farm66.staticflickr.com/65535/54002445812_cde9a976bd_z.jpg);"
        >
          <div class="gallery-caption">STEAM Expo for Neurodivergent Students, 9/15/24</div>
        </div>
      </a>
      <a href="/gallery?album=72177720320339316" style="text-decoration: none;">
        <div
          class="gallery-thumbnail"
          style="background-image: url(https://farm66.staticflickr.com/65535/53997209140_838169a304_z.jpg);"
        >
          <div class="gallery-caption">Countryside Elementary School Picnic, 9/9/24</div>
        </div>
      </a>
    </div>
    <div class="row gallery-buttons-bar-container-bottom">
      <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3">
        <a style="float: left;" class="gallery-nav-button" href="/gallery?year=1">
          <span class="glyphicon glyphicon-chevron-left"></span><span class="glyphicon glyphicon-chevron-left"></span>
          Previous year
        </a>
      </div>
      <div class="col-sm-6 col-md-6 col-lg-6"></div>
      <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3">
        <a style="float: right;" class="gallery-nav-button-disabled" href="/gallery?">
          Next year<span class="glyphicon glyphicon-chevron-right"></span><span
            class="glyphicon glyphicon-chevron-right"
          ></span>
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
