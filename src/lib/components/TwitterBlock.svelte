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

<!-- <div class="col-md-6 col-sm-12"> -->
  <div class="rounded-[0.1vw] shadow-lg border-1 border-[#939598] h-full shadow-[5px_5px_15px_-10px_rgba(0,0,0,25)] overflow-auto">
    <div class="ligerbots-blue-background rounded-t-[0.1vw] text-center h-1/15 align-middle flex justify-center items-center">
      <a
        target="_blank"
        href="https://twitter.com/search?q=ligerbots&amp;src=typd"
        class="text-[#FFFFFF] text-[17pt] no-underline font-[700] font-[PT_Serif] hover:underline"
        data-svelte-h="svelte-kc9igs">TWITTER</a
      >
    </div>
    <div class="overflow-auto h-full">
      <div
        class="twitter-timeline twitter-timeline-rendered h-full"
        style="display: flex; width: 100%; max-width: 100%; margin-top: 0px; margin-bottom: 0px;"
      >
        <iframe
          id="twitter-widget-0"
          scrolling="no"
          frameborder="0"
          allowtransparency
          class="h-full static visible block"
          title="Twitter Timeline"
          src="https://syndication.twitter.com/srv/timeline-profile/screen-name/LigerBots?dnt=false&amp;embedId=twitter-widget-0&amp;features=eyJ0ZndfdGltZWxpbmVfbGlzdCI6eyJidWNrZXQiOltdLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2ZvbGxvd2VyX2NvdW50X3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9iYWNrZW5kIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19yZWZzcmNfc2Vzc2lvbiI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfZm9zbnJfc29mdF9pbnRlcnZlbnRpb25zX2VuYWJsZWQiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X21peGVkX21lZGlhXzE1ODk3Ijp7ImJ1Y2tldCI6InRyZWF0bWVudCIsInZlcnNpb24iOm51bGx9LCJ0ZndfZXhwZXJpbWVudHNfY29va2llX2V4cGlyYXRpb24iOnsiYnVja2V0IjoxMjA5NjAwLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3Nob3dfYmlyZHdhdGNoX3Bpdm90c19lbmFibGVkIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19kdXBsaWNhdGVfc2NyaWJlc190b19zZXR0aW5ncyI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdXNlX3Byb2ZpbGVfaW1hZ2Vfc2hhcGVfZW5hYmxlZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdmlkZW9faGxzX2R5bmFtaWNfbWFuaWZlc3RzXzE1MDgyIjp7ImJ1Y2tldCI6InRydWVfYml0cmF0ZSIsInZlcnNpb24iOm51bGx9LCJ0ZndfbGVnYWN5X3RpbWVsaW5lX3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9mcm9udGVuZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9fQ%3D%3D&amp;frame=false&amp;hideBorder=true&amp;hideFooter=true&amp;hideHeader=true&amp;hideScrollBar=false&amp;lang=en&amp;maxHeight=600px&amp;origin=https%3A%2F%2Fligerbots.org%2F&amp;sessionId=8fd047d32cf9eaa103d74dabeb11ebc1a7519f22&amp;showHeader=false&amp;showReplies=false&amp;transparent=false&amp;widgetsVersion=2615f7e52b7e0%3A1702314776716"
          style="position: static; visibility: visible; display: block; flex-grow: 1;"
          allowfullscreen
        ></iframe>
      </div>
      <script id="twitter-wjs" src="https://platform.twitter.com/widgets.js" nonce="%sveltekit.nonce%"></script>
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
<!-- </div> -->
