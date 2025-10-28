<!-- 
  TODO: Get the Twitter embed working; I'm not familiar enough with it
-->

<script>
  import LinkIcon from './icons/LinkIcon.svelte'

  /**
   * Function from Twitter to set up the Twitter widget.
   *
   * @param {Document} d - document object
   * @param {String} s - element type: 'script'
   * @param {String} id - element id: 'twitter-wjs'
   */
  function twitterSetup(d, s, id) {
    var js,
      fjs = /** @type {HTMLScriptElement} */ (d.getElementsByTagName(s)[0]),
      p = /^http:/.test(d.location.href) ? 'http' : 'https'

    // TODO assure this works as expected.
    if (!d.getElementById(id)) {
      js = /** @type {HTMLScriptElement} */ (d.createElement(s))
      js.id = id
      js.src = p + '://platform.twitter.com/widgets.js'
      js.nonce = '%sveltekit.nonce%'
      console.log(js.toString())
      if (fjs.parentNode) { fjs.parentNode.insertBefore(js, fjs)
      } else {
        document.head.appendChild(js)
      }
    }
  }
</script>

<div class="rounded-[5px] border-1 border-[#939598] h-full shadow-[5px_5px_15px_-10px_rgba(0,0,0,25)] overflow-hidden">
  <div class="ligerbots-blue-background text-center min-h-[60px] h-[60px] align-middle flex justify-center items-center">
    <a
      target="_blank"
      href="https://twitter.com/search?q=ligerbots&amp;src=typd"
      class="text-[#FFFFFF] text-[17pt] no-underline font-[700] font-[PT_Serif] hover:underline"
      data-svelte-h="svelte-kc9igs">TWITTER</a
    >
  </div>
  <div class="overflow-auto h-full min-h-[900px]">
    <div class="h-full flex w-full max-w-full my-0">
      <iframe id="fb-panel" src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fligerbots&amp;tabs=timeline&amp;width=600&amp;height=1000&amp;small_header=true&amp;adapt_container_width=true&amp;hide_cover=true&amp;show_facepile=false&amp;appId" width="100%" height="100%" style="border: none; overflow: hidden;" scrolling="no" frameborder="0" allowfullscreen="true" allow="clipboard-write; encrypted-media; picture-in-picture; web-share" spellcheck="false" aria-label="To enrich screen reader interactions, please activate Accessibility in Grammarly extension settings" class="h-full"></iframe>
  </div>
    <!-- <script id="twitter-wjs" src="https://platform.twitter.com/widgets.js" nonce="%sveltekit.nonce%"></script> -->
    <!-- <script>
      twitterSetup(document, 'script', 'twitter-wjs')
    </script> -->
    <!--script data-svelte-h="svelte-6rjdw6">
      !(function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0],
          p = /^http:/.test(d.location) ? 'http' : 'https'
        if (!d.getElementById(id)) {
          js = d.createElement(s)
          js.id = id
          js.src = p + '://platform.twitter.com/widgets.js'
          js.nonce = %sveltekit.nonce%
          fjs.parentNode.insertBefore(js, fjs)
        }
      })(document, 'script', 'twitter-wjs')
    </script-->
  </div>
</div>
