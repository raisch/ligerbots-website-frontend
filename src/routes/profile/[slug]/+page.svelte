<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>
<h1>PROFILE</h1>
<pre>{JSON.stringify(data, null, 2)}</pre>
<img id="profile-{data.fileId}" src="{data.url}"/>
