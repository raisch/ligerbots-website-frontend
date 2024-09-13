<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>
<pre>{JSON.stringify(data, null, 2)}</pre>
<img src="{data.url}" id="{data.fileId}">
