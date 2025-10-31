<!--
  TODO: Add in the LigerBots Feed symbol
-->

<script>
  export let data

  console.log(data)
</script>

<svelte:head>
  <title>LigerBots Blog - {data.post.title}</title>
  <meta property="og:title" content="LigerBots Photos - {data.post.title}" />
</svelte:head>

<div class="flex flex-col px-[100px] w-full mx-auto items-center font-[Open_Sans]">
  <div class="w-full text-center text-[18pt] font-bold text-[#0066b3]">{data.post.title}</div>
  <br />
  <div class="w-full text-left italic">{data.post.publish_on}</div>
  <div class="flex flex-col break-words [&_img]:w-3/4 [&_img]:object-left [&_img]:object-contain w-full mx-auto tracking-[0.04em] [&_figcaption]:italic [&_figcaption]:mb-[20px] [&_figure]:mt-[20px] text-[12pt] text-[#333] font-[400]">
    <p>{@html data.post.body}</p>
  </div>

  <div class="w-full flex flex-row-reverse justify-between mt-[50px] mb-[25px] text-[14pt]">
    {#if data.nextPost} 
      <span class="text-[16pt] -mt-[3px]">&raquo;</span><a class="ml-auto text-[#337ab7] hover:text-[#2864ad] hover:underline font-medium font-[Open_Sans] cursor-pointer mr-[5px]" href="/post/{data.nextPost.slug}"> {data.nextPost.title}</a>
    {/if}

    {#if data.prevPost} 
      <a class="mr-auto text-[#337ab7] hover:text-[#2864ad] hover:underline font-medium font-[Open_Sans] cursor-pointer ml-[5px]" href="/post/{data.prevPost.slug}">{data.prevPost.title}</a><span class="text-[16pt] -mt-[3px]">&laquo;</span>
    {/if}
  </div>

  <a class="mx-auto text-[16pt] text-[#337ab7] hover:text-[#2864ad] hover:underline font-medium font-[Open_Sans]" href="/post">LigerBots Blog Feed</a>
</div>
