<script lang="ts">
  import RiderListRide from './RiderListRide.svelte';

  import type { TripType } from "$lib/server/trip";

  let {trip}: { trip: TripType } = $props();

  const {item: {departs_from, destination, departs_on, departs_at, arrives_at, rides}} = trip
</script>

<div class="trip-item">
  <h3>{departs_from} to {destination}</h3>
  <p>{departs_on} from {departs_at} to {arrives_at}</p>
  <div class="riders">
    {#if rides && rides.length > 0}
      {#each rides as ride}
        <RiderListRide {ride}/>
      {/each}
    {:else}
      <p>No rides for this trip</p>
    {/if}
  </div>
</div>