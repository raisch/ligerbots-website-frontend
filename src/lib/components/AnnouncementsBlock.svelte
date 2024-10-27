<script>
  import LinkIcon from './icons/LinkIcon.svelte'
  import { onMount } from 'svelte'

  export let posts;

  const truncate = (input, max) => input.length > 5 ? `${input.substring(0, max)}...` : input; // A function to cut off the text if it is too long

  let getTextFromHTML = () => 'Loading...'; // Return loading for now, but once the page is loaded, it gets replaced with the actual function

  onMount(() => {
    // A quick function to extract only the text from the HTML
    getTextFromHTML = (html) => {
      let div = document.createElement('div');
      div.innerHTML = html;
      let data = div.textContent || div.innerText || ''

      div.remove();

      return data;
    }
  });
</script>

<div class="col-md-6 col-sm-12">
  <div class="panel panel-blue">
    <div class="panel-heading index-heading">
      <a href="/announcement" style="color: white;">ANNOUNCEMENTS&nbsp;<LinkIcon /></a>
    </div>

    {#if posts.error}
      <p class="text-center" style="font-size: 30px; color: red; margin-top: 10px;">ERROR</p>
      <p class="text-center">There was an error while trying to load the announcements.</p>
      <p class="text-center"><a href="/announcement">You can try this link.</a></p>
    {/if}

    {#if !posts.error }
      {#each posts.posts as post}
        {#if post.status === "published" && post.type === "announcement"}
          <div id="ann-panel" class="panel-body">
            <div class="announce text-margins">
              <div class="announce-title">
                <a href={`/announcement/${post.slug}`}>{ post.title }</a>
              </div>
              <div class="announce-date">{ post.publish_on }</div>
              <div class="announce-content">
                <p>
                  { truncate(getTextFromHTML(post.body), 200) }
                  <a href={`/announcement/${post.slug}`} class="more-link">Continue Reading <span class="screen-reader-text">“{ post.title }”</span></a>
                </p>
              </div>
            </div>
          </div>
        {/if}
      {/each}
    {/if}

  </div>
</div>
