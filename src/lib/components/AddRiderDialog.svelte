<script lang="ts">
  import type { EventRecord, EventUserRecord, UserType } from "$lib/server/event";
  import { search } from "$lib/util";
  import { removeFromRide, setRideSelection, updateRideSelections } from "../../routes/carpool/ride.remote";
  import UserShortDisplay from "./UserShortDisplay.svelte";

  let { SetMovingUser, users, event, ride, type }: {
    SetMovingUser: (userId: string | null, currentRideId: string | null, currentTripType: 'destination_trip' | 'return_trip' | null) => void,
    users: EventUserRecord[] | null,
    event: EventRecord,
    ride: string | null,
    type: 'destination_trip' | 'return_trip',
    // otherRides: Record<"destination_trip" | "return_trip", string | null>
  } = $props();

  let filter = $state('');

  async function addUser(id: string) {
    setRideSelection({ event: event.id, user: id, rides: { [type]: ride } });
    exit();
  }
  function exit() {
    SetMovingUser(null, null, null);
  }
</script>

<div class="add-rider-dialog">
  <h2>Adding rider</h2>
  <input placeholder="Filter users..." bind:value={filter}>

  <div>
    {#each users as user}
      {@const name = `${user.firstname} ${user.lastname}`}
      <button class="btn btn-primary"
        hidden={!search(filter, name, user.email_address ?? null, user.phone_number ?? null)} onclick={() => addUser(user.id)}
        disabled={event.trips?.some(trip => trip.collection === type && trip.item.rides.some(ride => ride.item.riders.some(rider => rider.item?.id === user.id)))}
      >
        {name}
      </button>
    {/each}
  </div>

  <button class="btn" onclick={exit}>Cancel</button>
</div>

<style>
  div.add-rider-dialog {
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
  div.add-rider-dialog > h2 {
    margin-top: 0;
  }
  div.add-rider-dialog > input {
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
  }
  div.add-rider-dialog > div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: space-between;
    gap: 2px;
    margin-top: 12px;
    height: calc(100vh - 300px);
    overflow: auto;
  }
  div.add-rider-dialog > div > button {
    height: 30px;
    width: calc(50% - 2px);
  }
  div.add-rider-dialog > div > button[hidden] {
    display: none;
  }
  div.add-rider-dialog > button {
    width: 50%;
    margin: 10px 25% 0;
  }
  div.add-rider-dialog > button:hover {
    background-color: #ddd;
  }
</style>