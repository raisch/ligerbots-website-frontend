<script lang="ts">
    import { goto } from '$app/navigation';
    import type { Event } from '$lib/types';
    import { onMount } from 'svelte';
    
    export let data;
    export let events: Event[] = data?.events || [];

    let isAdmin = undefined;

    onMount(() => {
        const user = sessionStorage.getItem('user');

        if (user) {
            const parsedUser = JSON.parse(user);
            isAdmin = parsedUser.is_admin;
        }
    });
</script>

<h1>Carpool Event Edit</h1>

{#if isAdmin === undefined}
    <p>Loading...</p>
{:else if isAdmin}
    <div class="alert alert-info">
        <strong>Admin Access:</strong> You have admin access to manage carpool events.
    </div>

    <h2>Basic Information</h2>

    <label for="event-name">Event Name</label>
    <input bind:value={data.event.name} name="event-name" type="text" placeholder="Event Name" class="form-control mb-2" />

    <label for="event-description">Event Description</label>
    <textarea bind:value={data.event.description} name="event-description" placeholder="Event Description" class="form-control mb-2"></textarea>

    <label for="event-start-date">Event Start Date</label>
    <input bind:value={data.event.start_date} name="event-start-date" type="date" class="form-control mb-2" />

    <label for="event-end-date">Event End Date</label>
    <input bind:value={data.event.end_date} name="event-end-date" type="date" class="form-control mb-2" />

    <label for="event-location">Event Location</label>
    <input bind:value={data.event.location} name="event-location" type="text" placeholder="Event Location" class="form-control mb-2" />

    <label for="event-status">Event Status</label>
    <select bind:value={data.event.status} name="event-status" class="form-control mb-2">
        <option value="published">Published</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
    </select>

    <br />

    <button class="btn btn-primary" disabled>Save Changes</button>
    <p>
        <strong>Note:</strong> saving changes not implemented yet until coach rob updates backend :)
    </p>

    <h2>Trips</h2>

    {#if data.event.trips.length > 0}
        <div class="row events-list">
            {#each data.event.trips as trip}
                <div class="col-md-6">
                    <div class="card mb-6">
                        <div class="card-body">
                            <h2 class="card-title">
                                <a href={`/carpool/trip/ride/${trip.item.id}`}>{trip.item.destination}</a>
                            </h2>
                            <p class="card-text"><strong>Departs From:</strong> {trip.item.departs_from}</p>
                            <p class="card-text"><strong>Departs On:</strong> {trip.item.departs_on}</p>
                            <p class="card-text"><strong>Departs At:</strong> {trip.item.departs_at}</p>
                            <p class="card-text"><strong>Arrives At:</strong> {trip.item.destination}</p>

                            <button class="btn btn-primary" on:click={() => goto(`/carpool/trip/ride/${trip.item.id}`)}>View Trip</button>

                            <div class="bg-light p-2 rounded">
                                <button class="btn btn-secondary" on:click={() => goto(`/carpool/trip/ride/${trip.item.id}/edit`)}>Edit Trip</button>
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