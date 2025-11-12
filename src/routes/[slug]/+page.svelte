<!-- 
  I got bored, so I just did the giant mess that is line 23. It targets most elements with their corresponding tailwind-version of css, but it's only a temporary fix. Certain things, like the youtube embed in the "join" page or the donate buttons in the "sponsor-us" page are broken. 
  TODO: Get the tailwind styles for individual pages into directus
-->

<script>
  /** @type {import('./$types').PageData} */
  export let data

  export let title = data?.page?.title
  export let script = data?.page?.script
  export let style = data?.page?.style
  export let content = data?.page?.content
</script>

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content={title} />
</svelte:head>

<center><div class="bg-[#D04E1D] text-white text-[20pt] font-[PT_Serif] font-bold text-center w-fit h-full px-[40px] py-3 rounded mb-[30px]">{title}</div></center>
<div class="px-[100px] mb-[20px]">
  <div class="[&_*]:text-[#333] [&_.level4-heading]:mb-[20px] [&_.level4-heading]:text-[#0066b3] [&._level4-heading]:text-[20pt] [&_.level4-heading]:font-[Open_Sans] [&_.level4-heading]:font-bold [&_.level4-heading]:mx-auto [&_.level4-heading]:text-center [&_.level4-heading]:w-1/3 [&_.level4-heading]:py-[12px] [&_.level4-heading]:text-[18pt] [&_*]:tracking-[0.04em] [&_img]:bg-none [&_img]:!w-[725px] [&_img]:!max-w-[725px] [&_.image-border-blue]:flex [&_.image-border-blue]:flex-col [&_.image-border-blue]:items-center [&_img]:border-1 [&_img]:border-[#939598] [&_img]:rounded [&_img]:shadow-lg [&_img]:shadow-black/40 [&_a]:text-[#337ab7] [&_a]:hover:underline [&_a]:hover:text-[#2864ad] [&_ul]:list-disc [&_ul]:list-inside [&_ul]:pl-[30px] [&_iframe]:w-full [&_.calendar]:h-[600px]">
    {#if script}
      {@html script}
    {/if}
    {#if style}
      {@html style}
    {/if}
    {@html content}
  </div>
</div>
