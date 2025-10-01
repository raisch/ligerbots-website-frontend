<script>
  import * as Resizable from "$components/components/ui/resizable/index.js";
</script>
<div class="flex flex-row justify-center">
  <Resizable.PaneGroup
  direction="horizontal"
  class="max-w-[40%] items-start object-center rounded-lg translate-y-[-25%]"
>
  <Resizable.Pane defaultSize={1}>
    <div class="flex h-full items-center justify-center p-6">
      <a class="w-[40%] h-[40%]" target="_blank" href="http://www.firstinspires.org/robotics/frc">
        <img class="h-full w-full transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110" src="/images/first.svg" alt="first robotics" />
      </a>
    </div>
  </Resizable.Pane>
  <Resizable.Pane defaultSize={1}>
    <div class="flex h-full items-center justify-center p-6 object-contain">
      <a class="w-[72%] h-[40%]" target="_blank" href="https://www.youtube.com/c/ligerbots">
        <img class="w-full h-full transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110" src="/assets/e46d43c9-1e15-4e34-98a5-1bb9760ff078" alt="youtube" />
      </a>
    </div>
  </Resizable.Pane>
  <Resizable.Pane defaultSize={1}>
    <div class="flex h-full items-center justify-center p-6">
      <a class="w-[20%] h-[20%]" target="_blank" href="https://x.com/ligerbots">
        <img class="object-contain w-full h-full transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110" src="/assets/aaebd520-32cf-4c3e-bd31-9d8a5178ee05" alt="x" />
      </a>
    </div>
  </Resizable.Pane>
  <Resizable.Pane defaultSize={1}>
    <div class="flex h-full items-center justify-center p-6">
      <a class="block w-[20%] h-[40%]" target="_blank" href="https://www.facebook.com/The-LigerBots-162121450506644/">
        <img class="w-full h-full transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110" src="/assets/a32f4f54-b323-45ee-a624-59276a135108" alt="facebook" />
      </a>
    </div>
  </Resizable.Pane>
  <Resizable.Pane defaultSize={1}>
    <div class="flex h-full items-center justify-center p-6">
      <a class="header-link w-[20%] h-[38%]" target="_blank" href="https://www.instagram.com/ligerbots_frc2877/">
        <img class="w-full h-full transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110" src="/assets/3806f78a-68c5-4b0c-8f1d-9ac04481e94c" alt="instagram" />
      </a>
    </div>
  </Resizable.Pane>
  <Resizable.Pane defaultSize={1}>
    <div class="flex h-full items-center justify-center p-6">
      <a class="header-link object-right h-[60%] w-[60%]" target="_blank" href="https://www.flickr.com/photos/ligerbots/">
        <img class="w-full h-full object-contain transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110" src="/assets/cf477ab4-9c50-417f-b8b7-a30a24e843d8" alt="flickr" />
      </a>
    </div>
  </Resizable.Pane>
  <Resizable.Pane defaultSize={1}>
    <div class="flex h-full items-center justify-center p-6">
      <a class="header-link h-[60%] w-[60%]" href="/sponsor-us">
        <img class="w-full h-full object-contain transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110" src="/assets//5bb9e371-74d4-4462-ae03-de76107749e7" alt="donate" />
      </a>
    </div>
  </Resizable.Pane>
</Resizable.PaneGroup>
</div>

<!-- <div class="w-3/5 m-auto flex translate-x-1/7" id="icon-list"> -->
<!--   <ul class="flex w-1/2 -translate-y-20 gap-10 h-5 self-auto"> -->
    <!-- <li> -->
    <!--   <a class="object-center block w-[150%] h-[150%]"  target="_blank" href="http://www.firstinspires.org/robotics/frc"> -->
    <!--     <img class="h-full w-full transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110" src="/images/first.svg" alt="first robotics" /> -->
    <!--   </a> -->
    <!-- </li> -->
    <!-- <li> -->
    <!--   <a class="object-center block overflow-visible w-full h-full" target="_blank" href="https://www.youtube.com/c/ligerbots"> -->
    <!--     <img class="object-contain w-[100%] h-[100%] transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110" src="/assets/e46d43c9-1e15-4e34-98a5-1bb9760ff078" alt="youtube" /> -->
    <!--   </a> -->
    <!-- </li> -->
    <!-- <li> -->
    <!--   <a class="block w-[100%] h-[100%]" target="_blank" href="https://x.com/ligerbots"> -->
    <!--     <img class="object-contain w-full h-full transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110" src="/assets/aaebd520-32cf-4c3e-bd31-9d8a5178ee05" alt="x" /> -->
    <!--   </a> -->
    <!-- </li> -->
    <!-- <li> -->
    <!--   <a class="block w-[100%] h-[100%]" target="_blank" href="https://www.facebook.com/The-LigerBots-162121450506644/"> -->
    <!--     <img class="w-full h-full object-contain transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110" src="/assets/a32f4f54-b323-45ee-a624-59276a135108" alt="facebook" /> -->
    <!--   </a> -->
    <!-- </li> -->
    <!-- <li> -->
    <!--   <a class="header-link w-[100%] h-[100%]" target="_blank" href="https://www.instagram.com/ligerbots_frc2877/"> -->
    <!--     <img class="w-full h-full object-contain transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110" src="/assets/3806f78a-68c5-4b0c-8f1d-9ac04481e94c" alt="instagram" /> -->
    <!--   </a> -->
    <!-- </li> -->
    <!-- <li> -->
    <!--   <a class="header-link object-right" target="_blank" href="https://www.flickr.com/photos/ligerbots/"> -->
    <!--     <img class="w-full h-full object-contain transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110" src="/assets/cf477ab4-9c50-417f-b8b7-a30a24e843d8" alt="flickr" /> -->
    <!--   </a> -->
    <!-- </li> -->
<!--     <li> -->
<!--       <!-- &nbsp;&nbsp; -->
<!--       <a class="header-link" href="/sponsor-us"> -->
<!--         <img class="w-full h-full object-contain transition delay-150 duration-150 ease-in-out hover:-translate-y-1 hover:scale-110" src="/assets//5bb9e371-74d4-4462-ae03-de76107749e7" alt="donate" /> -->
<!--       </a> -->
<!--     </li> -->
<!--   </ul> -->
<!-- </div> -->
<!-- #icon-list -->
