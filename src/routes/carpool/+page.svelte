<script lang="ts">
  // List Active Carpool Events
  // path: /carpool

  import { goto } from '$app/navigation'
  import CreateOrModifyEventSignup from '$lib/components/CreateOrModifyEventSignup.svelte';
  import { onMount } from 'svelte';

  /**
   * Navigate to the event details page when an event is clicked
   * @param {string} eventId - The unique identifier for the event
   */
  function goToDetails(eventId: any) {
    goto(`/carpool/${eventId}`)
  }


  let isAdmin = $state(true);

  console.log('page is loading')
  onMount(() => {
    console.log('onmount called')

    const user = sessionStorage.getItem('user');

    if (user) {
      const parsedUser = JSON.parse(user);
      isAdmin = parsedUser.is_admin;
      console.log(parsedUser)
    } else {
      const m = document.cookie.match(/(?:^|; )user=([^;]+)/)
      const raw = m?.[1]
      let parsedUser = null
      if (raw) {
        try {
          parsedUser = JSON.parse(decodeURIComponent(raw))
        } catch (e) {
          console.warn('Failed to parse user cookie', e)
        }
      }

      isAdmin = parsedUser?.is_admin ?? isAdmin;
    }
  });

  let { data } = $props();
  let { events = [] } = $derived(data)

  let modifying: Record<string, any> | null = $state(null)
  let confirmDelete = $state(new Array(events.length).fill(false));

  function setModifying(subject: Record<string, any> | null, mode: string) {
    if (subject) {
      subject.mode = mode
    }
    
    modifying = subject
  }
  
  async function deleteEvent(eventId: string) {
    await fetch(`/api/carpool/event/${eventId}`, { method: 'DELETE' }).then(async (res) => {
        if (res.ok) {
            // Successfully deleted, refresh the page or navigate away
            location.reload();
        } else {
            const result = await res.json();
            const err = result?.error ?? result;
            const message = typeof err === 'object' ? JSON.stringify(err, null, 2) : String(err);
            alert(message || 'Failed to delete event');
        }
    }).catch(console.error);
  }

  //console.log('events?:', events)
</script>

<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1>Carpool Events</h1>
    {#if isAdmin}
      {#if modifying}
        <CreateOrModifyEventSignup Subject={modifying} SetModifying={setModifying} />
      {/if}
      <div class="admin-actions">
        <button class="btn btn-success me-2" onclick={() => goto('/carpool/vehicles')}>
          Manage Vehicles
        </button>
        <button class="btn btn-primary" onclick={() => setModifying({ mode: 'createEvent', item: {} }, 'createEvent')}>
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
      {#each events as event, index}
        <div class="col-md-6">
          <div class="card mb-6">
            <div class="card-body">
              <h2 class="card-title"><a href="/carpool/{event.id}">{event.name}</a></h2>
              <p class="card-text">{event.description}</p>
              <p class="card-text"><strong>Start Date:</strong> {event.start_date}</p>
              <p class="card-text"><strong>End Date:</strong> {event.end_date}</p>
              <p class="card-text"><strong>Location:</strong> {event.location}</p>
              <button class="btn btn-primary" onclick={() => goToDetails(event.id)}>View Trips</button>

              {#if isAdmin}
                <div class="bg-light p-2 rounded">
                  <button class="btn btn-secondary" onclick={() => setModifying({ mode: 'editEvent', item: event }, 'editEvent')}>Edit Event</button>
                  <button class="btn btn-danger" onclick={() => {
                      if (confirmDelete[index]) {
                        // TODO create better dialog
                        let deletionConfirmed = confirm('Are you sure you want to delete this event?\nThis action cannot be undone.');
                        if (deletionConfirmed) {
                          deleteEvent(event.id);
                        }
                        confirmDelete[index] = false;
                      } else {
                          confirmDelete[index] = true;
                          setTimeout(() => {
                              confirmDelete[index] = false;
                          }, 2000);
                      }
                  }}>{confirmDelete[index] ? "Confirm Event Deletion?" : "Delete Event"}</button>
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
