<script>
  // List Carpool Event Details
  // path: /carpool/[id]

  // TODO: Implement the logic to fetch and display active carpool events
  // This is using placeholder data and could change
  // Also the styling is really bad because idk how to use bootstrap

  let data = {
    name: "Robocon",
    description: "Robocon Event",
    startDate: "9/21/2024",
    endDate: "9/21/2024",
    location: "WPS",
    trips: [
      {
        type: "destination",
        destination: "WPS",
        departsOn: "9/21/2024",
        departsAt: "8:00 AM",
        departsFrom: "Starbucks",
        rides: []
      }
    ]
  }
</script>

<div class="container mt-4">
  <h1>Carpool Event Detail Page</h1>

  <div class="row" style="background-color: #eee; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
    <div class="col-md-4">
      <div class="card mb-4">
        <div class="card-body">
          <h2 class="card-title">{data.name}</h2>
          <p class="card-text">{data.description}</p>
          <p class="card-text"><strong>Start Date:</strong> {data.startDate}</p>
          <p class="card-text"><strong>End Date:</strong> {data.endDate}</p>
          <p class="card-text"><strong>Location:</strong> {data.location}</p>
          <p class="card-text"><strong>Trips:</strong></p>
          {#if data.trips.length > 0}
            <ul>
              {#each data.trips as trip}
                <li class="mb-2" style="background-color: #ddd; padding: 10px; border-radius: 10px;">
                  <strong>Type:</strong> {trip.type}<br>
                  <strong>Destination:</strong> {trip.destination}<br>
                  <strong>Departs On:</strong> {trip.departsOn}<br>
                  <strong>Departs At:</strong> {trip.departsAt}<br>
                  <strong>Departs From:</strong> {trip.departsFrom}<br>
                  <button class="btn btn-primary" on:click={() => alert('View Details not implemented yet')}>View Details</button>
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