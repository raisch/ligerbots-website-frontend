<script lang="ts">
  //////// COPIED FROM /carpool/[id]/+page.svelte ////////
  // TODO rewrite to change to vehicle creation and editing page



  // List Active Carpool Events
  // path: /carpool

  import { goto } from '$app/navigation'
  import CreateOrModifyEventSignup from '$lib/components/CreateOrModifyEventSignup.svelte';
  import CreateOrModifyVehicle from '$lib/components/CreateOrModifyVehicle.svelte';
  import UserShortDisplay from '$lib/components/UserShortDisplay.svelte';
  import { checkIfAdmin } from '$lib/util.js';
  import { onMount } from 'svelte';

  /**
   * Navigate to the event details page when an event is clicked
   * @param {string} eventId - The unique identifier for the event
   */
  function goToDetails(eventId: any) {
    goto(`/carpool/${eventId}`)
  }

  let { data } = $props();
  let { cars, userId, isAdmin, eligibleDrivers, userCanHaveCar } = $derived(data);

  let modifying: Record<string, any> | null = $state(null)
  let confirmDelete = $state(new Array(cars.length).fill(false));

  function setModifying(subject: Record<string, any> | null, mode: string) {
    if (subject) {
      subject.mode = mode
    }
    
    modifying = subject
  }
  async function deleteVehicle(vehicleId: any) {
    await fetch(`/api/carpool/vehicle/${vehicleId}`, { method: 'DELETE' }).then(async (res) => {
        if (res.ok) {
            // Successfully deleted, refresh the page or navigate away
            location.reload();
        } else {
            const result = await res.json();
            const err = result?.error ?? result;
            const message = typeof err === 'object' ? JSON.stringify(err, null, 2) : String(err);
            alert(message || 'Failed to delete vehicle');
        }
    }).catch(console.error);
  }

  onMount(() => {
  //   const user = sessionStorage.getItem('user');
  // if (user) {
  //     const parsedUser = JSON.parse(user);
  //     isAdmin = parsedUser.is_admin;
  //     userId = parseInt(parsedUser.id);
  //     console.log(parsedUser)
  //   } else {
  //     const m = document.cookie.match(/(?:^|; )user=([^;]+)/)
  //     const raw = m?.[1]
  //     let parsedUser = null
  //     if (raw) {
  //       try {
  //         parsedUser = JSON.parse(decodeURIComponent(raw))
  //       } catch (e) {
  //         console.warn('Failed to parse user cookie', e)
  //       }
  //     }

  //     isAdmin = parsedUser?.is_admin ?? isAdmin;
  //     userId = parsedUser?.id ? parseInt(parsedUser.id) : userId;
  //   }
  })

  //console.log('events?:', events)
</script>

<div class="container mt-4">
  <div class="header-container">
    <h1>Carpool Vehicles</h1>
    {#if isAdmin || userCanHaveCar}
      {#if modifying}
        <CreateOrModifyVehicle {userId} {isAdmin} {eligibleDrivers} Subject={modifying} SetModifying={setModifying} />
      {/if}
      <div class="admin-actions">
        <button class="btn btn-success" onclick={() => setModifying({ mode: 'create', item: {} }, 'create')}>
          Create Vehicle
        </button>
      </div>
    {:else}
      <div>
        You cannot create a vehicle because you do not meet the requirements to be a carpool driver.
        To be a carpool driver, you must have a valid driver's license and complete a CORI and SORI form.
        <br>
        <i>If you believe this is an error, please contact an administrator to fix your issue.</i>
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
      {#each cars as car, index}
        {@const { id, name, vehicle_type, seats, driver } = car}
        <div class="card-body">
          <div>
            <h2 class="card-title">{name}</h2>
            <!-- <p class="card-text">{car.description}</p> -->
            <p class="card-text"><strong>Type:</strong> {vehicle_type}</p>
            <p class="card-text"><strong>Seats:</strong> {seats}</p>
            <p class="card-text"><strong>Driver:</strong></p>
            <ul>{#each driver as user}<UserShortDisplay user={user.item! ?? {}} />{/each}</ul>
          </div>
          {#if isAdmin}
            <div class="bg-light p-2 rounded vehicle-actions">
              <button class="btn btn-secondary" onclick={() => setModifying({ mode: 'edit', item: car }, 'edit')}>Edit Vehicle</button>
              <button class="btn btn-danger" onclick={() => {
                  if (confirmDelete[index]) {
                    // TODO create better dialog
                    let deletionConfirmed = confirm('Are you sure you want to delete this event?\nThis action cannot be undone.');
                    if (deletionConfirmed) {
                      deleteVehicle(car.id);
                    }
                    confirmDelete[index] = false;
                  } else {
                      confirmDelete[index] = true;
                      setTimeout(() => {
                          confirmDelete[index] = false;
                      }, 2000);
                  }
              }}>{confirmDelete[index] ? "Confirm Vehicle Deletion?" : "Delete Vehicle"}</button>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else if isAdmin || userCanHaveCar}
    <p>No vehicles available.</p>
  {/if}
</div>

<style>
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
  }
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
  .events-list::before, .events-list::after {
    display: none;
  }
  .card-body {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #fff;
    min-width: 300px;
    width: 33%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .card-title {
    font-size: 1.5em;
    margin: 10px 0;
  }
  .card-text {
    font-size: 1em;
    margin: 0;
  }
  .vehicle-actions {
    display: flex;
    width: 100%;
    gap: 10px;
    align-self: center;
  }
  .vehicle-actions .btn {
    width: calc(50% - 2px);
    padding: 6px 0;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
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
