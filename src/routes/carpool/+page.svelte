<script>
  // List Active Carpool Events
  // path: /carpool

  // TODO: Implement the logic to fetch and display active carpool events
  // This is using placeholder data and could change
  // Also the styling is really bad because idk how to use bootstrap

  let data = [
    {
      name: "Robocon",
      description: "Robocon Event",
      startDate: "9/21/2024",
      endDate: "9/21/2024",
      location: "WPS",

      trips: []
    }
  ]
</script>

<div class="container mt-4">
  <h1>Carpool Event List Page</h1>

  {#if data.length > 0}
    <div class="row" style="background-color: #eee; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
      {#each data as event}
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-body">
              <h2 class="card-title">{event.name}</h2>
              <p class="card-text">{event.description}</p>
              <p class="card-text"><strong>Start Date:</strong> {event.startDate}</p>
              <p class="card-text"><strong>End Date:</strong> {event.endDate}</p>
              <p class="card-text"><strong>Location:</strong> {event.location}</p>

              <button class="btn btn-primary" on:click={() => alert('View Details not implemented yet')}>View Details</button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p>No active carpool events available.</p>
  {/if}
</div>