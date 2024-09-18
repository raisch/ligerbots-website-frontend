<script>
  import App from "../../App.svelte"
  export let data

  /**
   * @param {{ has_photo: boolean, slug: string }} user
   */
  function imageForStudent(user) {
    if (user.has_photo) {
      return "/images/protected/students/" + user.slug + ".jpg"
    }
    return "/images/default_user.jpg"
  }
</script>

<svelte:head>
  <title>LigerBots Facebook</title>
  <meta property="og:title" content="LigerBots Facebook" />
</svelte:head>

<App>
  {#each data.users as user}
    {#if user.groups.includes("Student")}
      <div class="facebook-entry">
        <img src={imageForStudent(user)} alt="Profile picture of {user.fullname}" />
        <br />
        <div class="name">{user.fullname}</div>
        <div class={user.school.toLowerCase()}>{user.school}</div>
      </div>
    {/if}
  {/each}
</App>
