<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    export let data;

    if (!data || !data.event) {
        throw new Error('Event data is not available');
    }

    let isAdmin: boolean | undefined = undefined;
    let trip = data.event[0]; // Access trip data from the data prop
    let formData = { ...trip.item };
    let availableRides = data.availableRides || [];
    let selectedRideId = '';
    let showAddCarForm = false;

    onMount(() => {
        const user = sessionStorage.getItem('user');

        if (user) {
            const parsedUser = JSON.parse(user);
            isAdmin = parsedUser.is_admin;

            console.log(formData)
        }
    });

    async function saveTrip() {
        try {
            // Filter out complex nested data that shouldn't be updated via trip mutation
            const tripUpdateData = {
                id: formData.id,
                destination: formData.destination,
                departs_from: formData.departs_from,
                departs_on: formData.departs_on,
                departs_at: formData.departs_at,
                status: formData.status
                // Explicitly exclude 'rides' - they should be updated separately
            };
            
            const response = await fetch(`/api/trips/${$page.params.triptype}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tripUpdateData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update trip: ${response.status} ${errorText}`);
            }

            const result = await response.json();

            alert('Trip updated successfully!');
            goto(`/carpool/ride/${formData.id}/${$page.params.triptype}`);
        } catch (error) {
            console.error('Error updating trip:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to update trip: ${errorMessage}`);
        }
    }

    function handleViewRide(rideId: any) {
        if (rideId) {
            goto(`/carpool/vehicle/${rideId}`);
        }
    }

    async function removeRide(rideId: any) {
        if (!confirm('Are you sure you want to remove this ride?')) {
            return;
        }

        try {
            const response = await fetch(`/api/triprides/${rideId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete ride');
            }

            alert('Ride removed successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error removing ride:', error);
            alert('Failed to remove ride. Please try again.');
        }
    }

    function getAvailableSeats(ride: any) {
        if (!ride?.item?.ride?.seats) return 0;
        const totalSeats = ride.item.ride.seats;
        const riderCount = ride.item.riders?.length || 0;
        return totalSeats - riderCount;
    }

    function getRiderCount(ride: any) {
        return ride?.item?.riders?.length || 0;
    }

    function toggleAddCarForm() {
        showAddCarForm = !showAddCarForm;
        if (!showAddCarForm) {
            selectedRideId = '';
        }
    }

    async function addCarToTrip() {
        if (!selectedRideId) {
            alert('Please select a car to add.');
            return;
        }

        try {
            const tripRideData = {
                ride: selectedRideId,
                trip: formData.id,
                tripType: $page.params.triptype
            };

            console.log('Sending trip ride data:', tripRideData);

            const response = await fetch('/api/triprides', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tripRideData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response error:', errorText);
                
                // Try to parse as JSON for better error details
                try {
                    const errorJson = JSON.parse(errorText);
                    throw new Error(`Failed to add car: ${response.status} - ${errorJson.error || errorText}`);
                } catch (parseError) {
                    throw new Error(`Failed to add car: ${response.status} - ${errorText}`);
                }
            }

            const result = await response.json();
            console.log('Trip ride created successfully:', result);

            alert('Car added successfully!');
            showAddCarForm = false;
            selectedRideId = '';
            window.location.reload(); // Refresh to show the new car
        } catch (error) {
            console.error('Error adding car:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to add car: ${errorMessage}`);
        }
    }

    function getSelectedCarInfo() {
        if (!selectedRideId) return null;
        return availableRides.find(ride => ride.id === selectedRideId);
    }
</script>

<h1>Carpool Trip Edit</h1>

