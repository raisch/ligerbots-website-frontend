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

  /** @type {PageData}*/
  export let data

  /** @type {DirectoryUserList}*/
  export let users = data.users
</script>

<svelte:head>
  <title>LigerBots Directory</title>
  <meta property="og:title" content="LigerBots Directory" />
</svelte:head>

<div class="flex flex-col space-y-4">
  <div class="w-full">
    <center>
      <div class="text-center font-serif font-bold text-lg bg-orange-600 text-white py-2 rounded-lg">LIGERBOTS DIRECTORY</div>
      <br />
      <br />
      The information on this page is confidential - It is only available to registered and approved users.
      <br />
    </center>

    <table class="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">First Name</th>
          <th class="py-2 px-4 border-b">Last Name</th>
          <th class="py-2 px-4 border-b">Phone Number</th>
          <th class="py-2 px-4 border-b">Email</th>
          <th class="py-2 px-4 border-b">Address</th>
          <th class="py-2 px-4 border-b">School</th>
          <th class="py-2 px-4 border-b">Role</th>
        </tr>
      </thead>
      <tbody>
        {#each users as user}
          <tr>
            <td class="py-2 px-4 border-b">{user.firstname}</td>
            <td class="py-2 px-4 border-b">{user.lastname}</td>
            <td class="py-2 px-4 border-b">{user.phone_number}</td>
            <td class="py-2 px-4 border-b">{user.email_address}</td>
            <td class="py-2 px-4 border-b">{user.address}</td>
            <td class="py-2 px-4 border-b">{user.school}</td>
            <td class="py-2 px-4 border-b">{user.groups ? user.groups.join(', ') : ''}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <form class="flex items-center space-x-2 mt-4" action="/" method="post">
      <!-- TODO make this work! -->
      <button type="submit" name="download_users" class="bg-gray-200 text-gray-700 py-2 px-4 rounded">Download Userlist</button>
    </form>
  </div>
</div>
