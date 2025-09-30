<script>
  // List Carpool Event Details
  // path: /carpool/[id]

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
   * @property {number} id - The unique identifier for the trip
   * @property {string} collection - The type of trip (e.g., 'destination_trip', 'return_trip')
   * @property {Object} item - The trip details
   * @property {string} item.departs_from - The location the trip departs from
   * @property {string} item.departs_on - The date the trip departs
   * @property {string} item.departs_at - The time the trip departs
   * @property {string} item.destination - The destination of the trip
   */

  /**
   * @typedef {Array<Trip>} Trips
   */

  

  
  /**
   * @typedef {Object} Props
   * @property {EventRecord|undefined} data - { event }
   * @property {Event|undefined} [event] - Fallback to empty object if data is not available
   * @property {Trips|Array<undefined>} [trips] - console.log('Carpool Event Data:', JSON.stringify(data, null, 2))
   * @property {object|Number} [admin] - console.log('Carpool Event Data:', JSON.stringify(data, null, 2))
   */

  /** @type {Props} */

  

  let { data, event = data?.event, trips = event?.trips || [], admin = 0 } = $props();

  import { goto } from '$app/navigation';
  
  //@ts-ignore
  function goToTrip(tripId) {
    goto(`/carpool/trip/${tripId}`)
  }

  console.log(data)

  
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
          <p class="card-text"><strong>Trips:</strong></p>
          {#if trips.length > 0}
            <div class="flex gap-4" style="display: flex; gap: 1rem;">
              <!-- Column for Destination Trips -->
              <div class="flex flex-col gap-2 flex-1" style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1;">
                <h3>Destination Trips</h3>
                {#each trips.filter(trip => trip?.collection === 'destination_trip') as trip}
                  <div class="bg-gray-200 p-4 rounded" style="background-color: rgb(220,220,220); padding: 1rem; border-radius: 10px;">
                    <strong>Departs From:</strong> {trip?.item.departs_from} on {trip?.item.departs_on} at {trip?.item.departs_at}<br />
                    <strong>Destination:</strong> {trip?.item.destination}<br />
                    {#if admin} 
                      <button class="btn btn-primary" on:click={() => goToTrip(trip?.id)}>View Trip Detail</button>
                    {:else}
                      <button class="btn btn-primary" on:click={() => alert('View Destination Trip')}>Select</button>
                    {/if}
                  </div>
                {/each}
              </div>

              <!-- Column for Return Trips -->
              <div style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1;">
                <h3>Return Trips</h3>
                {#each trips.filter(trip => trip?.collection === 'return_trip') as trip}
                  <div class="bg-gray-200 p-4 rounded" style="background-color: rgb(220,220,220); padding: 1rem; border-radius: 10px;">
                    <strong>Departs From:</strong> {trip?.item.departs_from} on {trip?.item.departs_on} at {trip?.item.departs_at}<br />
                    <strong>Destination:</strong> {trip?.item.destination}<br />
                    {#if admin} 
                      <button class="btn btn-primary" on:click={() => goToTrip(trip?.id)}>View Trip Detail</button>
                    {:else}
                      <button class="btn btn-primary" on:click={() => alert('View Return Trip')}>Select</button>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
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
