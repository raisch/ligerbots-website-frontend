<script>
  import LinkIcon from './icons/LinkIcon.svelte'
  import { onMount } from 'svelte'

  // onMount(async () => {
  //   const res = await fetch('/api/announcement')
  //   const announcements = await res.json()
  //   console.log('announcements:', announcements)
  // })
</script>

<div class="md:col-span-6 sm:col-span-12">
  <div class="bg-white border border-gray-300 shadow-md rounded-lg">
    <div class="bg-blue-600 text-white font-serif font-bold text-lg text-center py-2 rounded-t-lg">
      <a href="/" style="color: white;">ANNOUNCEMENTS&nbsp;<LinkIcon /></a>
    </div>
    <div id="ann-panel" class="p-4">
      <div class="p-4">
        <div class="font-sans font-bold text-xl text-center">
          <a href="https://ligerbots.org/2024/09/05/ligerbots-open-house-sept-30-615-900/"
            >LigerBots Open House Sept. 30, 6:15-9:00</a
          >
        </div>
        <div class="italic text-center">September 5, 2024</div>
        <div class="mt-2">
          <p>
            The LigerBots, will host an open house for prospective team members on Sept. 30, 2024 from 6:15 – 9:00 p.m.
            in the tech ed room at Newton South High School. All Newton North and Newton … <a
              href="https://ligerbots.org/2024/09/05/ligerbots-open-house-sept-30-615-900/"
              class="text-blue-600 underline"
              >Continue reading<span class="sr-only">“LigerBots Open House Sept. 30, 6:15-9:00”</span></a
            >
          </p>
        </div>
      </div>
      <div class="p-4">
        <div class="font-sans font-bold text-xl text-center">
          <a href="https://ligerbots.org/2024/03/15/be-our-champion/">Be Our Champion!</a>
        </div>
        <div class="italic text-center">March 15, 2024</div>
        <div class="mt-2">
          <p>
            We are going to the Championships!&nbsp; FIRST robotics conducts their annual international championship in
            Houston, Texas.&nbsp; Last year, more than 18,000 students, representing 974 robotics teams from 59
            countries came together to compete, innovate and … <a
              href="https://ligerbots.org/2024/03/15/be-our-champion/"
              class="text-blue-600 underline">Continue reading<span class="sr-only">“Be Our Champion!”</span></a
            >
          </p>
        </div>
      </div>
      <div class="p-4">
        <div class="font-sans font-bold text-xl text-center">
          <a href="https://ligerbots.org/2023/12/04/come-to-the-ligerbots-steam-expo-and-robot-zoo/"
            >Come to the LigerBots STEAM Expo and Robot Zoo!</a
          >
        </div>
        <div class="italic text-center">December 4, 2023</div>
        <div class="mt-2">
          <p>
            The LigerBots will host a STEAM activity expo for children and robot zoo on Dec. 16 from 10-3 at Newton
            North High School, accompanying the Massachusetts East FIRST LEGO League Championship, which runs from 9-4.
            … <a
              href="https://ligerbots.org/2023/12/04/come-to-the-ligerbots-steam-expo-and-robot-zoo/"
              class="text-blue-600 underline"
              >Continue reading<span class="sr-only">“Come to the LigerBots STEAM Expo and Robot Zoo!”</span
              ></a
            >
          </p>
        </div>
      </div>
      <div class="p-4">
        <div class="font-sans font-bold text-xl text-center">
          <a href="https://ligerbots.org/2023/11/01/join-us-at-the-newton-pumpkin-smash-11-4-1-5/"
            >Join us at the Newton Pumpkin Smash, 11/4, 1-5</a
          >
        </div>
        <div class="italic text-center">November 1, 2023</div>
        <div class="mt-2">
          <p>
            Watch the LigerBots smash your Halloween pumpkin with our awesome, robot-driven smasher at Newton City Hall,
            Saturday 11/4 from 1-5. In addition to the smashing we’ll have hands-on STEAM activities for kids!
          </p>
        </div>
      </div>
      <br />
    </div>
  </div>
</div>
