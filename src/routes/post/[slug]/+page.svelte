<script>
  export let data
</script>

<div class="col-md-10 col-md-offset-1 col-sm-12">
  <div class="level4-heading">{data.post.title}</div>
  <div class="announce-date">{data.post.publish_on}</div>
  <div class="blog-content">
    <p>{@html data.post.body}</p>
  </div>
</div>
