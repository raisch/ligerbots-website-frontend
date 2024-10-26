<script>
  export let data;
</script>

<div class="level4-heading">Announcements</div>

<!-- I tried to match the style as best I could :) -->

{#each data.posts.post as post}
  {#if post.status === "published" && post.type === "announcement"}
    <div class="row mb-3 bg-transparent">
      <div class="col-md-12 offset-md-0 col-sm-10 offset-sm-1 col-xs-12">
        <div class="row">
          <div class="col-xs-12">
            <div class="panel panel-sprs" style="padding: 10px;">

              <a href={ `/announcement/${post.slug}` } class="h2">{ post.title }</a>
              <p>{ post.publish_on }</p>

            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
{/each}

<br><br>