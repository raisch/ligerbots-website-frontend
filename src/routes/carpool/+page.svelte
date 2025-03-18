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

  export let data
  export let events = data?.events || []
</script>

<div class="container mx-auto mt-4">
  <h1>Carpool Events</h1>

  {#if events.length > 0}
    <div class="flex flex-wrap justify-between items-stretch bg-gray-300 p-5 rounded-lg mb-5 border border-gray-400">
      {#each events as event}
        <div class="md:w-1/2">
          <div class="p-4 mb-6 border border-gray-400 rounded-lg bg-white">
            <div class="p-4">
              <h2 class="text-3xl"><a href="/carpool/{event.id}">{event.name}</a></h2>
              <p class="text-xl">{event.description}</p>
              <p class="text-xl"><strong>Start Date:</strong> {event.start_date}</p>
              <p class="text-xl"><strong>End Date:</strong> {event.end_date}</p>
              <p class="text-xl"><strong>Location:</strong> {event.location}</p>
              <button class="mt-2 px-4 py-2 bg-blue-500 text-white rounded" on:click={() => goToDetails(event.id)}>View Trips</button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p>No active carpool events available.</p>
  {/if}
</div>
