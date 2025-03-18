<script>
  import LinkIcon from './icons/LinkIcon.svelte'
</script>

<div class="md:col-span-6 sm:col-span-12">
  <div class="bg-white border border-gray-300 shadow-md rounded-lg">
    <div class="bg-blue-600 text-white font-serif font-bold text-lg text-center py-2 rounded-t-lg">
      <a style="color:white;" href="/calendar.php">UPCOMING EVENTS&nbsp;<LinkIcon /></a>
    </div>
    <div id="cal-panel-div" class="p-4">
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
