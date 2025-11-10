<!-- 
  TODO: Make BlogBlock its own part of api
  TODO: Make BlogBlock's image dynamically change
-->

<script>
  import LinkIcon from './icons/LinkIcon.svelte'
  import { onMount } from 'svelte'

  let data;

  onMount(async () => { 
    try {
      const res = await fetch('/api/announcements');
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const announcements = await res.json();
      data = announcements.result[0]
      console.log('blog:', announcements.result[0]);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  })
  // <LinkIcon />
</script>

<div class="rounded-[5px] border-1 border-[#939598] h-[625px] shadow-[5px_5px_15px_-10px_rgba(0,0,0,25)] flex flex-col overflow-hidden">
  <div class="ligerbots-blue-background text-center flex-none h-[60px] align-middle flex justify-center items-center">
    <a href="/post" data-svelte-h="svelte-i5en1z" class="font-[700] font-[PT_Serif] text-[#FFFFFF] text-[17pt] no-underline hover:underline">LIGERBOTS BLOG </a>
  </div>
  {#if data}
  <div class="!h-[540px] flex-none">
    <div class="blog-image-box justify-center h-[390px]">
      <img src="/images/Enabling-Engineering-2024.webp" class="h-auto w-full object-contain" alt="enabling engineering internship 2024" />
    </div>
    <div class="mx-auto py-4 justify-center h-[145px] -mt-[25px] px-[20px]">
        <div class="[&_img]:hidden [&_*]:max-w-full [&_*]:wrap-break-word [&_*]:font-[Open_Sans] [&_*]:text-[#333] [&_*]:font-[12pt] [&_*]:tracking-[0.04em]">
          <span class="inline">
            <span class="inline [&_*]:inline">{@html data.lede}</span>
          </span>
        </div>
    </div>
  </div>
  <div class="flex justify-center text-center h-[40px] flex-none -mt-[25px]">
    <a href="/post/{data.slug}"
      ><img src="/images/read_more_flat.svg" alt="Read More" /></a>
  </div>
  {:else}
    Loading blog post...
  {/if}
</div>
