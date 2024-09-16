<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>
<pre>{JSON.stringify(data, null, 2)}</pre>
<img alt="image for {data.fileId}" src="{data.url}" id="{data.fileId}">
