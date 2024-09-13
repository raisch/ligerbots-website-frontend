<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>
<h1>PROFILE for {data.properName}</h1>
<pre>{JSON.stringify(data, null, 2)}</pre>
<img id="profile-{data.fileId}" alt="profile photo for {data.slug}" src="{data.url}">
