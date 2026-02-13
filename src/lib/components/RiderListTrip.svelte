<script lang="ts">
  import RiderListRide from './RiderListRide.svelte';

  import type { TripType } from "$lib/server/trip";
  import { formatDate, prettyDate, prettyTime } from '$lib/util';

  let { trip }: { trip: TripType } = $props();

  const {item: {departs_from, destination, departs_on, departs_at, arrives_at, rides}} = trip
</script>

<div class="trip-item">
  <h4>{departs_from} to {destination}</h4>
  <p>{prettyDate(departs_on)} from {prettyTime(`${departs_on} ${departs_at}`)} to {prettyTime(`${departs_on} ${arrives_at}`)}</p>
  <div class="riders">
    {#if rides && rides.length > 0}
      {#each rides as ride}
        <RiderListRide {ride} />
      {/each}
    {:else}
      <p><i>No rides for this trip</i></p>
    {/if}
  </div>
</div>