<script lang="ts">
  //////// COPIED FROM /carpool/[id]/+page.svelte ////////
  // TODO rewrite to change to vehicle creation and editing page



  // List Active Carpool Events
  // path: /carpool

  import { goto } from '$app/navigation'
  import CreateOrModifyEventSignup from '$lib/components/CreateOrModifyEventSignup.svelte';
  import CreateOrModifyVehicle from '$lib/components/CreateOrModifyVehicle.svelte';
  import { onMount } from 'svelte';

  /**
   * Navigate to the event details page when an event is clicked
   * @param {string} eventId - The unique identifier for the event
   */
  function goToDetails(eventId: any) {
    goto(`/carpool/${eventId}`)
  }

  let { data } = $props();
  let { cars, userId, isAdmin, eligibleDrivers } = data;

  let modifying: Record<string, any> | null = $state(null)

  function setModifying(subject: Record<string, any> | null, mode: string) {
    if (subject) {
      subject.mode = mode
    }
    
    modifying = subject
  }
  function deleteEvent(eventId: any) {
    alert("havent implemented yet cuz im lazy - ray")
  }

  //console.log('events?:', events)
</script>

<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1>Carpool Events</h1>
    {#if isAdmin}
      {#if modifying}
        <CreateOrModifyVehicle {userId} {isAdmin} {eligibleDrivers} Subject={modifying} SetModifying={setModifying} />
      {/if}
      <div class="admin-actions">
        <button class="btn btn-primary" onclick={() => setModifying({ mode: 'create', item: {} }, 'create')}>
          Create Vehicle
        </button>
      </div>
    {/if}
  </div>

  {#if isAdmin}
    <div class="alert alert-info">
      <strong>Admin Access:</strong> You have admin access to manage vehicles.
    </div>
  {/if}

  {#if cars.length > 0}
    <div class="row events-list">
      {#each cars as car}
        <div class="col-md-6">
          <div class="card mb-6">
            <div class="card-body">
              <h2 class="card-title"><a href="/carpool/{car.id}">{car.name}</a></h2>
              <!-- <p class="card-text">{car.description}</p> -->
              <p class="card-text"><strong>Type:</strong> {car.vehicle_type}</p>
              <p class="card-text"><strong>Seats:</strong> {car.seats}</p>
              <p class="card-text"><strong>Driver:</strong> <UserShortDisplay /></p>

              {#if isAdmin}
                <div class="bg-light p-2 rounded">
                  <button class="btn btn-secondary" onclick={() => setModifying({ mode: 'editEvent', item: event }, 'editEvent')}>Edit Event</button>
                  <button class="btn btn-danger" onclick={() => deleteEvent(event.id)}>Delete Event</button>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p>No active carpool events available.</p>
  {/if}
</div>

<style>
  .events-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: stretch;
    background-color: #ddd;
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
  }
  .card {
    padding: 1rem;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #fff;
  }
  .card-title {
    font-size: 3rem;
  }
  .card-text {
    font-size: 1.75rem;
  }
  .btn {
    margin-top: 10px;
  }
  
  .d-flex {
    display: flex;
  }
  
  .justify-content-between {
    justify-content: space-between;
  }
  
  .align-items-center {
    align-items: center;
  }
  
  .mb-4 {
    margin-bottom: 1.5rem;
  }
  
  .admin-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .me-2 {
    margin-right: 0.5rem;
  }
  
  .btn-success {
    background-color: #28a745;
    border-color: #28a745;
    color: white;
  }
  
  .btn-success:hover {
    background-color: #218838;
    border-color: #1e7e34;
  }
  
  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #0069d9;
    border-color: #0062cc;
  }
</style>
