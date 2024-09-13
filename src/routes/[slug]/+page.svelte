<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<center><div class="notindex-title">{data.page.title}</div></center>
<div class="level4-heading"></div>
{@html data.page.content}
