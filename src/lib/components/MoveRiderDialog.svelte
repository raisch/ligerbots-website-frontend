<script lang="ts">
  import type { EventRecord, EventUserRecord } from "$lib/server/event";
  import { removeFromRide, updateRideSelections } from "../../routes/carpool/ride.remote";

  let { SetMovingUser, user, event, type, otherRides }: {
    SetMovingUser: (userId: string | null, currentRideId: string | null, currentTripType: 'destination_trip' | 'return_trip' | null) => void,
    user: EventUserRecord | null,
    event: EventRecord,
    type: 'destination_trip' | 'return_trip',
    otherRides: Record<"destination_trip" | "return_trip", string | null>
  } = $props();

  let trips = $derived(event.trips?.filter(trip => trip.collection === type) ?? []);

  async function moveUser(id: string) {
    if (!user) {
      console.error('No user to move');
      return;
    }
    updateRideSelections({ event: event.id, user: user.id, rides: { ...otherRides, [type]: id } });
    exit();
  }
  async function optoutUser() {
    if (!user) {
      console.error('No user to opt out');
      return;
    }
    updateRideSelections({ event: event.id, user: user.id, rides: otherRides });
    exit();
  }
  async function removeUser() {
    if (!user) {
      console.error('No user to remove');
      return;
    }
    removeFromRide({ event: event.id, user: user.id });
    exit();
  }
  function exit() {
    SetMovingUser(null, null, null);
  }
</script>

<div class="move-rider-dialog">
  <h2>Moving {user?.firstname} {user?.lastname}</h2>

  {#each trips as trip, i}
    {@const { item } = trip || {}}
    <h4>{item.departs_from} to {item.destination} - {item.departs_on} from {item.departs_at} to {item.arrives_at}</h4>
    {#each item.rides as {item: { id, ride }}}
      <button onclick={() => moveUser(id)}>{ride.name}</button>
    {/each}
    {#if i < trips.length - 1}
      <hr>
    {/if}
  {/each}

  <button onclick={optoutUser}>Opt Out User</button>
  <button onclick={removeUser}>Remove User</button>
  <button onclick={exit}>Cancel</button>
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    position: absolute;
    width: 500px;
    height: auto;
    top: 120px;
    left: calc(50% - 250px);
    z-index: 5;
    background-color: white;
  }
  button {
    max-width: 50%;
  }
</style>