{#if isAdmin === undefined}
    <p>Loading...</p>
{:else if isAdmin}
    <div class="alert alert-info">
        <strong>Admin Access:</strong> You have admin access to manage carpool trips.
    </div>

    <h2>Basic Information</h2>

    <form on:submit|preventDefault={saveTrip}>
        <label for="trip-destination">Destination</label>
        <input bind:value={formData.destination} name="trip-destination" type="text" placeholder="Destination" class="form-control mb-2" />
        <label for="trip-departs-from">Departs From</label>
        <input bind:value={formData.departs_from} name="trip-departs-from" type="text" placeholder="Departs From" class="form-control mb-2" />
        <label for="trip-departs-on">Departs On</label>
        <input bind:value={formData.departs_on} name="trip-departs-on" type="date" class="form-control mb-2" />
        <label for="trip-departs-at">Departs At</label>
        <input bind:value={formData.departs_at} name="trip-departs-at" type="time" class="form-control mb-2" />
        <label for="trip-status">Status</label>
        <select bind:value={formData.status} name="trip-status" class="form-control mb-2">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
        </select>

        <br />

        <button type="submit" class="btn btn-primary">Save Changes</button>
    </form>

    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Rides for this Trip</h2>
        <button class="btn btn-success" on:click={toggleAddCarForm}>
            {showAddCarForm ? 'Cancel' : 'Add Car'}
        </button>
    </div>

    {#if showAddCarForm}
        <div class="card mb-4">
            <div class="card-header">
                <h3 class="mb-0">Add Car to Trip</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-8">
                        <label for="car-select" class="form-label">Select a Car:</label>
                        <select bind:value={selectedRideId} id="car-select" class="form-control mb-3">
                            <option value="">-- Select a car --</option>
                            {#each availableRides as ride}
                                <option value={ride.id}>
                                    {ride.name} ({ride.vehicle_type}) - {ride.seats} seats
                                    {#if ride.driver?.item}
                                        - Driver: {ride.driver.item.firstname} {ride.driver.item.lastname}
                                    {/if}
                                </option>
                            {/each}
                        </select>
                        
                        {#if getSelectedCarInfo()}
                            <div class="alert alert-info">
                                <strong>Selected Car Details:</strong><br>
                                <strong>Name:</strong> {getSelectedCarInfo().name}<br>
                                <strong>Type:</strong> {getSelectedCarInfo().vehicle_type}<br>
                                <strong>Seats:</strong> {getSelectedCarInfo().seats}<br>
                                {#if getSelectedCarInfo().driver?.item}
                                    <strong>Driver:</strong> {getSelectedCarInfo().driver.item.firstname} {getSelectedCarInfo().driver.item.lastname}
                                {/if}
                            </div>
                        {/if}
                    </div>
                    <div class="col-md-4">
                        <div class="d-flex flex-column gap-2">
                            <button class="btn btn-primary" on:click={addCarToTrip} disabled={!selectedRideId}>
                                Add Selected Car
                            </button>
                            <button class="btn btn-secondary" on:click={toggleAddCarForm}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    {#if formData.rides && formData.rides.length > 0}
        <div class="row">
            {#each formData.rides as ride}
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h2 class="mb-0">
                                {ride.item?.ride?.name || 'Unnamed Ride'}
                            </h2>
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
                                <button class="btn btn-primary btn-sm" on:click={() => handleViewRide(ride.item?.id)}>
                                    View Details
                                </button>
                                <button class="btn btn-danger btn-sm" on:click={() => removeRide(ride.item?.id)}>
                                    Remove Ride
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
{:else}
    <div class="alert alert-danger">
        <strong>Access Denied:</strong> You do not have permission to edit carpool trips.
    </div>

    <button class="btn btn-primary" on:click={() => goto('/carpool')}>Go Back</button>
{/if}

<br /> <br />

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

  .btn-success {
    background-color: #28a745;
    border-color: #28a745;
    color: white;
  }

  .btn-success:hover {
    background-color: #218838;
    border-color: #1e7e34;
  }

  .form-control {
    border-radius: 0.25rem;
    border: 1px solid #ced4da;
    padding: 0.375rem 0.75rem;
  }

  .form-label {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  #car-select {
    width: 100%;
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

  .flex-column {
    flex-direction: column;
  }

  .gap-2 > * + * {
    margin-top: 0.5rem;
  }

  .mb-3 {
    margin-bottom: 1rem;
  }

  .mb-4 {
    margin-bottom: 1.5rem;
  }
</style>