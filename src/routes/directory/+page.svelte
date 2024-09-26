<script>
  import App from '../../App.svelte'
  export let data

  import { page } from '$app/stores'

  // console.log(`in directory/+page.js, page is ${JSON.stringify($page)}`)

  /**
   * @param {{ has_photo: boolean, slug: string }} user
   */
  function imageForStudent(user) {
    if (user.has_photo) {
      return '/images/protected/students/' + user.slug + '.jpg'
    }
    return '/images/default_user2.jpg'
  }
</script>

<svelte:head>
  <title>LigerBots Directory</title>
  <meta property="og:title" content="LigerBots Directory" />
</svelte:head>

<App>
  <div class="row bottom-margin row-margins">
    <div class="col-xs-12">
      <center>
        <div class="notindex-title">LIGERBOTS DIRECTORY</div>
        <br />
        <br />
        The information on this page is confidential - It is only available to registered and approved users.
        <br />
      </center>

      <table class="table table-condensed table-striped">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Address</th>
            <th>School</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {#each data.users as user}
            <tr>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.phone_number}</td>
              <td>{user.email_address}</td>
              <td>{user.address}</td>
              <td>{user.school}</td>
              <td>{user.groups}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <form class="form-inline" action="/" method="post">
        <!-- TODO make this work! -->
        <button type="submit" name="download_users" class="btn btn-default">Download Userlist</button>
      </form>
    </div>
  </div>
</App>
