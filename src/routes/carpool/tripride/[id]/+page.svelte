<script>
  // Individual Trip Ride Details Page
  // path: /carpool/tripride/[id]
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  let isAdmin = false;
  let currentUser = null;
  let tripRide = data.tripRide || {};
  let id = data.id;

  // Check if current user is already a rider
  let isCurrentUserRider = false;
  let currentUserRiderRelationshipId = null;

  onMount(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      isAdmin = parsedUser.is_admin;
      currentUser = parsedUser;
      
      // Check if current user is already in the riders list
      checkIfUserIsRider();
    }
    console.log('Trip ride data:', tripRide);
  });

  function checkIfUserIsRider() {
    if (!currentUser || !tripRide.riders) return;
    
    const userRider = tripRide.riders.find(rider => 
      rider.item?.id === currentUser.id || rider.item?.id === currentUser.id.toString()
    );
    
    if (userRider) {
      isCurrentUserRider = true;
      currentUserRiderRelationshipId = userRider.id;
    }
  }

  function getAvailableSeats() {
    if (!tripRide?.ride?.seats) return 0;
    const totalSeats = tripRide.ride.seats;
    const riderCount = tripRide.riders?.length || 0;
    return totalSeats - riderCount;
  }

  function getRiderCount() {
    return tripRide?.riders?.length || 0;
  }

  function getDriverName() {
    if (tripRide?.ride?.driver?.item) {
      const driver = tripRide.ride.driver.item;
      return `${driver.firstname || ''} ${driver.lastname || ''}`.trim();
    }
    return 'Unknown Driver';
  }

  function getDriverContact() {
    if (tripRide?.ride?.driver?.item) {
      const driver = tripRide.ride.driver.item;
      return {
        email: driver.email_address || 'N/A',
        phone: driver.phone_number || 'N/A'
      };
    }
    return { email: 'N/A', phone: 'N/A' };
  }

  async function handleJoinRide() {
    if (!currentUser) {
      alert('Please log in to join this ride.');
      return;
    }

    if (getAvailableSeats() <= 0) {
      alert('This ride is full. No available seats.');
      return;
    }

    try {
      const response = await fetch(`/api/triprides/${id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join ride');
      }

      alert('Successfully joined the ride!');
      window.location.reload(); // Refresh to show updated rider list
    } catch (error) {
      console.error('Error joining ride:', error);
      alert(`Failed to join ride: ${error.message}`);
    }
  }

  async function handleLeaveRide() {
    if (!currentUserRiderRelationshipId) {
      alert('You are not currently in this ride.');
      return;
    }

    if (!confirm('Are you sure you want to leave this ride?')) {
      return;
    }

    try {
      const response = await fetch(`/api/triprides/${id}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ relationshipId: currentUserRiderRelationshipId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to leave ride');
      }

      alert('Successfully left the ride!');
      window.location.reload(); // Refresh to show updated rider list
    } catch (error) {
      console.error('Error leaving ride:', error);
      alert(`Failed to leave ride: ${error.message}`);
    }
  }

  /**
   * @param {string} email
   */
  function handleEmailRider(email) {
    if (email && email !== 'N/A') {
      window.location.href = `mailto:${email}`;
    }
  }

  /**
   * @param {string} phone
   */
  function handleCallRider(phone) {
    if (phone && phone !== 'N/A') {
      window.location.href = `tel:${phone}`;
    }
  }

  function handleGoBack() {
    // Try to go back to the trip ride list if possible
    // This is a simplified approach - you might want to store the previous URL
    window.history.back();
  }
</script>

