<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let isAdmin = false;
    let formData = {
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        status: 'draft'
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
    });

    async function createEvent() {
        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create event.');
            }

            const result = await response.json();
            alert('Event created successfully!');
            goto(`/carpool/${result.id}/edit`);
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event.');
        }
    }
</script>

<div class="container mt-4">
    <h1>Create New Carpool Event</h1>

    {#if isAdmin}
        <div class="card">
            <div class="card-body">
                <form on:submit|preventDefault={createEvent}>
                    <div class="mb-3">
                        <label for="name" class="form-label">Event Name</label>
                        <input
                            type="text"
                            class="form-control"
                            id="name"
                            bind:value={formData.name}
                            required
                        />
                    </div>

                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <textarea
                            class="form-control"
                            id="description"
                            rows="3"
                            bind:value={formData.description}
                            required
                        ></textarea>
                    </div>

                    <div class="row mb-3">
                        <div class="col">
                            <label for="start_date" class="form-label">Start Date</label>
                            <input
                                type="date"
                                class="form-control"
                                id="start_date"
                                bind:value={formData.start_date}
                                required
                            />
                        </div>
                        <div class="col">
                            <label for="end_date" class="form-label">End Date</label>
                            <input
                                type="date"
                                class="form-control"
                                id="end_date"
                                bind:value={formData.end_date}
                                required
                            />
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="location" class="form-label">Location</label>
                        <input
                            type="text"
                            class="form-control"
                            id="location"
                            bind:value={formData.location}
                            required
                        />
                    </div>

                    <div class="mb-3">
                        <label for="status" class="form-label">Status</label>
                        <select class="form-select" id="status" bind:value={formData.status}>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-secondary" on:click={() => goto('/carpool')}>
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">Create Event</button>
                    </div>
                </form>
            </div>
        </div>
    {:else}
        <div class="alert alert-danger">
            <strong>Access Denied:</strong> You must be an admin to create carpool events.
        </div>
    {/if}
</div>

<style>
    .card {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
</style>
