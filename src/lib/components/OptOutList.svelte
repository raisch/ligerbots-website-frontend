<script lang="ts">
  import type { AttendeeUserType } from "$lib/server/user";
  import UserList from "./UserList.svelte";

  let { users }: { users: AttendeeUserType[] } = $props();
</script>

<div class="optout">
  <h4>Opted Out</h4>
  {#if users && users.length > 0}
    <UserList users={users.map(user => user.users_id)} />
  {:else}
    <p><i>No attendees have opted out of carpools for this event</i></p>
  {/if}
</div>