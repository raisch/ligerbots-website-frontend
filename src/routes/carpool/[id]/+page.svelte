<script>
  // List Carpool Event Details
  // path: /carpool/[id]
  import { goto } from '$app/navigation';
  import CarpoolTrip from '$lib/components/CarpoolTrip.svelte';
  import { onMount } from 'svelte';

  /**
   * @typedef {Object} EventRecord
   * @property {Event} event - The event details
   */

  /**
   * @typedef {Object} Event
   * @property {string} id - The unique identifier for the event
   * @property {string} name - The name of the event
   * @property {string} description - A brief description of the event
   * @property {string} start_date - The start date of the event
   * @property {string} end_date - The end date of the event
   * @property {string} location - The location of the event
   * @property {Array<Trip>} trips - An array of trips associated with the event
   */

  /**
   * @typedef {import('$lib/server/trip').Trip} Trip
   */

  /**
   * @typedef {Array<Trip>} Trips
   */

  /** @type {{ data?: EventRecord }} */
  let { data } = $props();

  /** @type {Event|undefined} */
  let event = $derived(data?.event);

  /** @type {Trips} */
  let trips = $derived(event?.trips || []);

  let destinationRideId = $state(/** @type {number | null} */ (null));
  let returnRideId = $state(/** @type {number | null} */ (null));
  
  //@ts-ignore
  function setDestinationRideId(rideId) {
    destinationRideId = destinationRideId === rideId ? null : rideId;
  }

  //@ts-ignore
  function setReturnRideId(rideId) {
    returnRideId = returnRideId === rideId ? null : rideId;
  }

  async function updateRideSelections() {
    try {
      // get user from sessionStorage or cookie
      let user = null
      const raw = sessionStorage.getItem('user')
      if (raw) {
        user = JSON.parse(raw)
      } else {
        // fallback to cookie
        const m = document.cookie.match(/(?:^|; )user=([^;]+)/)
        if (m) {
          user = JSON.parse(decodeURIComponent(m[1]))
        }
      }

      const payload = {
        destinationRideId,
        returnRideId,
        previousDestinationRideId,
        previousReturnRideId,
        userId: user.id
      }

      const res = await fetch('/api/carpool/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await res.json()
      if (!res.ok) {
        console.error(result)
        alert(result?.error || 'Failed to update ride selections')
        return
      }

      // update previous selections to current selections
      previousDestinationRideId = destinationRideId
      previousReturnRideId = returnRideId

      alert('Ride selections updated')
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert('An error occurred while updating ride selections')
    }
  }

  /** @type {number | null} */
  let previousDestinationRideId = null;
  /** @type {number | null} */
  let previousReturnRideId = null;

  let isAdmin = false;
  /** @type String*/
  let userId = "";

  onMount(() => {
    const user = sessionStorage.getItem('user');

    if (user) {
      const parsedUser = JSON.parse(user);
      isAdmin = parsedUser.is_admin;
      userId = parsedUser.id;

      console.log(parsedUser)
    }

    if (userId) {
      for (let i = 0; i < trips?.length; i++) { // finding user's current rides
        const trip = trips[i];
        for (let j = 0; j < trip.item.rides.length; j++) {
          const ride = trip.item.rides[j];
          const riders = ride.item.riders;
          for (let k = 0; k < riders.length; k++) {
            const rider = riders[k];
            if (rider.item.id === userId) {
              if (trip.collection === 'destination_trip') {
                destinationRideId = parseInt(ride.item.id);
                previousDestinationRideId = parseInt(ride.item.id);
              } else if (trip.collection === 'return_trip') {
                returnRideId = parseInt(ride.item.id);
                previousReturnRideId = parseInt(ride.item.id);
              }
            }
          }
        }
      }
    }

    if (previousDestinationRideId && !previousReturnRideId) {
      previousReturnRideId = -1;
      returnRideId = -1;
    }
    if (!previousDestinationRideId && previousReturnRideId) {
      previousDestinationRideId = -1;
      destinationRideId = -1;
    }
  });
</script>


<div class="container mt-4">
  <h1>Carpool Event Detail Page</h1>

  <div class="row" style="background-color: #eee; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
    <div class="">
      <div class="card mb-6">
        <div class="card-body">
          <h2 class="card-title">{event?.name}</h2>
          <p class="card-text">{event?.description}</p>
          <p class="card-text"><strong>Start Date:</strong> {event?.start_date}</p>
          <p class="card-text"><strong>End Date:</strong> {event?.end_date}</p>
          <p class="card-text"><strong>Location:</strong> {event?.location}</p>
          <div style="display: flex; flex-wrap: wrap; flex-direction: column;">
            {#if trips.length > 0}
              <div style="display: flex; justify-content: space-between;">
                <div style="list-style-type: none; padding: 0; float: left; width: 49%;">
                  <div style="font-size: 25px; padding-bottom: 5px;">Destination Trips</div>
                  <div style="display: flex; gap: 5px; padding-bottom: 5px; align-items: center;">
                    <div 
                    style={`width: 15px; height: 15px; background-color: ${destinationRideId === -1 ? '#3375a6' :  'transparent'}; border-radius: 5px; border: 1.5px solid #3375a6; margin-left: 2px;`}
                    onclick={() => {
                      setDestinationRideId(-1)
                    }}
                    ></div>
                    <div style="font-size: 12px;">Opt Out</div>
                  </div>
                  
                  {#each trips.filter(trip => trip.collection === 'destination_trip') as trip}
                    <CarpoolTrip {trip} RideId={destinationRideId} SetId={setDestinationRideId} previousDestinationRideId={previousDestinationRideId} previousReturnRideId={previousReturnRideId} />
                  {/each}
                </div>
                <div style="list-style-type: none; padding: 0; float: right; width: 49%;">
                  <div style="font-size: 25px; padding-bottom: 5px;">Return Trips</div>
                  <div style="display: flex; gap: 5px; padding-bottom: 5px; align-items: center;">
                    <div 
                      style={`width: 15px; height: 15px; background-color: ${returnRideId === -1 ? '#3375a6' :  'transparent'}; border-radius: 5px; border: 1.5px solid #3375a6; margin-left: 2px;`}
                      onclick={() => setReturnRideId(-1)}
                    ></div>
                    <div style="font-size: 12px;">Opt Out</div>
                  </div>
                  {#each trips.filter(trip => trip.collection === 'return_trip') as trip}
                    <CarpoolTrip {trip} RideId={returnRideId} SetId={setReturnRideId} previousDestinationRideId={previousDestinationRideId} previousReturnRideId={previousReturnRideId} />
                  {/each}
                </div>
              </div>
              <button class="confirm" disabled={destinationRideId === null || returnRideId === null || (destinationRideId === previousDestinationRideId && returnRideId === previousReturnRideId)} onclick={updateRideSelections}>Confirm</button>
            {:else}
              <p>No trips available for this event.</p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="css">
  .badge-success {
    background-color: #28a745;
  }
  .badge-danger {
    background-color: #dc3545;
  }
  .badge-secondary {
    background-color: #6c757d;
  }
  .card {
    border-radius: 15px;
  }

  .confirm {
    background-color: #3375a6;
    cursor: pointer;
    color: white;
    border-radius: 5px;
    border: none;
    padding: 5px;
    min-width: 120px;
    align-self: center;
  }
  .confirm:disabled {
    background-color: #808080;
    cursor: not-allowed;
  }
</style>
