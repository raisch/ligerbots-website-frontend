<script>
  // Display Carpool Ride Detail
  // path: /carpool/trip/ride/[id]
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  let isAdmin = false;
  /** @type {any} */
  let tripRide = data.tripRide || {};
  let id = data.id;

  onMount(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      isAdmin = parsedUser.is_admin;
    }
    console.log('Trip ride data:', tripRide);
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

  function handleEdit() {
    // For now, go back to carpool main page since we don't have trip context
    alert("Edit functionality requires trip context - redirecting to main carpool page");
    goto('/carpool');
  }

  function handleJoinRide() {
    // TODO: Implement join ride functionality
    alert("Join ride functionality not yet implemented");
  }

  function handleLeaveRide() {
    // TODO: Implement leave ride functionality
    alert("Leave ride functionality not yet implemented");
  }

  function getAvailableSeats() {
    const totalSeats = tripRide.ride?.seats || 0;
    const riderCount = tripRide.riders_func?.count || 0;
    return totalSeats - riderCount;
  }

  function getTripTypeDisplay() {
    return 'Ride';
  }

  function getTripTypeBadgeClass() {
    return 'badge-info';
  }
</script>

<div class="container mt-4">
  <h1>Carpool Ride Details</h1>

  <div class="row" style="background-color: #eee; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
    {#if tripRide && tripRide.id}
      <div class="col-md-8">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h2 class="card-title mb-0">
              <span class="badge {getTripTypeBadgeClass()}">{getTripTypeDisplay()}</span>
              {tripRide.ride?.name || 'Unnamed Ride'}
            </h2>
            {#if isAdmin}
              <button class="btn btn-primary" on:click={handleEdit}>Edit Ride</button>
            {/if}
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h3>Ride Information</h3>
                <p><strong>Vehicle Type:</strong> {tripRide.ride?.vehicle_type || 'N/A'}</p>
                <p><strong>Driver:</strong> 
                  {#if tripRide.ride?.driver?.item}
                    {tripRide.ride.driver.item.firstname} {tripRide.ride.driver.item.lastname}
                    {#if tripRide.ride.driver.item.phone_number}
                      <br><small class="text-muted">📞 {tripRide.ride.driver.item.phone_number}</small>
                    {/if}
                    {#if tripRide.ride.driver.item.email_address}
                      <br><small class="text-muted">✉️ {tripRide.ride.driver.item.email_address}</small>
                    {/if}
                  {:else}
                    N/A
                  {/if}
                </p>
                <p><strong>Total Seats:</strong> {tripRide.ride?.seats || 0}</p>
                <p><strong>Available Seats:</strong> 
                  <span class="badge {getAvailableSeats() > 0 ? 'badge-success' : 'badge-warning'}">
                    {getAvailableSeats()}
                  </span>
                </p>
                <p><strong>Current Riders:</strong> {tripRide.riders_func?.count || 0}</p>
              </div>
              
              <div class="col-md-6">
                <h3>Additional Information</h3>
                <p><strong>Ride ID:</strong> {tripRide.id}</p>
                <p><strong>Vehicle ID:</strong> {tripRide.ride?.id || 'N/A'}</p>
                <p>For complete trip details, please visit the main carpool page.</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-4">
              {#if getAvailableSeats() > 0}
                <button class="btn btn-success" on:click={handleJoinRide}>Join This Ride</button>
              {:else}
                <button class="btn btn-secondary" disabled>Ride Full</button>
              {/if}
              <button class="btn btn-warning" on:click={handleLeaveRide}>Leave Ride</button>
              <button class="btn btn-info" on:click={() => goto('/carpool')}>
                Back to Carpool Events
              </button>
            </div>

            <!-- Riders List -->
            {#if tripRide.riders && tripRide.riders.length > 0}
              <div class="mt-4">
                <h3>Riders</h3>
                <ul class="list-group">
                  {#each tripRide.riders as rider}
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{rider.item?.firstname || 'Unknown'} {rider.item?.lastname || ''}</strong>
                        {#if rider.item?.email_address}
                          <br><small class="text-muted">✉️ {rider.item.email_address}</small>
                        {/if}
                        {#if rider.item?.phone_number}
                          <br><small class="text-muted">📞 {rider.item.phone_number}</small>
                        {/if}
                      </div>
                      {#if rider.item?.photo}
                        <img src="/api/files/{rider.item.photo.id}" alt="Profile" class="rounded-circle" width="40" height="40">
                      {/if}
                    </li>
                  {/each}
                </ul>
              </div>
            {:else}
              <div class="mt-4">
                <p>No riders have joined this ride yet.</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="col-12">
        <div class="alert alert-warning">
          <p>Ride not found. The ride may have been deleted or you may not have permission to view it.</p>
          <button class="btn btn-primary" on:click={() => goto('/carpool')}>Back to Carpool Events</button>
        </div>
      </div>
    {/if}
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
  }
  
  .card-header {
    background-color: #f8f9fa;
  }
  
  .list-group-item {
    margin-bottom: 0.5rem;
    border-radius: 0.25rem;
  }

  .btn {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }
</style>