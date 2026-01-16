<script>
  // List Carpool Event Details
  // path: /carpool/[id]
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import CarpoolTrip from '$lib/components/CarpoolTrip.svelte';
  import { refresh } from '@directus/sdk';
  import { removeFromRide, updateRideSelections } from './ride.remote';
  import { onMount } from 'svelte';
  import CreateOrModifySignup from '$lib/components/CreateOrModifySignup.svelte';

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
   * @property {Array<Trip>=} trips - An array of trips associated with the event
   */

  /**
   * @typedef {import('$lib/server/trip').Trip} Trip
   */

  /**
   * @typedef {Array<Trip>} Trips
   */

  /** @type {{ data?: {event: Event, userId?: string, existingRides?: {id: string}[]} }} */
  let { data } = $props();

  let event = $derived(data?.event);
  $inspect(page.url.hash, event);

  /** @type {Trips} */
  let trips = $derived(event?.trips || []);

  let destinationRideId = $state(/** @type {number | null} */ (null));
  let returnRideId = $state(/** @type {number | null} */ (null));
  
  let existingRides = $derived(data?.existingRides?.map(ride => ride.id) || [])

  console.log('existingRides', existingRides)
  for (let trip of trips) {
    console.log(trip)
    if (trip.collection === 'destination_trip') {
      let ride = trip.item.rides.find((/** @type {{ item: {id: string} }} */ ride) => (console.log(ride), existingRides.includes(ride.item?.id)))
      console.log('found destination ride', ride)
      if (ride?.item !== undefined) destinationRideId = parseInt(ride.item.id);
    } else if (trip.collection === 'return_trip') {
      let ride = trip.item.rides.find((/** @type {{ item: {id: string} }} */ ride) => existingRides.includes(ride.item?.id))
      console.log('found return ride', ride)
      if (ride?.item !== undefined) returnRideId = parseInt(ride.item.id);
    }
  }

  /** @type {Record<string, any> | null} */
  let modifying = $state(null)

  /**
     * Set the current modifying subject if none is set.
     * @param {Record<string, any> | null} subject
     * @param {string} mode
     * @returns {void}
     */
  function setModifying(subject, mode) {
    if (subject) {
      subject.mode = mode
    }
    
    modifying = subject
  }

  function undoChanges() {
    destinationRideId = previousDestinationRideId;
    returnRideId = previousReturnRideId;
  }

  //@ts-ignore
  function setDestinationRideId(rideId) {
    destinationRideId = destinationRideId === rideId ? null : rideId;
  }

  //@ts-ignore
  function setReturnRideId(rideId) {
    returnRideId = returnRideId === rideId ? null : rideId;
  }

  async function updateSelections() {
    console.log('updating selections', {destinationRideId, returnRideId, event})
    try {
      await updateRideSelections({user: data?.userId ?? '-1', event: event?.id ?? '-1', rides: {
        destination_trip: destinationRideId?.toString() ?? null,
        return_trip: returnRideId?.toString() ?? null
      }})
      goto('#success-add', {invalidateAll: true})
    } catch (e) {
      goto('#error-add', {invalidateAll: true})
      alert('Error updating selections: ' + e)
    }
  }
  async function removeSelections() {
    console.log('removing selections', {destinationRideId, returnRideId, event})
    try {
      await removeFromRide({user: data?.userId ?? '-1', event: event?.id ?? '-1'})
      goto('#success-remove', {invalidateAll: true})
    } catch (e) {
      goto('#error-remove', {invalidateAll: true})
      alert('Error removing selections: ' + e)
    }
  }
  async function removeAllSelections() {
    console.log('removing selections', {destinationRideId, returnRideId, event})
    try {
      await removeFromRide({user: data?.userId ?? '-1', event: null})
      goto('#success-remove', {invalidateAll: true})
    } catch (e) {
      goto('#error-remove', {invalidateAll: true})
      alert('Error removing selections: ' + e)
    }
  }

  /** @type {number | null} */
  let previousDestinationRideId = $state(null);
  /** @type {number | null} */
  let previousReturnRideId = $state(null);

  let isAdmin = $state(false);
  /** @type {number} */
  let userId = 0;

  onMount(() => {
    let user = sessionStorage.getItem('user');


    if (user) {
      const parsedUser = JSON.parse(user);
      isAdmin = parsedUser.is_admin;
      userId = parseInt(parsedUser.id);
      console.log(parsedUser)
    }
    else {
      
      const m = document.cookie.match(/(?:^|; )user=([^;]+)/)
      const raw = m?.[1]
      let parsedUser = null
      if (raw) {
        try {
          parsedUser = JSON.parse(decodeURIComponent(raw))
        } catch (e) {
          console.warn('Failed to parse user cookie', e)
        }
      }

      isAdmin = parsedUser?.is_admin ?? isAdmin;
      userId = parsedUser?.id ? parseInt(parsedUser.id) : userId;
    }


    if (userId) {
      for (let i = 0; i < trips?.length; i++) { // finding user's current rides
        const trip = trips[i];
        for (let j = 0; j < trip.item.rides.length; j++) {
          const ride = trip.item.rides[j];
          const riders = ride.item.riders;
          for (let k = 0; k < riders.length; k++) {
            const rider = riders[k];
            if (parseInt(rider.item.id) === userId) {
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
  {#if modifying}
    <CreateOrModifySignup Subject={modifying} SetModifying={setModifying} eventId={event?.id} />
  {/if}
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

                  {#if isAdmin}
                    <div class="AddButton" onclick={() => setModifying({ mode: 'create', collection: 'destination_trip', item: {} }, 'create')}>+</div>
                  {/if}

                  {#each trips.filter(trip => trip.collection === 'destination_trip') as trip}
                    <CarpoolTrip {trip} RideId={destinationRideId} SetId={setDestinationRideId} previousDestinationRideId={previousDestinationRideId} previousReturnRideId={previousReturnRideId} isAdmin={isAdmin} modifying={modifying} SetModifying={setModifying} />
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

                  {#if isAdmin}
                    <div class="AddButton" onclick={() => setModifying({ mode: 'create', collection: 'return_trip', item: {} }, 'create')}>+</div>
                  {/if}

                  {#each trips.filter(trip => trip.collection === 'return_trip') as trip}
                    <CarpoolTrip {trip} RideId={returnRideId} SetId={setReturnRideId} previousDestinationRideId={previousDestinationRideId} previousReturnRideId={previousReturnRideId} isAdmin={isAdmin} modifying={modifying} SetModifying={setModifying} />
                  {/each}
                </div>
              </div>
              <div style="justify-content: center; display: flex; gap: 10px; margin: 10px 0;">
                <button class="undoChanges" disabled={previousDestinationRideId === null || previousReturnRideId === null || (destinationRideId === previousDestinationRideId && returnRideId === previousReturnRideId)} onclick={undoChanges}>Undo Changes</button>
                <button class="confirm" disabled={destinationRideId === null || returnRideId === null} onclick={updateSelections}>Confirm</button>
                <button class="remove" onclick={removeSelections} hidden={existingRides.length === 0}>Cancel event registration</button>
              </div>
            {:else}
              <p>No trips available for this event.</p>
            {/if}
            <!-- <button class="remove" onclick={removeAllSelections}>Test: Leave all</button> -->

            <div id="message">
              <div hidden={page.url.hash !== "#success-add"} style="color: green;">Successfully updated ride selections!</div>
              <div hidden={page.url.hash !== "#error-add"} style="color: red;">Error updating ride selections.</div>
              <div hidden={page.url.hash !== "#success-remove"} style="color: green;">Successfully removed from rides!</div>
              <div hidden={page.url.hash !== "#error-remove"} style="color: red;">Error removing from rides.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="css">

  .AddButton {
    border: 1px solid rgb(100,100,100); 
    height: 60px; 
    border-radius: 5px; 
    margin-bottom: 10px; 
    background-color: rgb(235, 235, 235);
    line-height: 60px; 
    text-align: center; 
    font-size: 30px; 
    color: rgb(130,130,130);
    font-weight: 600; 
    cursor: pointer;
  }

  .AddButton:hover {
    background-color: rgb(225, 225, 225);
  }
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

  .confirm, .remove {
    cursor: pointer;
    color: white;
    border-radius: 5px;
    border: none;
    padding: 5px 15px;
    align-self: center;
  }

  .confirm {
    background-color: #3375a6;
  }
  .remove {
    background-color: #dc3545;
  }
  :is(.confirm, .remove):disabled {
    background-color: #808080;
    cursor: not-allowed;
  }
</style>
