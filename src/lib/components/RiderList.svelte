<script lang="ts">
  import type { TripType } from "$lib/server/trip";
  import RiderListTrip from "./RiderListTrip.svelte";

  let { trips, printMode = false }: { trips: TripType[], printMode?: boolean } = $props();

  let destinationTrips = trips.filter(trip => trip.collection === 'destination_trip');
  let returnTrips = trips.filter(trip => trip.collection === 'return_trip');
</script>

<div class="rider-list">
  <div class="trip-section">
    <h3>Destination Trips</h3>
    <div class="trips">
      {#if destinationTrips.length > 0}
        {#each destinationTrips as trip}
          <RiderListTrip {trip} {printMode} />
        {/each}
      {:else}
        <p><i>No destination trips for this event</i></p>
      {/if}
    </div>
  </div>
  <div class="trip-section">
    <h3>Return Trips</h3>
    <div class="trips">
      {#if returnTrips.length > 0}
        {#each returnTrips as trip}
          <RiderListTrip {trip} {printMode} />
        {/each}
      {:else}
        <p><i>No return trips for this event</i></p>
      {/if}
    </div>
  </div>
</div>



<style>
  .rider-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .trips {
    display: flex;
    flex-wrap: wrap;
  }
  :global(.trip-item) {
    min-width: 50%;
  } 
</style>