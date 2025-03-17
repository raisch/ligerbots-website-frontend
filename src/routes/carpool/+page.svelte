<script>
  // List Active Carpool Events
  // path: /carpool

  import { goto } from '$app/navigation'

  /**
   * Navigate to the event details page when an event is clicked
   * @param {string} eventId - The unique identifier for the event
   */
  function goToDetails(eventId) {
    goto(`/carpool/${eventId}`)
  }

  // TODO: Implement the logic to fetch and display active carpool events
  // This is using placeholder data and could change
  // Also the styling is really bad because idk how to use bootstrap

  export let data
  export let events = data?.events || []
</script>

<div class="container mt-4">
  <h1>Carpool Events</h1>

  {#if events.length > 0}
    <div class="row" style="background-color: #eee; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
      {#each events as event}
        <div class="col-md-6">
          <div class="card mb-6">
            <div class="card-body">
              <h2 class="card-title"><a href="/carpool/{event.id}">{event.name}</a></h2>
              <p class="card-text">{@html event.description}</p>
              <p class="card-text"><strong>Start Date:</strong> {event.start_date}</p>
              <p class="card-text"><strong>End Date:</strong> {event.end_date}</p>
              <p class="card-text"><strong>Location:</strong> {event.location}</p>

              <button class="btn btn-primary" on:click={() => goToDetails(event.id)}>View Trips</button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p>No active carpool events available.</p>
  {/if}
</div>