<div class="container mt-4">
  <h1>Ride Details</h1>

  {#if tripRide}
    <!-- Vehicle Information -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h2 class="mb-0">
              {tripRide.ride?.name || 'Unnamed Ride'}
            </h2>
            <span class="badge {getAvailableSeats() > 0 ? 'badge-success' : 'badge-warning'}">
              {getAvailableSeats()} seats available
            </span>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h4>Vehicle Details</h4>
                <p><strong>Vehicle Type:</strong> {tripRide.ride?.vehicle_type || 'N/A'}</p>
                <p><strong>Vehicle Name:</strong> {tripRide.ride?.name || 'N/A'}</p>
                <p><strong>Total Seats:</strong> {tripRide.ride?.seats || 0}</p>
                <p><strong>Available Seats:</strong> {getAvailableSeats()}</p>
                <p><strong>Current Riders:</strong> {getRiderCount()}</p>
              </div>
              <div class="col-md-6">
                <h4>Driver Information</h4>
                <p><strong>Driver:</strong> {getDriverName()}</p>
                <p><strong>Email:</strong> 
                  <a href="mailto:{getDriverContact().email}" class="btn btn-sm btn-outline-primary">
                    {getDriverContact().email}
                  </a>
                </p>
                <p><strong>Phone:</strong> 
                  <a href="tel:{getDriverContact().phone}" class="btn btn-sm btn-outline-primary">
                    {getDriverContact().phone}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Join/Leave Ride Section -->
    {#if currentUser}
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body text-center">
              {#if !isCurrentUserRider}
                {#if getAvailableSeats() > 0}
                  <h5>Join this ride?</h5>
                  <p>There {getAvailableSeats() === 1 ? 'is' : 'are'} {getAvailableSeats()} seat{getAvailableSeats() === 1 ? '' : 's'} available.</p>
                  <button class="btn btn-success btn-lg" on:click={handleJoinRide}>
                    Join Ride
                  </button>
                {:else}
                  <h5>Ride is Full</h5>
                  <p>This ride has no available seats.</p>
                  <button class="btn btn-secondary btn-lg" disabled>
                    Ride Full
                  </button>
                {/if}
              {:else}
                <h5>You're in this ride!</h5>
                <p>You are currently signed up for this ride.</p>
                <button class="btn btn-danger btn-lg" on:click={handleLeaveRide}>
                  Leave Ride
                </button>
              {/if}
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="row mb-4">
        <div class="col-12">
          <div class="alert alert-info text-center">
            <h5>Login Required</h5>
            <p>Please log in to join or leave this ride.</p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Riders List -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3>Current Riders ({getRiderCount()})</h3>
          </div>
          <div class="card-body">
            {#if tripRide.riders && tripRide.riders.length > 0}
              <div class="row">
                {#each tripRide.riders as rider}
                  <div class="col-md-6 mb-3">
                    <div class="card border-light">
                      <div class="card-body">
                        <h6 class="card-title">
                          {rider.item?.firstname || 'Unknown'} {rider.item?.lastname || ''}
                          {#if rider.item?.id === currentUser?.id}
                            <span class="badge badge-primary">You</span>
                          {/if}
                        </h6>
                        <div class="d-flex gap-2 mt-2">
                          {#if rider.item?.email_address}
                            <button 
                              class="btn btn-sm btn-outline-primary" 
                              on:click={() => handleEmailRider(rider.item.email_address)}
                            >
                              Email
                            </button>
                          {/if}
                          {#if rider.item?.phone_number}
                            <button 
                              class="btn btn-sm btn-outline-primary" 
                              on:click={() => handleCallRider(rider.item.phone_number)}
                            >
                              Call
                            </button>
                          {/if}
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="alert alert-info">
                <p>No riders have joined this ride yet.</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="row">
      <div class="col-12">
        <button class="btn btn-secondary" on:click={handleGoBack}>
          Go Back
        </button>
        <button class="btn btn-info" on:click={() => goto('/carpool')}>
          Back to Carpool Events
        </button>
      </div>
    </div>
  {:else}
    <div class="alert alert-danger">
      <h4>Ride Not Found</h4>
      <p>The requested ride could not be found.</p>
      <button class="btn btn-primary" on:click={() => goto('/carpool')}>
        Back to Carpool Events
      </button>
    </div>
  {/if}
</div>

<style>
  .badge {
    color: white;
    padding: 0.5em 0.75em;
    border-radius: 0.25rem;
    display: inline-block;
    margin-left: 0.5rem;
  }
  
  .badge-success {
    background-color: #28a745;
  }
  
  .badge-warning {
    background-color: #ffc107;
    color: #212529;
  }
  
  .badge-primary {
    background-color: #007bff;
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

  .alert {
    border-radius: 0.25rem;
    padding: 1rem;
  }

  .alert-info {
    background-color: #d1ecf1;
    border-color: #bee5eb;
    color: #0c5460;
  }

  .alert-danger {
    background-color: #f8d7da;
    border-color: #f5c6cb;
    color: #721c24;
  }

  .border-light {
    border: 1px solid #dee2e6 !important;
  }
</style>