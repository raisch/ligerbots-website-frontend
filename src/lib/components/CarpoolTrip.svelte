<script>
  import { goto, invalidate, invalidateAll } from '$app/navigation';
  import { search } from '$lib/util';
  import { addCarToTrip, removeCarFromTrip } from '../../routes/carpool/ride.remote';



    /** 
     * @type {{ 
     *   trip: import('$lib/server/trip').TripType,
     *   RideId: number | null,
     *   SetId: (rideId: number | null) => void,
     *   previousDestinationRideId: number | null,
     *   previousReturnRideId: number | null,
     *   isAdmin: boolean,
     *   modifying: Record<string, any> | null,
     *   activeCarEditor: string | null,
     *   SetModifying: (subject: Record<string, any> | null, mode: string) => void,
     *   SetActiveCarEditor: (carId: string | null) => void,
     *   cars: { allCars: import('$lib/server/event').RideRecord[], userOwnedCars: import('$lib/server/event').RideRecord[], userCanHaveCar: boolean },
     *   userId: number | null
     * }} 
     */
    let { trip, RideId, SetId, previousDestinationRideId, previousReturnRideId, isAdmin, modifying, activeCarEditor, SetModifying, SetActiveCarEditor, cars, userId } = $props();

    let filter = $state('');

    /**
     * Set the current modifying subject if none is set.
     * @param {Record<string, any> | null} newSubject
     * @param {string} mode
     * @returns {void}
     */
    function setSubject(newSubject, mode) {
        // notify parent to set the modifying subject rather than mutating the prop locally
        if (typeof SetModifying === 'function') {
            SetModifying(newSubject, mode)
        }
    }

    /**
     * Delete a trip by its ID.
     * @param {number} relationshipId - The ID of the relationship to delete.
     * @param {number} id - The ID of the trip to delete.
     * @param {string} collection - The collection the trip belongs to.
     */
    function deleteTrip(relationshipId, id, collection) {
        const url = collection ? `/api/carpool/trip/${id}?collection=${encodeURIComponent(collection)}&relationship=${encodeURIComponent(relationshipId)}` : `/api/carpool/trip/${id}?relationship=${encodeURIComponent(relationshipId)}`;
        fetch(url, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(async (res) => {
                        if (res.ok) {
                            // Successfully deleted, refresh the page or navigate away
                            location.reload();
                        } else {
                            const result = await res.json();
                            const err = result?.error ?? result;
                            const message = typeof err === 'object' ? JSON.stringify(err, null, 2) : String(err);
                            alert(message || 'Failed to delete trip');
                        }
                    }).catch((error) => {
                        alert('Error deleting trip: ' + (error && error.message ? error.message : String(error)));
                    });
    }

    let confirm = $state(false);
    let infoId = $state(-1);
    // $inspect(infoId);
    // $inspect(JSON.stringify(trip.collection));

    /**
   * @param {number} id
   */
    function selectInfoBox(id) {
        return (/** @type {Event} */ event) => {
            event.stopPropagation();
            infoId = infoId === id ? -1 : id;
        }
    }

    /**
     * @param {string} id
     */
    async function addCar(id) {
        console.log('addCar(', id, ')')
        await addCarToTrip({ collection: trip.collection, tripId: trip.item.id, rideId: id })
    }
    /**
     * @param {string} id
     * @param {'destination_trip'|'return_trip'} collection
     * @param {any} ride
     */
    async function removeCar(id, collection = trip.collection, ride) {
        alert("removeCar called with id: " + id + '\n' + Object.keys(ride) + '\n' + JSON.stringify(ride, null, 2))
        const relationshipId = trip.item.rides.find(r => r.item?.id === id)?.id ?? '';
        await removeCarFromTrip({ tripRideId: id, collection, relationshipId })
    }

    /** 
     * @param {import('$lib/server/ride').RideType[]} rides
     * @param {string} id
     */
    async function addCarIfNotPresent(rides, id) {
        try {
            const ride = rides.find(ride => ride.item?.ride.id === id);
            if (ride) return alert('You have already added this car to the trip.');
            const result = await addCar(id);
            // alert(result)
            invalidateAll();
        } catch (error) {
            alert(error)
        }
    }
</script>
<div style="position: relative;">
    {#if trip}
        {@const {item} = trip}
        {@const rides = trip?.item?.rides}
        <span style="flex-basis: 100%;">From {item?.departs_from} to {item?.destination}</span>
            {#if isAdmin}
            <span class="deleteButton" onclick={() => {
                if (confirm) {
                    // Perform deletion
                    deleteTrip(parseInt(trip.id), parseInt(item.id), trip.collection);
                } else {
                    confirm = true;
                    setTimeout(() => {
                        confirm = false;
                    }, 2000);
                }
            }}>{confirm ? "Confirm?" : "Delete"}</span>
            <span class="editButton" onclick={() => setSubject(trip, "edit")}>Edit</span>
        {/if}
        
        <span style="flex-basis: 100%;">Date: {item?.departs_on}</span>
        <span>Departs at {item?.departs_at}</span>
        <span>Arrives at {item?.arrives_at}</span>
        {#if rides}
        {#each rides as ride}
            {@const { item } = ride}
            {@const id = parseInt(item?.id)}
            {@const { riders = [], ride: { seats, driver: drivers = [], name: vehicheName, vehicle_type } } = ride.item ?? { ride: {} }}
	        {@const remaining = seats - item?.riders_func.count - (RideId === id ? 1 : 0) + (previousDestinationRideId === id || previousReturnRideId === id ? 1 : 0)}
	        {@const seatDisplay = remaining > 0 ? `${remaining}/${seats} Seats Remaining` : 'Full'}
            
            <!-- {@const { driver: {} } = item?.ride ?? {}} -->

	        <div 
                style="flex-basis: 100%; display: flex; align-items: center; width: 100%; cursor: {remaining > 0 || RideId === id ? 'pointer' : 'not-allowed'}; {RideId === id ? 'outline: 2px solid #3375a6;     background-color: #3375a61f;' : ''}"
                onclick={() => {
                        if (remaining <= 0 || RideId === id) return; // User cannot select a full ride, user cannot re-select the same ride
                        SetId(id)
                }}>
		        <span style="flex: 1; text-align: left;">{vehicheName} – {#if RideId === id}*{/if}{remaining}/{seats}</span>
                <div class="info-button" onclick={selectInfoBox(id)}>info</div>
		        <span
                style="flex: 0 0 1rem; text-align: right; background-color: {remaining > 0 || RideId === id ? '#3375a6' : '#808080'}; border-radius: 5px; padding: 3px 5px; color: white;"
                >{RideId === id ? "Selected" : (remaining > 0 ? 'Select' : 'Full')}</span>
                <button class="RemoveButton" onclick={e => { e.stopPropagation(); removeCar(ride.item?.id ?? null, trip.collection, ride); }}>X</button>
                <div class="info-box" hidden={infoId !== id} onclick={e => e.stopPropagation()}>
                    <span><b>Type:</b> {vehicle_type} - {seats} seats</span>
                    <b>Driver:</b>
                    <ul>
                        {#each drivers as driver}
                            {@const { firstname, lastname, email_address, phone_number } = driver.item || {}}
                            <li>{firstname} {lastname} (<a href="mailto:{email_address}">{email_address}</a> | <a href="tel:{phone_number}">{phone_number}</a>)</li>
                        {/each}
                        {#if drivers.length === 0}
                            <li>Driver unknown or not on team</li>
                        {/if}
                    </ul>
                    <b>Riders ({#if RideId === id}*{/if}{remaining}/{seats}):</b>
                        <ul>
                            {#each riders as rider}
                                {@const { firstname, lastname, email_address, phone_number } = rider.item || {}}
                                <li>{firstname} {lastname}</li>
                            {/each}
                            {#if riders.length === 0}
                                <li>No riders yet</li>
                            {/if}
                            {#if RideId === id}
                                <li><i>+ (You)</i></li>
                            {/if}
                        </ul>
                </div>
	        </div>

            
        {/each}
        {/if}

        <div class="add-button-container">
            {#if (cars.userCanHaveCar) || isAdmin}
                <button class="AddButton" onclick={() => SetActiveCarEditor(activeCarEditor && activeCarEditor === trip.id ? null : trip.id)}>Add or Remove Rides</button>
            {/if}
            {#if cars.userCanHaveCar} <!-- Able to have car -->
                <div class="add-ride-menu" hidden={!activeCarEditor || activeCarEditor !== trip.id}>
                    <p>Your Cars:</p>
                    {#each cars.userOwnedCars as car}
                        <button class="add-ride-option" onclick={() => addCarIfNotPresent(rides, car.id)} data-selected={rides?.some(ride => ride.item.ride.id === car.id)}>
                            <span>{car.name} ({car.vehicle_type} - {car.seats} seats)</span>
                            {#if (car.driver?.length ?? 0) > 1}
                                <span>Also driven by {car.driver?.filter(driver => driver.id !== userId?.toString()).map(driver => driver.item ? `${driver.item.firstname} ${driver.item.lastname}` : 'unknown').join(', ')}</span>
                            {/if}
                        </button>
                    {/each}
                    {#if cars.userOwnedCars.length === 0}
                        <i>You have no cars.</i>
                    {/if}
                </div>
            {/if}
            {#if isAdmin}
                <div class="add-ride-menu" hidden={!activeCarEditor || activeCarEditor !== trip.id}>
                    <p>All Cars:</p>
                    <input class="add-ride-search" placeholder="Filter rides..." bind:value={filter}/>
                    {#each cars.allCars as car}
                        <!-- {@const {id, item} = car} -->
                        {@const driver = car.driver?.map(driver => driver.item ? `${driver.item.firstname} ${driver.item.lastname}` : `unknown[id:${driver.id}]`).join(', ')}
                        <button hidden={!search(filter, car.name, car.vehicle_type, driver)} class="add-ride-option" onclick={() => addCarIfNotPresent(rides, car.id)} data-selected={rides?.some(ride => ride.item?.ride.id === car.id)}>
                            <span>{car.name} ({car.vehicle_type} - {car.seats} seats)</span>
                            {#if driver}
                                <span>Driven by {driver}</span>
                            {/if}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
        
    {:else}
        <p>Opt out of this trip</p>
    {/if}
</div>
<style>

    .deleteButton {
        right: 70px;
        top: 10px;
        position: absolute;
        border: 1px solid rgb(111, 0, 0); 
    height: 30px; 
    border-radius: 5px; 
    margin-bottom: 10px; 
    background-color: rgba(95, 0, 0, 0.2);    
    line-height: 30px; 
    text-align: center; 
    font-size: 15px;
    color: rgb(111, 0, 0);
    cursor: pointer;
    padding: 0 10px;
    }
    .AddButton {
    border: 1px solid rgb(100,100,100); 
    height: 30px; 
    border-radius: 5px; 
    margin-bottom: 10px; 
    background-color: rgb(235, 235, 235);
    /* line-height: 30px;  */
    text-align: center; 
    /* font-size: 30px;  */
    /* color: rgb(130,130,130); */
    font-weight: 600; 
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 10px;
    width: fit-content;
  }
  .RemoveButton {
    /* position: absolute;
    right: -30px;
    top: calc(50% - 7.5px); */
    height: 30px;
    margin: 0 0 0 10px;
    padding: 0 5px;
  }

  .editButton {
    right: 10px;
    top: 10px;
    position: absolute;
    border: 1px solid rgb(100,100,100); 
    width: 50px;
    height: 30px; 
    border-radius: 5px; 
    margin-bottom: 10px; 
    background-color: rgb(235, 235, 235);
    line-height: 30px; 
    text-align: center; 
    font-size: 15px;
    color: rgb(130,130,130);
    cursor: pointer;
  }

  .editButton:hover {
    background-color: rgb(225, 225, 225);
  }
    div:not([hidden]) {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 10px;
        background-color: #f9f9f9;
        display: flex;
        flex-wrap: wrap;
    }
    span {
        flex: 0 0 50%;
    }

    div.add-button-container {
        border: none;
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 0;
        margin: 0;
    }
    .add-button-container > * {
        padding: 5px;
        margin: 0;
    }
    div.add-ride-menu:not([hidden]) {
        margin: 5px 0 0;
        padding: 5px;
        border-radius: 0;
        display: flex;
        flex-direction: column;
    }
    .add-ride-menu > p {
        margin: 0;
    }
    .add-ride-search {
        width: 100%;
        margin-bottom: 5px;
    }
    .add-ride-option:not([hidden]) {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 0;
        border-radius: 0;
        width: 100%;
        border: 1px solid #cfcfcf;
        background-color: transparent;
        text-align: left;
    }
    .add-ride-option[data-selected=true] {
        background-color: #5fcf5f;
    }
    .add-ride-option > * {
        /* max-width: 50%; */
    }

    div.info-button {
        padding: 0 5px;
        margin-bottom: 0;
        margin-right: 10px;
        align-self: center;
        cursor: pointer; /* Even when ride option is disabled */
    }
    .info-button:has(~ .info-box:not([hidden])) {
        /* font-weight: bold; */
        color: white;
        background-color: #3375a6;
    }

    div.info-box {
        width: 100%;
        display: flex;
        margin-bottom: 0;
        flex-direction: column;
        cursor: initial;
        border-radius: 0;
        padding: 5px;
        margin-top: 5px;
    }
    .info-box div {
        border: none;
        padding: 0;
        margin: 0;
    }
    .info-box ul {
        list-style-type: none;
        padding-left: 10px;
        margin: 0;
    }
    .info-box[hidden] {
        display: none;
    }
</style>