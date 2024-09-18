<script>
  import App from "../App.svelte"

  /** @type {import('./$types').PageData} */
  export let data

  // @ts-ignore
  const { title } = data.global || { title: "Default Title" }
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
</svelte:head>

<App>
  <div class="row bottom-margin row-margins">
    <div class="col-md-6 col-sm-12">
      <div class="panel panel-blue">
        <div class="panel-heading index-heading">
          <!-- CSS cannot seem to set the color so do it here -->
          <a style="color:white;" href="/blog_list.php">LIGERBOTS BLOG</a>
        </div>
        <div id="blog-panel" class="panel-body">
          <div class="blog-image-box">
            <img
              src="/images/Enabling-Engineering-2024.webp"
              alt="enabling engineering internship 2024"
            />
          </div>
          <div class="text-margins">
            <p>
              This summer, 18 LigerBots took part in an eight week program
              through Northeastern University’s Enabling Engineering&nbsp;
              internship.”During the internship, the students helped to design
              and build five different projects for patients, children and
              nurses in…
            </p>
            <div class="read-more">
              <a
                href="https://ligerbots.org/2024/09/14/ligerbots-excel-and-innovate-at-northeastern-internship/"
              >
                <img src="/images/read_more_flat.svg" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-6 col-sm-12">
      <div class="panel panel-blue">
        <div class="panel-heading index-heading">
          <a style="color:white;" href="/calendar.php">UPCOMING EVENTS</a>
        </div>
        <div id="cal-panel-div" class="panel-body">
          <iframe
            id="cal-panel"
            src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showNav=0&amp;showDate=0&amp;showPrint=0&amp;showTabs=0&amp;showCalendars=0&amp;mode=AGENDA&amp;height=500&amp;wkst=2&amp;bgcolor=%23FFFFFF&amp;src=c_r2405nbigo9eqb06kbvnk51bcc%40group.calendar.google.com&amp;color=%23711616&amp;ctz=America%2FNew_York"
            width="100%"
            height="500"
            frameborder="0"
            scrolling="no"
            style="height: 601.641px;"
            title="LigerBots Calendar"
          >
          </iframe>
        </div>
      </div>
    </div>
  </div>

  <div class="row bottom-margin row-margins">
    <div class="col-md-6 col-sm-12">
      <div class="panel panel-blue">
        <div class="panel-heading index-heading">
          <a style="color:white;" href="/blog_list.php">ANNOUNCEMENTS</a>
        </div>
        <div id="ann-panel" class="panel-body">
          <div class="announce text-margins">
            <div class="announce-title">
              <a
                href="https://ligerbots.org/2024/09/05/ligerbots-open-house-sept-30-615-900/"
                >LigerBots Open House Sept. 30, 6:15-9:00</a
              >
            </div>
            <div class="announce-date">September 5, 2024</div>
            <div class="announce-content">
              <p>
                The LigerBots, will host an open house for prospective team
                members on Sept. 30, 2024 from 6:15 – 9:00 p.m. in the tech ed
                room at Newton South High School. All Newton North and Newton … <a
                  href="https://ligerbots.org/2024/09/05/ligerbots-open-house-sept-30-615-900/"
                  class="more-link"
                  >Continue reading<span class="screen-reader-text">
                    “LigerBots Open House Sept. 30, 6:15-9:00”</span
                  ></a
                >
              </p>
            </div>
          </div>
          <div class="announce text-margins">
            <div class="announce-title">
              <a href="https://ligerbots.org/2024/03/15/be-our-champion/"
                >Be Our Champion!</a
              >
            </div>
            <div class="announce-date">March 15, 2024</div>
            <div class="announce-content">
              <p>
                We are going to the Championships!&nbsp; FIRST robotics conducts
                their annual international championship in Houston, Texas.&nbsp;
                Last year, more than 18,000 students, representing 974 robotics
                teams from 59 countries came together to compete, innovate and … <a
                  href="https://ligerbots.org/2024/03/15/be-our-champion/"
                  class="more-link"
                  >Continue reading<span class="screen-reader-text">
                    “Be Our Champion!”</span
                  ></a
                >
              </p>
            </div>
          </div>
          <div class="announce text-margins">
            <div class="announce-title">
              <a
                href="https://ligerbots.org/2023/12/04/come-to-the-ligerbots-steam-expo-and-robot-zoo/"
                >Come to the LigerBots STEAM Expo and Robot Zoo!</a
              >
            </div>
            <div class="announce-date">December 4, 2023</div>
            <div class="announce-content">
              <p>
                The LigerBots will host a STEAM activity expo for children and
                robot zoo on Dec. 16 from 10-3 at Newton North High School,
                accompanying the Massachusetts East FIRST LEGO League
                Championship, which runs from 9-4. … <a
                  href="https://ligerbots.org/2023/12/04/come-to-the-ligerbots-steam-expo-and-robot-zoo/"
                  class="more-link"
                  >Continue reading<span class="screen-reader-text">
                    “Come to the LigerBots STEAM Expo and Robot Zoo!”</span
                  ></a
                >
              </p>
            </div>
          </div>
          <div class="announce text-margins">
            <div class="announce-title">
              <a
                href="https://ligerbots.org/2023/11/01/join-us-at-the-newton-pumpkin-smash-11-4-1-5/"
                >Join us at the Newton Pumpkin Smash, 11/4, 1-5</a
              >
            </div>
            <div class="announce-date">November 1, 2023</div>
            <div class="announce-content">
              <p>
                Watch the LigerBots smash your Halloween pumpkin with our
                awesome, robot-driven smasher at Newton City Hall, Saturday 11/4
                from 1-5. In addition to the smashing we’ll have hands-on STEAM
                activities for kids!
              </p>
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>
    <div class="col-md-6 col-sm-12">
      <div class="panel panel-blue">
        <div class="panel-heading index-heading">
          <a
            style="color:white;"
            target="_blank"
            href="https://twitter.com/search?q=ligerbots&amp;src=typd"
            >TWITTER</a
          >
        </div>
        <div class="panel-body">
          <div
            class="twitter-timeline twitter-timeline-rendered"
            style="display: flex; width: 100%; max-width: 100%; margin-top: 0px; margin-bottom: 0px;"
          >
            <iframe
              id="twitter-widget-0"
              scrolling="no"
              frameborder="0"
              allowtransparency
              allowfullscreen
              class=""
              title="Twitter Timeline"
              src="https://syndication.twitter.com/srv/timeline-profile/screen-name/LigerBots?dnt=false&amp;embedId=twitter-widget-0&amp;features=eyJ0ZndfdGltZWxpbmVfbGlzdCI6eyJidWNrZXQiOltdLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2ZvbGxvd2VyX2NvdW50X3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9iYWNrZW5kIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19yZWZzcmNfc2Vzc2lvbiI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfZm9zbnJfc29mdF9pbnRlcnZlbnRpb25zX2VuYWJsZWQiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X21peGVkX21lZGlhXzE1ODk3Ijp7ImJ1Y2tldCI6InRyZWF0bWVudCIsInZlcnNpb24iOm51bGx9LCJ0ZndfZXhwZXJpbWVudHNfY29va2llX2V4cGlyYXRpb24iOnsiYnVja2V0IjoxMjA5NjAwLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3Nob3dfYmlyZHdhdGNoX3Bpdm90c19lbmFibGVkIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19kdXBsaWNhdGVfc2NyaWJlc190b19zZXR0aW5ncyI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdXNlX3Byb2ZpbGVfaW1hZ2Vfc2hhcGVfZW5hYmxlZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdmlkZW9faGxzX2R5bmFtaWNfbWFuaWZlc3RzXzE1MDgyIjp7ImJ1Y2tldCI6InRydWVfYml0cmF0ZSIsInZlcnNpb24iOm51bGx9LCJ0ZndfbGVnYWN5X3RpbWVsaW5lX3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9mcm9udGVuZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9fQ%3D%3D&amp;frame=false&amp;hideBorder=true&amp;hideFooter=true&amp;hideHeader=true&amp;hideScrollBar=false&amp;lang=en&amp;maxHeight=600px&amp;origin=https%3A%2F%2Fligerbots.org%2F&amp;sessionId=8fd047d32cf9eaa103d74dabeb11ebc1a7519f22&amp;showHeader=false&amp;showReplies=false&amp;transparent=false&amp;widgetsVersion=2615f7e52b7e0%3A1702314776716"
              style="position: static; visibility: visible; width: 539px; height: 829.844px; display: block; flex-grow: 1;"
            ></iframe>
          </div>
          <script nonce="%sveltekit.nonce%">
            !(function (d, s, id) {
              var js,
                fjs = d.getElementsByTagName(s)[0],
                p = /^http:/.test(d.location) ? "http" : "https"
              if (!d.getElementById(id)) {
                js = d.createElement(s)
                js.id = id
                js.src = p + "://platform.twitter.com/widgets.js"
                fjs.parentNode.insertBefore(js, fjs)
              }
            })(document, "script", "twitter-wjs")
          </script>
        </div>
      </div>
    </div>
  </div>

  <div class="row row-margins">
    <div class="col-xs-12">
      <div class="panel panel-brag">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
          src="/images/team_photo_2022.jpg"
          alt="Team photo of the LigerBots in 2022"
        />
      </div>
      <div style="text-align:center;">
        <div class="label-blue">
          <a
            href="https://www.flickr.com/photos/ligerbots/albums/72157712218381043"
            target="_blank">The LigerBots</a
          >
        </div>
      </div>
    </div>
  </div>
</App>
