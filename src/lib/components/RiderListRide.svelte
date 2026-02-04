<script lang="ts">
  import RiderListRider from './RiderListRider.svelte';

  import type { RideType } from "$lib/server/ride";

  let {ride}: { ride: RideType } = $props();

  // svelte-ignore state_referenced_locally
  const {item: {ride: {name, seats, driver}, riders, riders_func: {count}}} = ride
</script>

<div class="ride-item">
  <h4>{name} ({count}/{seats} seats)</h4>
  <ul>
    {#each driver as rider}
      <!-- should only be one but technically multiple is allowed my the database schema -->
      <RiderListRider {rider} driver />
    {/each}
    {#if riders && riders.length > 0}
      {#each riders as rider}
        <RiderListRider {rider} />
      {/each}
    {:else}
      <li>No riders for this ride</li>
    {/if}
  </ul>
</div>

