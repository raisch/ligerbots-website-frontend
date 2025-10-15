<script>
  import LinkIcon from './icons/LinkIcon.svelte'
  import { onMount } from 'svelte'

  // onMount(async () => {
  //   const res = await fetch('/api/announcement')
  //   const announcements = await res.json()
  //   console.log('announcements:', announcements)
  // })
</script>

<div class="rounded-[0.1vw] border-1 border-[#939598] h-full shadow-[5px_5px_15px_-10px_rgba(0,0,0,25)]">
  <div class="ligerbots-blue-background rounded-t-[0.1vw] text-center h-[60px] align-middle flex justify-center items-center">
    <a href="/announcement" class="text-[#FFFFFF] font-[700] text-[17pt] font-[PT_Serif] no-underline hover:underline">ANNOUNCEMENTS</a>
  </div>
  <div class="m-[20px] leading-[19pt]">
    <div>
      <div class="font-[Open_Sans_Condensed] font-[700] text-center">
        <a href="https://ligerbots.org/2024/09/05/ligerbots-open-house-sept-30-615-900/" class="text-[#2C72AE] no-underline text-[16pt] leading-[16pt] hover:text-[#2864ad] hover:underline"
          >LigerBots Open House Sept. 30, 6:15-9:00</a>
      </div>
      <div class="font-[Open_Sans] italic text-[#333]">September 5, 2024</div>
      <div class="font-[12pt] text-[#333] font-[Open_Sans]">
        <p>
          The LigerBots, will host an open house for prospective team members on Sept. 30, 2024 from 6:15 – 9:00 p.m.
          in the tech ed room at Newton South High School. All Newton North and Newton … <a
            href="https://ligerbots.org/2024/09/05/ligerbots-open-house-sept-30-615-900/"
            class="no-underline text-[#2C72AE] hover:underline hover:text-[#2864ad]"
            >Continue reading <span class="screen-reader-text"> “LigerBots Open House Sept. 30, 6:15-9:00”</span></a
          >
        </p>
      </div>
    </div>
    <br />
    <div>
      <div class="font-[Open_Sans_Condensed] font-[700] text-center">
        <a href="https://ligerbots.org/2024/03/15/be-our-champion/" class="text-[#2C72AE] no-underline text-[16pt] leading-[16pt] hover:text-[#2864ad] hover:underline"
          >Be Our Champion!</a>
      </div>
      <div class="font-[Open_Sans] italic text-[#333]">March 15, 2024</div>
      <div class="font-[12pt] text-[#333] font-[Open_Sans]">
        <p>
          We are going to the Championships!&nbsp; FIRST robotics conducts their annual international championship in
          Houston, Texas.&nbsp; Last year, more than 18,000 students, representing 974 robotics teams from 59
          countries came together to compete, innovate and … <a
            href="https://ligerbots.org/2024/03/15/be-our-champion/"
            class="no-underline text-[#2C72AE] hover:underline hover:text-[#2864ad]"
            >Continue reading <span class="screen-reader-text"> “Be Our Champion!”</span></a
          >
        </p>
      </div>
    </div>
    <br />
    <div>
      <div class="font-[Open_Sans_Condensed] font-[700] text-center">
        <a href="https://ligerbots.org/2023/12/04/come-to-the-ligerbots-steam-expo-and-robot-zoo/" class="text-[#2C72AE] no-underline text-[16pt] leading-[16pt] hover:text-[#2864ad] hover:underline"
          >Come to the LigerBots STEAM Expo and Robot Zoo!</a>
      </div>
      <div class="font-[Open_Sans] italic text-[#333]">December 4, 2023</div>
      <div class="font-[12pt] text-[#333] font-[Open_Sans]">
        <p>
          The LigerBots will host a STEAM activity expo for children and robot zoo on Dec. 16 from 10-3 at Newton
          North High School, accompanying the Massachusetts East FIRST LEGO League Championship, which runs from 9-4. ...
          <a
            href="https://ligerbots.org/2023/12/04/come-to-the-ligerbots-steam-expo-and-robot-zoo/"
            class="no-underline text-[#2C72AE] hover:underline hover:text-[#2864ad]"
            >Continue reading <span class="screen-reader-text"> “Come to the LigerBots STEAM Expo and Robot Zoo!”</span></a
          >
        </p>
      </div>
    </div>
    <br />
    <div>
      <div class="font-[Open_Sans_Condensed] font-[700] text-center">
        <a href="https://ligerbots.org/2023/11/01/join-us-at-the-newton-pumpkin-smash-11-4-1-5/" class="text-[#2C72AE] no-underline text-[16pt] leading-[16pt] hover:text-[#2864ad] hover:underline"
          >I'm too lazy to write down all of this; It won't be visible anyways</a>
      </div>
      <div class="font-[Open_Sans] italic text-[#333]">Frostmoot 32, 2026</div>
      <div class="font-[12pt] text-[#333] font-[Open_Sans]">
        <p>
          This isn't my problem. It's above my paygrade. That's outside of my wheelhouse. My current workload does not allow for me to take on additional tasks. To give this the attention it deserves, it should go to someone with the right bandwidth. I'm happy to help where I can, but this falls outside of what I can realistically commit to.
          <a
            href="https://ligerbots.org/2026/13/32/nope-not-my-problem/"
            class="no-underline text-[#2C72AE] hover:underline hover:text-[#2864ad]"
            >Continue reading <span class="screen-reader-text"> “Nope. Not my problem.”</span></a
          >
          <!-- All jokes aside: the actual text is right beneath this. I just didn't feel like writing it all down.-->
        </p>
      </div>
    </div>
    <!-- <div class="announce text-margins"> -->
    <!--   <div class="announce-title"> -->
    <!--     <a href="https://ligerbots.org/2023/11/01/join-us-at-the-newton-pumpkin-smash-11-4-1-5/" -->
    <!--       >Join us at the Newton Pumpkin Smash, 11/4, 1-5</a -->
    <!--     > -->
    <!--   </div> -->
    <!--   <div class="announce-date">November 1, 2023</div> -->
    <!--   <div class="announce-content"> -->
    <!--     <p> -->
    <!--       Watch the LigerBots smash your Halloween pumpkin with our awesome, robot-driven smasher at Newton City Hall, -->
    <!--       Saturday 11/4 from 1-5. In addition to the smashing we’ll have hands-on STEAM activities for kids! -->
    <!--     </p> -->
    <!--   </div> -->
    <!-- </div> -->
    <br />
  </div>
</div>
