<script>
  // Trip Ride Management Page
  // path: /carpool/trip/ride/[id]/[triptype]/tripride
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  let isAdmin = false;
  /** @type {any} */
  let trip = data.trip || {};
  let tripRides = data.tripRides || [];
  let tripType = data.tripType;
  let id = data.id;
  let tripData = trip.item || {};


  onMount(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      isAdmin = parsedUser.is_admin;
    }
    console.log('Trip data:', trip);
    console.log('Trip rides:', tripRides);
  });

  /**
   * @param {string} dateString
   */
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * @param {string} timeString
   */
  function formatTime(timeString) {
    if (!timeString) return 'N/A';
    return timeString;
  }

  function getTripTypeDisplay() {
    if (tripType === 'destination_trip') {
      return 'To Event';
    } else if (tripType === 'return_trip') {
      return 'From Event';
    }
    return 'Unknown';
  }

  function getTripTypeBadgeClass() {
    if (tripType === 'destination_trip') {
      return 'badge-success';
    } else if (tripType === 'return_trip') {
      return 'badge-danger';
    }
    return 'badge-secondary';
  }

  function handleEditTrip() {
    goto(`/carpool/trip/ride/${id}/${tripType}/edit`);
  }


  /**
   * @param {any} ride
   */
  function getAvailableSeats(ride) {
    if (!ride?.item?.ride?.seats) return 0;
    const totalSeats = ride.item.ride.seats;
    const riderCount = ride.item.riders?.length || 0;
    return totalSeats - riderCount;
  }

  /**
   * @param {any} ride
   */
  function getRiderCount(ride) {
    return ride?.item?.riders?.length || 0;
  }
</script>

<div class="container mt-4">
  <h1>Trip Ride Management</h1>

  <!-- Trip Information -->
  <div class="row mb-4" style="background-color: #f8f9fa; padding: 20px; border-radius: 15px;">
    {#if tripData}
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2>
            <span class="badge {getTripTypeBadgeClass()}">{getTripTypeDisplay()}</span>
            {tripData.destination || 'Unknown Destination'}
          </h2>
          {#if isAdmin}
            <div>
              <button class="btn btn-primary" on:click={handleEditTrip}>Edit Trip</button>
            </div>
          {/if}
        </div>
        
        <div class="row">
          <div class="col-md-6">
            <p><strong>Departs From:</strong> {tripData.departs_from || 'N/A'}</p>
            <p><strong>Departs On:</strong> {formatDate(tripData.departs_on)}</p>
            <p><strong>Departs At:</strong> {formatTime(tripData.departs_at)}</p>
          </div>
          <div class="col-md-6">
            <p><strong>Status:</strong> 
              <span class="badge {tripData.status === 'published' ? 'badge-success' : 'badge-warning'}">
                {tripData.status || 'Unknown'}
              </span>
            </p>
            <p><strong>Total Rides:</strong> {tripRides.length}</p>
          </div>
        </div>
      </div>
    {/if}
  </div>


  <!-- Trip Rides List -->
  <div class="row">
    <div class="col-12">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>Rides for this Trip</h3>
        {#if isAdmin}
          <button class="btn btn-success" on:click={handleEditTrip}>
            Add Ride
          </button>
        {/if}
      </div>
      {#if tripRides && tripRides.length > 0}
        <div class="row">
          {#each tripRides as ride}
            <div class="col-md-6 mb-4">
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">
                    {ride.item?.ride?.name || 'Unnamed Ride'}
                  </h5>
                  <span class="badge {getAvailableSeats(ride) > 0 ? 'badge-success' : 'badge-warning'}">
                    {getAvailableSeats(ride)} seats available
                  </span>
                </div>
                <div class="card-body">
                  <p><strong>Vehicle:</strong> {ride.item?.ride?.vehicle_type || 'N/A'}</p>
                  <p><strong>Total Seats:</strong> {ride.item?.ride?.seats || 0}</p>
                  <p><strong>Current Riders:</strong> {getRiderCount(ride)}</p>
                  
                  {#if ride.item?.ride?.driver?.item}
                    <p><strong>Driver:</strong> {ride.item.ride.driver.item.firstname} {ride.item.ride.driver.item.lastname}</p>
                  {/if}

                  <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-primary btn-sm" on:click={() => goto(`/carpool/tripride/${ride.item?.id}`)}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="alert alert-info">
          <p>No rides have been created for this trip yet.</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Navigation -->
  <div class="row mt-4">
    <div class="col-12">
      <button class="btn btn-secondary" on:click={() => goto(`/carpool/trip/ride/${id}/${tripType}`)}>
        Back to Trip Details
      </button>
      <button class="btn btn-info" on:click={() => goto('/carpool')}>
        Back to Carpool Events
      </button>
    </div>
  </div>
</div>

<style>
  .badge {
    color: white;
    padding: 0.5em 0.75em;
    border-radius: 0.25rem;
    display: inline-block;
    margin-right: 0.5rem;
  }
  
  .badge-success {
    background-color: #28a745;
  }
  
  .badge-danger {
    background-color: #dc3545;
  }
  
  .badge-warning {
    background-color: #ffc107;
    color: #212529;
  }
  
  .badge-secondary {
    background-color: #6c757d;
  }
  
  .badge-info {
    background-color: #17a2b8;
  }
  
  .card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }
  
  .card-header {
    background-color: #f8f9fa;
  }

  .btn {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .form-control {
    margin-bottom: 1rem;
  }

  .alert {
    border-radius: 0.25rem;
    padding: 1rem;
  }

  .alert-info {
    background-color: #d1ecf1;
    border-color: #bee5eb;
    color: #0c5460;
  }
</style>