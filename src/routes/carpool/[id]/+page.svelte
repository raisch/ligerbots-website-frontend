<script>
  // List Carpool Event Details
  // path: /carpool/[id]
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import CarpoolTrip from '$lib/components/CarpoolTrip.svelte';
  import { refresh } from '@directus/sdk';
  import { removeFromRide, updateRideSelections } from '../ride.remote';
  import { onMount } from 'svelte';
  import CreateOrModifySignup from '$lib/components/CreateOrModifySignup.svelte';
  import CreateOrModifyEventSignup from '$lib/components/CreateOrModifyEventSignup.svelte';

  /**
   * @typedef {import('$lib/server/event').RideRecord} RideRecord
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
   * @typedef {import('$lib/server/trip').TripType} Trip
   */

  /**
   * @typedef {Array<Trip>} Trips
   */

  /** @type {{
      data?: {
        event: Event,
        userId?: string,
        existingRides?: {id: string}[],
        cars?: {
          allCars: import('$lib/server/event').RideRecord[],
          userOwnedCars: import('$lib/server/event').RideRecord[],
          userCanHaveCar: boolean
        }
      }
    }} */
  let { data } = $props();

  let event = $derived(data?.event);
  $inspect(page.url.hash, event);

  /** @type {Trips} */
  let trips = $derived(event?.trips || []);

  let destinationRideId = $state(/** @type {number | null} */ (null));
  let returnRideId = $state(/** @type {number | null} */ (null));
  
  let existingRides = $derived(data?.existingRides?.map(ride => ride.id) || [])

  let cars = $derived(data?.cars ?? { allCars: [], userOwnedCars: [], userCanHaveCar: false });

  //console.log('existingRides', existingRides)
  for (let trip of trips) {
    //console.log(trip)
    if (trip.collection === 'destination_trip') {
      let ride = trip.item.rides.find((/** @type {{ item: {id: string} }} */ ride) => existingRides.includes(ride.item?.id))
      //console.log('found destination ride', ride)
      if (ride?.item !== undefined) destinationRideId = parseInt(ride.item.id);
    } else if (trip.collection === 'return_trip') {
      let ride = trip.item.rides.find((/** @type {{ item: {id: string} }} */ ride) => existingRides.includes(ride.item?.id))
      //console.log('found return ride', ride)
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

  /** @type {string?} */
  let activeCarEditor = $state(null)

  /**
     * @param {string?} id
     * @returns {void}
     */
  function setActiveCarEditor(id) {
    activeCarEditor = id
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

  let isAdmin = $state(true);
  /** @type {number} */
  let userId = 0;

  let confirmDelete = $state(false);

  onMount(() => {
    const user = sessionStorage.getItem('user');


    if (user) {
      const parsedUser = JSON.parse(user);
      isAdmin = parsedUser.is_admin;
      userId = parseInt(parsedUser.id);
      console.log(parsedUser)
    } else {
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
            if (parseInt(rider.item?.id || '-1') === userId) {
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
  <div class="modifying-box">
    {#if modifying}
      {#if modifying.mode === 'editEvent'}
        <CreateOrModifyEventSignup Subject={modifying} SetModifying={setModifying} eventId={event?.id} />
      {:else}
        <CreateOrModifySignup Subject={modifying} SetModifying={setModifying} eventId={event?.id} />
      {/if}
    {/if}
  </div>
  <h1>Carpool Event Detail Page</h1>

  <div class="row" style="background-color: #eee; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
    <div class="">
      <div class="card mb-6">
        <div class="card-body">
          <div class="event-header">
            <div>
              <h2 class="card-title">{event?.name}</h2>
              <p class="card-text event-description">{event?.description}</p>
              <p class="card-text"><strong>Start Date:</strong> {event?.start_date}</p>
              <p class="card-text"><strong>End Date:</strong> {event?.end_date}</p>
              <p class="card-text"><strong>Location:</strong> {event?.location}</p>
            </div>
            <div class="header-button-block">
              {#if isAdmin}
                <div class="header-admin-buttons">
                  <span class="deleteButton" onclick={() => {
                      if (confirmDelete) {
                        // TODO create better dialog
                        let deletionConfirmed = confirm('Are you sure you want to delete this event?\nThis action cannot be undone.');
                        if (deletionConfirmed) {
                          // TODO create api for this
                        }
                        confirmDelete = false;
                      } else {
                          confirmDelete = true;
                          setTimeout(() => {
                              confirmDelete = false;
                          }, 2000);
                      }
                  }}>{confirmDelete ? "Confirm?" : "Delete"}</span>
                  <span class="editButton" onclick={() => setModifying({ item: event }, "editEvent")}>Edit</span>
                </div>
              {/if}
              <a class="riderlistButton btn-primary" href="/carpool/{event?.id}/attendees" target="_blank">View Attendees</a>
              <a class="riderlistButton btn-primary" href="/carpool/{event?.id}/riderlist" target="_blank">View Riders</a>
              <a class="riderlistButton btn-success" href="/carpool/{event?.id}/export" target="_blank">Export Spreadsheet</a>
            </div>
          </div>

          <div style="display: flex; flex-wrap: wrap; flex-direction: column;">
            <div class="trip-box-container" style="display: flex; justify-content: space-between;">
              <div class="trip-box">
                <div style="font-size: 25px; padding-bottom: 5px;">Destination Trips</div>
                <div style="display: flex; gap: 5px; padding-bottom: 5px; align-items: center;">
                  <div 
                    class="optout{destinationRideId === -1 ? ' optout-selected' : ''}"
                    onclick={() => setDestinationRideId(-1)}
                  >Opt Out</div>
                </div>

                {#if isAdmin}
                  <div class="AddButton" onclick={() => setModifying({ mode: 'create', collection: 'destination_trip', item: {} }, 'create')}>+</div>
                {/if}

                {#each trips.filter(trip => trip.collection === 'destination_trip') as trip}
                  <CarpoolTrip {trip} {cars} {userId} RideId={destinationRideId} SetId={setDestinationRideId} {previousDestinationRideId} {previousReturnRideId} {isAdmin} {modifying} {activeCarEditor} SetModifying={setModifying} SetActiveCarEditor={setActiveCarEditor} />
                {/each}
              </div>
              <div class="trip-box">
                <div style="font-size: 25px; padding-bottom: 5px;">Return Trips</div>
                <div style="display: flex; gap: 5px; padding-bottom: 5px; align-items: center;">
                  <div 
                    class="optout{returnRideId === -1 ? ' optout-selected' : ''}"
                    onclick={() => setReturnRideId(-1)}
                  >Opt Out</div>
                </div>

                {#if isAdmin}
                  <div class="AddButton" onclick={() => setModifying({ mode: 'create', collection: 'return_trip', item: {} }, 'create')}>+</div>
                {/if}

                {#each trips.filter(trip => trip.collection === 'return_trip') as trip}
                  <CarpoolTrip {trip} {cars} {userId} RideId={returnRideId} SetId={setReturnRideId} {previousDestinationRideId} {previousReturnRideId} {isAdmin} {modifying} {activeCarEditor} SetModifying={setModifying} SetActiveCarEditor={setActiveCarEditor} />
                {/each}
              </div>
            </div>
            {#if trips.length > 0}
              <div style="justify-content: center; display: flex; gap: 10px; margin: 10px 0;">
                <button class="undoChanges" disabled={previousDestinationRideId === null || previousReturnRideId === null || (destinationRideId === previousDestinationRideId && returnRideId === previousReturnRideId)} onclick={undoChanges}>Undo Changes</button>
                <button class="confirm btn-primary" disabled={destinationRideId === null || returnRideId === null} onclick={updateSelections}>Confirm</button>
                <button class="remove btn-danger" onclick={removeSelections} hidden={previousDestinationRideId === null && previousReturnRideId === null}>Cancel event registration</button>
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
  .card-body {
    position: relative;
  }
  /* .modifying-box {
    position: absolute;
    top: 200px;
    left: 50%;
    transform: translate(-50%);
    z-index: 99999;
  } */

  .trip-box {
    list-style-type: none;
    padding: 0;
    float: left;
    width: 49%;
  }

  .event-description {
    white-space: pre-wrap;
  }

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

  .header-admin-buttons {
    width: 100%;
    display: flex;
    gap: 10px;
    justify-content: stretch;
  }
  .header-admin-buttons * {
    flex: 1;
  }

  .deleteButton {
    border: 1px solid rgb(111, 0, 0); 
    border-radius: 5px; 
    background-color: rgba(95, 0, 0, 0.2);    
    line-height: 30px; 
    text-align: center; 
    font-size: 15px;
    color: rgb(111, 0, 0);
    cursor: pointer;
  }
  .editButton {
    border: 1px solid rgb(100,100,100); 
    border-radius: 5px; 
    background-color: rgb(235, 235, 235);
    line-height: 30px; 
    text-align: center; 
    font-size: 15px;
    color: rgb(130,130,130);
    cursor: pointer;
  }

  .editButton:hover {
    background-color: rgb(225, 225, 225);
  }
  
  .event-header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .header-button-block {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .riderlistButton {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 5px;
    text-decoration: none;
    text-align: center;
    /* background: #3375a6; */
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

  :is(.confirm, .remove):disabled {
    background-color: #808080;
    cursor: not-allowed;
  }

  .optout {
    height: 2em;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-left: 2px;
    padding: 0 10px;
    cursor: pointer;
  }
  .optout.optout-selected {
    outline: 2px solid #3375a6;
    background-color: #3375a61f;
  }

  .btn-success {
    background-color: #28a745;
    border-color: #28a745;
    color: white;
  }
  
  .btn-success:hover {
    background-color: #218838;
    border-color: #1e7e34;
  }
  
  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #0069d9;
    border-color: #0062cc;
  }

  

  @media (max-width: 768px) {
    .trip-box-container {
      flex-direction: column;
    }
    .trip-box {
      width: 100%;
      margin-bottom: 20px;
    }
    .header-button-block {
      width: 100%;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
    }
    .riderlistButton {
      min-width: calc(50% - 5px);
    }
  }
</style>
