<script>
  // List Carpool Event Details
  // path: /carpool/[id]
  import { goto } from '$app/navigation';
  import CarpoolTrip from '$lib/components/CarpoolTrip.svelte';

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

  /** @type {EventRecord|undefined} */
  export let data // { event }

  /** @type {Event|undefined} */
  export let event = data?.event // Fallback to empty object if data is not available

  /** @type {Trips} */
  export let trips = event?.trips || []

  // console.log('Carpool Event Data:', JSON.stringify(data, null, 2))
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
          <div>
            <p class="card-text"><strong>Trips:</strong></p>
            {#if trips.length > 0}
              <div style="list-style-type: none; padding: 0; float: left; width: 49%;">
                {#each trips.filter(trip => trip.collection === 'destination_trip') as trip}
                  <CarpoolTrip {trip} />
                {/each}
              </div>
              <div style="list-style-type: none; padding: 0; float: right; width: 49%;">
                {#each trips.filter(trip => trip.collection === 'return_trip') as trip}
                  <CarpoolTrip {trip} />
                {/each}
              </div>
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
</style>
