<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    let isAdmin = false;
    let cars = data.cars || [];
    let users = data.users || [];
    let showCreateForm = false;
    let editingCar: any = null;

    // Form data for creating/editing cars
    let formData = {
        name: '',
        vehicle_type: '',
        seats: '4',
        driver: ''
    };

    onMount(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            isAdmin = parsedUser.is_admin;
            
            if (!isAdmin) {
                // Redirect non-admin users
                goto('/carpool');
            }
        } else {
            // Redirect users who aren't logged in
            goto('/carpool');
        }
        
        console.log('Cars data:', cars);
        console.log('Users data:', users);
    });

    function resetForm() {
        formData = {
            name: '',
            vehicle_type: '',
            seats: '4',
            driver: ''
        };
        editingCar = null;
        showCreateForm = false;
    }

    function startCreateCar() {
        resetForm();
        showCreateForm = true;
    }

    function startEditCar(car: any) {
        formData = {
            name: car.name || '',
            vehicle_type: car.vehicle_type || '',
            seats: String(car.seats || 4),
            driver: car.driver?.item?.id || ''
        };
        editingCar = car;
        showCreateForm = true;
    }

    async function saveCar() {
        try {
            const carData = {
                name: formData.name,
                vehicle_type: formData.vehicle_type,
                seats: parseInt(formData.seats),
                driver: formData.driver ? { id: formData.driver, collection: 'users' } : null
            };

            let response;
            if (editingCar) {
                // Update existing car
                response = await fetch(`/api/rides/${editingCar.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(carData),
                });
            } else {
                // Create new car
                response = await fetch('/api/rides', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(carData),
                });
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save car: ${response.status} ${errorText}`);
            }

            alert(editingCar ? 'Car updated successfully!' : 'Car created successfully!');
            resetForm();
            window.location.reload(); // Refresh to show updated data
        } catch (error) {
            console.error('Error saving car:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to save car: ${errorMessage}`);
        }
    }

    async function deleteCar(car: any) {
        if (!confirm(`Are you sure you want to delete "${car.name}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/rides/${car.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete car: ${response.status} ${errorText}`);
            }

            alert('Car deleted successfully!');
            window.location.reload(); // Refresh to show updated data
        } catch (error) {
            console.error('Error deleting car:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to delete car: ${errorMessage}`);
        }
    }

    function getDriverName(car: any) {
        if (car.driver?.item) {
            return `${car.driver.item.firstname} ${car.driver.item.lastname}`;
        }
        return 'No driver assigned';
    }
</script>

<div class="container mt-4">
    <h1>Car Management</h1>

    {#if isAdmin}
        <div class="d-flex justify-content-between align-items-center mb-4">
            <p class="text-muted">Manage cars available for carpool trips</p>
            <button class="btn btn-success" on:click={startCreateCar}>
                Add New Car
            </button>
        </div>

        <!-- Create/Edit Car Form -->
        {#if showCreateForm}
            <div class="card mb-4">
                <div class="card-header">
                    <h3 class="mb-0">{editingCar ? 'Edit Car' : 'Add New Car'}</h3>
                </div>
                <div class="card-body">
                    <form on:submit|preventDefault={saveCar}>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="car-name" class="form-label">Car Name *</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="car-name"
                                        bind:value={formData.name}
                                        placeholder="e.g., John's Toyota Camry"
                                        required
                                    />
                                </div>

                                <div class="mb-3">
                                    <label for="vehicle-type" class="form-label">Vehicle Type *</label>
                                    <select class="form-control" id="vehicle-type" bind:value={formData.vehicle_type} required>
                                        <option value="">-- Select vehicle type --</option>
                                        <option value="Sedan">Sedan</option>
                                        <option value="SUV">SUV</option>
                                        <option value="Hatchback">Hatchback</option>
                                        <option value="Minivan">Minivan</option>
                                        <option value="Truck">Truck</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="seats" class="form-label">Number of Seats *</label>
                                    <input
                                        type="number"
                                        class="form-control"
                                        id="seats"
                                        bind:value={formData.seats}
                                        min="1"
                                        max="15"
                                        required
                                    />
                                </div>

                                <div class="mb-3">
                                    <label for="driver" class="form-label">Driver (Optional)</label>
                                    <select class="form-control" id="driver" bind:value={formData.driver}>
                                        <option value="">-- No driver assigned --</option>
                                        {#each users as user}
                                            <option value={user.id}>
                                                {user.firstname} {user.lastname} ({user.email_address})
                                            </option>
                                        {/each}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-primary">
                                {editingCar ? 'Update Car' : 'Create Car'}
                            </button>
                            <button type="button" class="btn btn-secondary" on:click={resetForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        {/if}

        <!-- Cars List -->
        <div class="card">
            <div class="card-header">
                <h3 class="mb-0">Available Cars ({cars.length})</h3>
            </div>
            <div class="card-body">
                {#if cars.length > 0}
                    <div class="row">
                        {#each cars as car}
                            <div class="col-md-6 col-lg-4 mb-3">
                                <div class="card">
                                    <div class="card-header d-flex justify-content-between align-items-center">
                                        <h5 class="mb-0">{car.name}</h5>
                                        <span class="badge badge-info">{car.seats} seats</span>
                                    </div>
                                    <div class="card-body">
                                        <p><strong>Type:</strong> {car.vehicle_type}</p>
                                        <p><strong>Driver:</strong> {getDriverName(car)}</p>
                                        
                                        <div class="d-flex gap-2 mt-3">
                                            <button 
                                                class="btn btn-sm btn-primary" 
                                                on:click={() => startEditCar(car)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                class="btn btn-sm btn-danger" 
                                                on:click={() => deleteCar(car)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="alert alert-info">
                        <p>No cars have been added yet. Click "Add New Car" to get started.</p>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Navigation -->
        <div class="mt-4">
            <button class="btn btn-secondary" on:click={() => goto('/carpool')}>
                Back to Carpool Events
            </button>
        </div>
    {:else}
        <div class="alert alert-danger">
            <strong>Access Denied:</strong> You must be an admin to manage cars.
        </div>
    {/if}
</div>

<style>
    .badge {
        color: white;
        padding: 0.5em 0.75em;
        border-radius: 0.25rem;
        display: inline-block;
        margin-right: 0.5rem;
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
        border-radius: 0.25rem;
        border: 1px solid #ced4da;
        padding: 0.375rem 0.75rem;
        margin-bottom: 1rem;
    }

    .form-label {
        font-weight: bold;
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

    .d-flex {
        display: flex;
    }

    .justify-content-between {
        justify-content: space-between;
    }

    .align-items-center {
        align-items: center;
    }

    .gap-2 > * + * {
        margin-left: 0.5rem;
    }

    .mb-3 {
        margin-bottom: 1rem;
    }

    .mb-4 {
        margin-bottom: 1.5rem;
    }

    .mt-3 {
        margin-top: 1rem;
    }

    .mt-4 {
        margin-top: 1.5rem;
    }

    .text-muted {
        color: #6c757d;
    }
</style>