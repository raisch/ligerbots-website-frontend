<script>
  export let data;
</script>

<div class="level4-heading">Announcements</div>

<!-- I know that this UI looks bad but its just for testing :) -->
<!-- But I tried to match the style as best I could -->

{#each data.posts.post as post}
  <div class="row page-body" style="margin-bottom: 10px; background: none;">
    <div class="col-md-12 col-md-offset-0 col-sm-10 col-sm-offset-1 col-xs-12">
      <div class="row row-margins">
        <div class="col-xs-12">
          <div style="padding: 10px;" class="panel panel-sprs">

            <a href={ `/announcement/${post.slug}` } style="font-size: 30px;">{ post.title }</a>
            <p>{ post.publish_on }</p>

          </div>
        </div>
      </div>
    </div>
  </div>
{/each}

<br><br>