<script lang="ts">
  import UserShortDisplay from './UserShortDisplay.svelte';

  import type { RideType } from "$lib/server/ride";

  let { ride }: { ride: RideType } = $props();

  // svelte-ignore state_referenced_locally
  const {id, ride: {name, seats, driver}, riders, riders_func: {count}} = ride?.item;
</script>

<div class="ride-item">
  {#if id !== '!optout'}
    <p style="margin-bottom: 0"><b>{name}</b> ({count}/{seats} seats)</p>
  {:else}
    <h4>Opted Out</h4>
  {/if}
  <ul>
    {#if ride}
      {#each driver as rider}
        <!-- should only be one but technically multiple is allowed my the database schema -->
        <UserShortDisplay user={rider.item} driver />
      {/each}
    {/if}
    {#if riders && riders.length > 0}
      {#each riders as rider}
        <UserShortDisplay user={rider.item} />
      {/each}
    {:else}
      <li><i>No riders for this ride</i></li>
    {/if}
  </ul>
</div>

<style>
  ul {
    list-style-type: none;
    padding-left: 10px;
  }
</style>