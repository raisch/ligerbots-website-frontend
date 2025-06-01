<script lang="ts">
  // List Active Carpool Events
  // path: /carpool

  import { goto } from '$app/navigation'

  /**
   * Navigate to the event details page when an event is clicked
   * @param {string} eventId - The unique identifier for the event
   */
  function goToDetails(eventId: any) {
    goto(`/carpool/${eventId}`)
  }

  import { onMount } from 'svelte';

  let isAdmin = false;

  onMount(() => {
    const user = sessionStorage.getItem('user');

    if (user) {
      const parsedUser = JSON.parse(user);
      console.log(parsedUser);
      isAdmin = parsedUser.is_admin;
    }
  });

  export let data
  export let events = data?.events || []

  function deleteEvent(eventId: any) {
    alert("havent implemented yet cuz im lazy - ray")
  }
</script>

<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1>Carpool Events</h1>
    {#if isAdmin}
      <div class="admin-actions">
        <button class="btn btn-success me-2" on:click={() => goto('/carpool/admin')}>
          Manage Cars
        </button>
        <button class="btn btn-primary" on:click={() => goto('/carpool/create')}>
          Create Event
        </button>
      </div>
    {/if}
  </div>

  {#if isAdmin}
    <div class="alert alert-info">
      <strong>Admin Access:</strong> You have admin access to manage carpool events and cars.
    </div>
  {/if}

  {#if events.length > 0}
    <div class="row events-list">
      {#each events as event}
        <div class="col-md-6">
          <div class="card mb-6">
            <div class="card-body">
              <h2 class="card-title"><a href="/carpool/{event.id}">{event.name}</a></h2>
              <p class="card-text">{event.description}</p>
              <p class="card-text"><strong>Start Date:</strong> {event.start_date}</p>
              <p class="card-text"><strong>End Date:</strong> {event.end_date}</p>
              <p class="card-text"><strong>Location:</strong> {event.location}</p>
              <button class="btn btn-primary" on:click={() => goToDetails(event.id)}>View Trips</button>

              {#if isAdmin}
                <div class="bg-light p-2 rounded">
                  <button class="btn btn-secondary" on:click={() => goto(`/carpool/${event.id}/edit`)}>Edit Event</button>
                  <button class="btn btn-danger" on:click={() => deleteEvent(event.id)}>Delete Event</button>
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
