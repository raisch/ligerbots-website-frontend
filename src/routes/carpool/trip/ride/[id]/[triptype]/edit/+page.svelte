<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import type { Trip } from '$lib/types';
    import { page } from '$app/stores';

    export let data;

    if (!data || !data.event) {
        throw new Error('Event data is not available');
    }

    let isAdmin = undefined;
    let trip = data.event[0]; // Access trip data from the data prop
    let formData = { ...trip.item };

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
            const response = await fetch(`/api/trips/${$page.params.triptype}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update trip.');
            }

            alert('Trip updated successfully!');
            goto(`/carpool/trip/ride/${formData.id}/${$page.params.triptype}`);
        } catch (error) {
            console.error('Error updating trip:', error);
            alert('Failed to update trip.');
        }
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
{:else}
    <div class="alert alert-danger">
        <strong>Access Denied:</strong> You do not have permission to edit carpool trips.
    </div>

    <button class="btn btn-primary" on:click={() => goto('/carpool')}>Go Back</button>
{/if}

<br /> <br />