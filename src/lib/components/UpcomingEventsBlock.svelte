<script>
  import LinkIcon from './icons/LinkIcon.svelte'
</script>

<div class="border box-border border-[#939598] rounded-[5px] h-[625px] lg:h-[575px] 2xl:h-[625px] shadow-[5px_5px_15px_-10px_rgba(0,0,0,25)] overflow-hidden flex flex-col flex-none">
  <div class="ligerbots-blue-background text-center h-[60px] align-middle flex justify-center items-center flex-none">
    <a href="/calendar" class="text-[#FFFFFF] font-[PT_Serif] text-[17pt] font-[700] no-underline hover:underline">UPCOMING EVENTS</a>
  </div>
  <div class="h-[565px] lg:h-[515px] 2xl:h-[565px] w-full overflow-auto flex-none">
    <!-- <iframe -->
    <!--   src="https://calendar.google.com/calendar/embed?showTitle=0&showNav=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0&mode=AGENDA&height=500&wkst=2&bgcolor=%23FFFFFF&src=c_ab7c91eb08574f09684076109ea998ec2df38bb839ff68399f801f6274446d76%40group.calendar.google.com&color=%23711616&ctz=America%2FNew_York" -->
    <!--   width="100%" -->
    <!--   height="99%" -->
    <!--   frameborder="0" -->
    <!--   scrolling="yes" -->
    <!--   title="LigerBots Calendar" -->
    <!-- > -->
    <!-- </iframe> -->
  <iframe src="https://calendar.google.com/calendar/embed?showTitle=0&showNav=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0&mode=AGENDA&height=565&wkst=2&bgcolor=%23FFFFFF&src=c_ab7c91eb08574f09684076109ea998ec2df38bb839ff68399f801f6274446d76%40group.calendar.google.com&color=%23711616&ctz=America%2FNew_York" width="100%" height="565px" frameborder="0" scrolling="yes" title="LigerBots Calendar" class="block lg:hidden 2xl:block"></iframe>
  <iframe src="https://calendar.google.com/calendar/embed?showTitle=0&showNav=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0&mode=AGENDA&height=565&wkst=2&bgcolor=%23FFFFFF&src=c_ab7c91eb08574f09684076109ea998ec2df38bb839ff68399f801f6274446d76%40group.calendar.google.com&color=%23711616&ctz=America%2FNew_York" width="100%" height="515px" frameborder="0" scrolling="yes" title="LigerBots Calendar" class="hidden lg:block 2xl:hidden"></iframe>
  </div>
</div>
