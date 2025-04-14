<script>
  // Display Carpool Trip Detail
  // with a list of Carpool Rides
  // path: /carpool/trip/[id]

  // TODO: Implement the logic to fetch and display active carpool events
  // This is using placeholder data and could change
  // Also the styling is really bad because idk how to use bootstrap

  let data = {
    type: "destination",
    destination: "WPS",
    departsOn: "9/21/2024",
    departsAt: "8:00 AM",
    departsFrom: "Starbucks",
    rides: [
      {
        ride: "1",
        riders: [1, 2]
      }
    ]
  }
</script>

<div class="container mt-4">
  <h1>Carpool Ride Detail Page</h1>

  <div class="row" style="background-color: #eee; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
    <div class="col-md-4">
      <div class="card mb-4">
        <div class="card-body">
          <h2 class="card-title">{data.type}</h2>
          <p class="card-text"><strong>Destination:</strong> {data.destination}</p>
          <p class="card-text"><strong>Departs On:</strong> {data.departsOn}</p>
          <p class="card-text"><strong>Departs At:</strong> {data.departsAt}</p>
          <p class="card-text"><strong>Departs From:</strong> {data.departsFrom}</p>
          <p class="card-text"><strong>Rides:</strong></p>
          {#if data.rides.length > 0}
            <ul>
              {#each data.rides as ride}
                <li class="mb-2" style="background-color: #ddd; padding: 10px; border-radius: 10px;">
                  <strong>Ride ID:</strong> {ride.ride}<br>
                  <strong>Riders:</strong> {ride.riders.join(", ")}
                  
                  <br>
                  <button class="btn btn-primary" on:click={() => alert('View Details not implemented yet')}>View Details</button>
                </li>
              {/each}
            </ul>
          {:else}
            <p>No rides available for this trip.</p>
          {/if}
        </div>
      </div>
    </div>  
  </div>
</div>