<script lang="ts">
  // import { invalidateAll } from "$app/navigation";
  import type { EventRecord, EventUserRecord } from "$lib/server/event";
  import { removeFromRide, setRideSelection, updateRideSelections } from "../../routes/carpool/ride.remote";

  let { SetMovingUser, user, event, type }: {
    SetMovingUser: (userId: string | null, currentRideId: string | null, currentTripType: 'destination_trip' | 'return_trip' | null) => void,
    user: EventUserRecord | null,
    event: EventRecord,
    type: 'destination_trip' | 'return_trip',
    // otherRides: Record<"destination_trip" | "return_trip", string | null>
  } = $props();

  let trips = $derived(event.trips?.filter(trip => trip.collection === type) ?? []);

  async function moveUser(id: string) {
    if (!user) {
      console.error('No user to move');
      return;
    }
    setRideSelection({ event: event.id, user: user.id, rides: { [type]: id } });
    exit();
  }
  async function optoutUser() {
    if (!user) {
      console.error('No user to opt out');
      return;
    }
    setRideSelection({ event: event.id, user: user.id, rides: { [type]: null } });
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

  <div class="move-rider-container">
    {#each trips as trip, i}
      {@const { item } = trip || {}}
      <h4>{item.departs_from} to {item.destination} - {item.departs_on} from {item.departs_at} to {item.arrives_at}</h4>
      <div>
        {#each item.rides as {item: { id, ride }}}
          <button class="btn btn-primary" onclick={() => moveUser(id)}>{ride.name}</button>
        {/each}
      </div>
    {/each}
  </div>

  <div class="move-rider-remove">
    <button class="btn btn-danger" onclick={optoutUser}>Opt Out User</button>
    <button class="btn btn-danger" onclick={removeUser}>Remove User</button>
  </div>
  <button class="btn" onclick={exit}>Cancel</button>
</div>

<style>
  div.move-rider-dialog {
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
    /* max-height: calc(100vh - 100px); */
  }
  div.move-rider-dialog > h2 {
    margin-top: 0;
  }
  div.move-rider-dialog > div.move-rider-container {
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    column-count: 2;
    margin-top: 12px;
    height: calc(100vh - 300px);
    overflow: auto;
  }
  div.move-rider-dialog > div.move-rider-container > div {
    display: flex;
    justify-content: space-between;
  }
  div.move-rider-dialog > div.move-rider-container > div > button {
    height: 30px;
    width: calc(50% - 2px);
  }
  div.move-rider-dialog > button {
    width: 50%;
    margin: 10px 25% 0;
  }
  div.move-rider-dialog > div.move-rider-remove {
    display: flex;
    justify-content: space-between;
    gap: 2px;
  }
  div.move-rider-dialog > div.move-rider-remove > button {
    width: calc(50% - 2px);
  }
  div.move-rider-dialog > button:hover {
    background-color: #ddd;
  }
</style>