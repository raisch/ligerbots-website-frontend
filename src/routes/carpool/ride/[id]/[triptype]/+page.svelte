<script lang="ts">
  // Display Carpool Trip Detail
  // path: /carpool/trip/ride/[id]/[triptype]
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  let isAdmin = false;
  let trip = data.trip || {};
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
  });

  function formatDate(dateString: any) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatTime(timeString: any) {
    if (!timeString) return 'N/A';
    return timeString;
  }

  function handleEdit() {
    goto(`/carpool/ride/${id}/${tripType}/edit`);
  }
</script>

<div class="container mt-4">
  <h1>Carpool Trip Detail</h1>

  <div class="row" style="background-color: #eee; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
    {#if tripData}
      <div class="col-md-8">
        <div class="card mb-4">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h2 class="card-title mb-0">
              {#if tripType === 'destination_trip'}
                <span class="badge badge-success">To Event</span>
              {:else if tripType === 'return_trip'}
                <span class="badge badge-danger">From Event</span>
              {:else}
                <span class="badge badge-secondary">Unknown</span>
              {/if}

              {tripData.destination}
            </h2>
            {#if isAdmin}
              <button class="btn btn-primary" on:click={handleEdit}>Edit Trip</button>
            {/if}
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h3>Trip Information</h3>
                <p><strong>Trip Type:</strong> {tripType === 'destination_trip' ? 'To Event' : 'From Event'}</p>
                <p><strong>Departs From:</strong> {tripData.departs_from || 'N/A'}</p>
                <p><strong>Departs On:</strong> {formatDate(tripData.departs_on)}</p>
                <p><strong>Departs At:</strong> {formatTime(tripData.departs_at)}</p>
                <p><strong>Destination:</strong> {tripData.destination || 'N/A'}</p>
                <p><strong>Status:</strong> <span class="badge {tripData.status === 'active' ? 'badge-success' : 'badge-warning'}">{tripData.status || 'Unknown'}</span></p>
              </div>
            </div>

            {#if tripData.rides && tripData.rides.length > 0}
              <div class="mt-4">
                <h3>Rides</h3>
                <ul class="list-group">
                  {#each tripData.rides as ride}
                    <li class="list-group-item">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Ride ID:</strong> {ride.id || 'Unknown'}
                        </div>
                        <button class="btn btn-sm btn-primary" on:click={() => goto(`/carpool/ride/${id}/${tripType}/tripride`)}>Manage Rides</button>
                      </div>
                    </li>
                  {/each}
                </ul>
              </div>
            {:else}
              <div class="mt-4">
                <p>No rides have been created for this trip yet.</p>
                {#if isAdmin}
                  <button class="btn btn-success" on:click={handleEdit}>Add Ride</button>
                {/if}
              </div>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="col-12">
        <div class="alert alert-warning">
          <p>Trip not found. The trip may have been deleted or you may not have permission to view it.</p>
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
  }
  
  .badge-secondary {
    background-color: #6c757d;
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
</style>