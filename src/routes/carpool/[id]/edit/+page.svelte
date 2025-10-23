<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    export let data;

    if (!data || !data.event) {
        throw new Error('Event data is not available');
    }

    let isAdmin = false;
    let event = data.event; // Access event data from the data prop
    let formData = { ...event };

    onMount(() => {
        const user = sessionStorage.getItem('user');

        if (user) {
            const parsedUser = JSON.parse(user);
            isAdmin = parsedUser.is_admin;
        }
    });

    async function saveEvent() {
        try {
            const response = await fetch(`/api/events/${event.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update event.');
            }

            alert('Event updated successfully!');
            goto('/carpool');
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Failed to update event.');
        }
    }

    async function archiveEvent() {
        try {
            const response = await fetch(`/api/events/${event.id}/archive`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to archive event.');
            }

            alert('Event archived successfully!');
            goto('/carpool');
        } catch (error) {
            console.error('Error archiving event:', error);
            alert('Failed to archive event.');
        }
    }
</script>

<h1>Carpool Event Edit</h1>

{#if isAdmin === undefined}
    <p>Loading...</p>
{:else if isAdmin}
    <div class="alert alert-info">
        <strong>Admin Access:</strong> You have admin access to manage carpool events.
    </div>

    <h2>Basic Information</h2>

    <form on:submit|preventDefault={saveEvent}>
        <label for="event-name">Event Name</label>
        <input bind:value={formData.name} name="event-name" type="text" placeholder="Event Name" class="form-control mb-2" />

        <label for="event-description">Event Description</label>
        <textarea bind:value={formData.description} name="event-description" placeholder="Event Description" class="form-control mb-2"></textarea>

        <label for="event-start-date">Event Start Date</label>
        <input bind:value={formData.start_date} name="event-start-date" type="date" class="form-control mb-2" />

        <label for="event-end-date">Event End Date</label>
        <input bind:value={formData.end_date} name="event-end-date" type="date" class="form-control mb-2" />

        <label for="event-location">Event Location</label>
        <input bind:value={formData.location} name="event-location" type="text" placeholder="Event Location" class="form-control mb-2" />

        <label for="event-status">Event Status</label>
        <select bind:value={formData.status} name="event-status" class="form-control mb-2">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
        </select>

        <br />

        <button type="submit" class="btn btn-primary">Save Changes</button>
        <button type="button" class="btn btn-danger" on:click={archiveEvent}>Archive Event</button>
    </form>

    <h2>Trips</h2>

    {#if event.trips && event.trips?.length > 0}
        <div class="row events-list">
            {#each event.trips as trip}
                <div class="col-md-6">
                    <div class="card mb-6">
                        <div class="card-body">
                            <h2 class="card-title">
                                <a href={`/carpool/ride/${trip.collection}/${trip.id}`}>{trip.destination}</a>
                            </h2>
                            <p class="card-text"><strong>Departs From:</strong> {trip.departs_from}</p>
                            <p class="card-text"><strong>Departs On:</strong> {trip.departs_on}</p>
                            <p class="card-text"><strong>Departs At:</strong> {trip.departs_at}</p>
                            <p class="card-text"><strong>Arrives At:</strong> {trip.destination}</p>

                            <p>trip id: {trip.id}</p>

                            <button class="btn btn-primary" on:click={() => goto(`/carpool/ride/${trip.collection}/${trip.id}`)}>View Trip</button>

                            <div class="bg-light p-2 rounded">
                                <button class="btn btn-secondary" on:click={() => goto(`/carpool/ride/${trip.collection}/${trip.id}/edit`)}>Edit Trip</button>
                                <button class="btn btn-danger" on:click={() => alert("Delete trip functionality not implemented yet")}>Delete Trip</button>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <p>No trips available for this event.</p>
    {/if}
{:else}
    <div class="alert alert-danger">
        <strong>Access Denied:</strong> You do not have permission to edit carpool events.
    </div>

    <button class="btn btn-primary" on:click={() => goto('/carpool')}>Go Back</button>
{/if}

<br /> <br />