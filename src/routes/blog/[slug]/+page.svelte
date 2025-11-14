<script>
  let { data } = $props();
</script>

<div class="col-md-10 col-md-offset-1 col-sm-12">
  <div class="level4-heading">{post.title}</div>
  <div class="announce-date">{post.publish_on}</div>
  <div class="blog-content">
    <p>{@html post.body}</p>
  </div>
</div>
