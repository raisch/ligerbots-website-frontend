<script lang="ts">
  import RiderListRider from './RiderListRider.svelte';

  import type { RideType } from "$lib/server/ride";

  let { ride, printMode = false }: { ride: RideType, printMode?: boolean } = $props();

  // svelte-ignore state_referenced_locally
  const {item: {ride: {name, seats, driver}, riders, riders_func: {count}}} = ride
</script>

<div class="ride-item">
  <p style="margin-bottom: 0"><b>{name}</b> ({count}/{seats} seats)</p>
  <ul>
    {#each driver as rider}
      <!-- should only be one but technically multiple is allowed my the database schema -->
      <RiderListRider {rider} driver {printMode} />
    {/each}
    {#if riders && riders.length > 0}
      {#each riders as rider}
        <RiderListRider {rider} {printMode} />
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