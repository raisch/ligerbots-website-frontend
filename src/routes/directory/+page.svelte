<script>
  import { page } from '$app/stores'

  // console.log(`in directory/+page.js, page is ${JSON.stringify($page, null, 2)}`)

  /**
   * @typedef {Array.<import('../../lib/server/user').DirectoryUserRecord>} DirectoryUserList
   */

  /**
   * @typedef {Object} PageData
   * @property {DirectoryUserList} users
   */

  requireLogin()
  
  /** @type {PageData}*/
  export let data

  /** @type {DirectoryUserList}*/
  export let users = data.users
</script>

<svelte:head>
  <title>LigerBots Directory</title>
  <meta property="og:title" content="LigerBots Directory" />
</svelte:head>

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
        {#each users as user}
          <tr>
            <td>{user.firstname}</td>
            <td>{user.lastname}</td>
            <td>{user.phone_number}</td>
            <td>{user.email_address}</td>
            <td>{user.address}</td>
            <td>{user.school}</td>
            <td>{user.groups ? user.groups.join(', ') : ''}</td>
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
