<script lang="ts">
  import type { EventUserRecord } from "$lib/server/event";
  import UserShortDisplay from "./UserShortDisplay.svelte";

  let { users }: { users: EventUserRecord[] } = $props(); 
</script>

<ul>
  {#each users as user}
    <UserShortDisplay {user} />
  {/each}
</ul>

<style>
  ul {
    list-style-type: none;
    padding-left: 10px;
  }
</style>