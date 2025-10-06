<script>
  // List Carpool Event Details
  // path: /carpool/[id]
  import { goto } from '$app/navigation';

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
   * @typedef {Object} Trip
   * @property {string} collection - The type of trip (e.g., 'destination_trip', 'return_trip')
   * @property {Object} item - The trip details
   * @property {string} item.id - The unique identifier for the trip
   * @property {string} item.departs_from - The location the trip departs from
   * @property {string} item.departs_on - The date the trip departs
   * @property {string} item.departs_at - The time the trip departs
   * @property {string} item.destination - The destination of the trip
   */

  /**
   * @typedef {Array<Trip>} Trips
   */

  /** @type {EventRecord|undefined} */
  export let data // { event }

  /** @type {Event|undefined} */
  export let event = data?.event // Fallback to empty object if data is not available

  /** @type {Trips|Array<undefined>} */
  export let trips = event?.trips || []

  // console.log('Carpool Event Data:', JSON.stringify(data, null, 2))
</script>

<div class="container mt-4">
  <h1>Carpool Event Detail Page</h1>

  <div class="row" style="background-color: #eee; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
    <div class="col-md-8">
      <div class="card mb-6">
        <div class="card-body">
          <h2 class="card-title">{event?.name}</h2>
          <p class="card-text">{event?.description}</p>
          <p class="card-text"><strong>Start Date:</strong> {event?.start_date}</p>
          <p class="card-text"><strong>End Date:</strong> {event?.end_date}</p>
          <p class="card-text"><strong>Location:</strong> {event?.location}</p>
          <p class="card-text"><strong>Trips:</strong></p>
          {#if trips.length > 0}
            <ul>
              {#each trips as trip}
                <li class="mb-2" style="background-color: #ddd; padding: 10px; border-radius: 10px;">
                  <strong>Type:</strong>
                  {#if trip?.collection === 'destination_trip'}
                    <span class="badge badge-success">To Event</span>
                  {:else if trip?.collection === 'return_trip'}
                    <span class="badge badge-danger">From Event</span>
                  {:else}
                    <span class="badge badge-secondary">Unknown</span>
                  {/if}
                  <br />
                  <strong>Departs From:</strong>
                  {trip?.item.departs_from} on {trip?.item.departs_on} at {trip?.item.departs_at}<br />
                  <strong>Destination:</strong>
                  {trip?.item.destination}<br />

                  <button class="btn btn-primary" on:click={() => trip?.item?.id && trip?.collection && goto(`/carpool/ride/${trip.collection}/${trip.item.id}`)}>View Trip Detail</button>
                </li>
              {/each}
            </ul>
          {:else}
            <p>No trips available for this event.</p>
          {/if}
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
