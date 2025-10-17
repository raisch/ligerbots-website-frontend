<script>
  import { page } from '$app/stores'
  import { error } from '@sveltejs/kit';

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

  // console.log('user:', user)
  export let user
</script>

<svelte:head>
  <title>LigerBots Directory</title>
  <meta property="og:title" content="LigerBots Directory" />
</svelte:head>

{#if !user}
  <div class="flex flex-col w-full">
    <center class="basis-1/12 font-[Open_Sans] text-[13pt] w-full text-black/80">
      <div class="bg-[#D04E1D] text-white text-[20pt] font-[PT_Serif] font-bold text-ellipsis overflow-hidden w-1/3 h-full px-2 py-3 rounded-md">LIGERBOTS DIRECTORY</div>
      <br />
      <br />
      The information on this page is confidential - It is only available to registered and approved users.
      <br />
    </center>

    <div class="w-full overflow-x-auto">
      <table class="table-auto [&_tr:nth-child(even)]:bg-[#f9f9f9] [&_tr:nth-child(odd)]:bg-white font-[Open_Sans] min-w-full">
        <thead>
          <tr class="text-[16px] border-b border-gray-200">
            <th class="py-[10px]">First Name</th>
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
            <tr class="border-b border-gray-200">
              <td class="py-[10px] pl-[5px]">{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.phone_number}</td>
              <td>{user.email_address}</td>
              <td>{user.address}</td>
              <td>{user.school}</td>
              <td class="pr-[5px]">{user.groups ? user.groups.join(', ') : ''}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <form class="form-inline" action="/" method="post">
      <!--
        TODO: Fix the download user button in the directory
      -->
      <button type="submit" name="download_users" class="btn btn-default">Download Userlist</button>
    </form>
  </div>
{:else}
  <div>e</div>
{/if}
