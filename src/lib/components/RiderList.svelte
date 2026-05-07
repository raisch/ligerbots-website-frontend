<script lang="ts">
  import type { EventCarpoolOptOut as EventCarpoolOptOut, EventType } from "$lib/server/event";
  import OptOutList from "./OptOutList.svelte";
  import RiderListTrip from "./RiderListTrip.svelte";
  
  let { event, optout }: { event: EventType, optout: EventCarpoolOptOut } = $props();
  // svelte-ignore state_referenced_locally
  let { trips } = event;

  let destinationTrips = trips?.filter(trip => trip.collection === 'destination_trip') ?? [];
  let returnTrips = trips?.filter(trip => trip.collection === 'return_trip') ?? [];
</script>

<div class="rider-list">
  <div class="trip-section">
    <h3>Destination Trips</h3>
    <div class="trips">
      {#if destinationTrips.length > 0}
        {#each destinationTrips as trip}
          <RiderListTrip {trip} />
        {/each}
      {:else}
        <p><i>No destination trips for this event</i></p>
      {/if}
    </div>
    <OptOutList users={optout.to} />
  </div>
  <div class="trip-section">
    <h3>Return Trips</h3>
    <div class="trips">
      {#if returnTrips.length > 0}
        {#each returnTrips as trip}
          <RiderListTrip {trip} />
        {/each}
      {:else}
        <p><i>No return trips for this event</i></p>
      {/if}
    </div>
    <OptOutList users={optout.from} />
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