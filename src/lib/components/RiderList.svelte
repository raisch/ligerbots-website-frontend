<script lang="ts">
  import type { TripType } from "$lib/server/trip";
  import RiderListTrip from "./RiderListTrip.svelte";

  let { trips }: { trips: TripType[] } = $props();

  let destinationTrips = trips.filter(trip => trip.collection === 'destination_trip');
  let returnTrips = trips.filter(trip => trip.collection === 'return_trip');
</script>

<div class="rider-list">
  <div class="trip-section">
    <h2>Destination Trips</h2>
    <div class="trips">
      {#if destinationTrips.length > 0}
        {#each destinationTrips as trip}
          <RiderListTrip {trip} />
        {/each}
      {:else}
        <p>No destination trips for this event</p>
      {/if}
    </div>
  </div>
</div>