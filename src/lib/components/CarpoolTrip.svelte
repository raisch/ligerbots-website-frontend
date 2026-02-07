<script>


    /** 
     * @type {{ 
     *   trip: import('$lib/server/trip').TripType,
     *   RideId: number | null,
     *   SetId: (rideId: number | null) => void,
     *   previousDestinationRideId: number | null,
     *   previousReturnRideId: number | null,
     *   isAdmin: boolean,
     *   modifying: Record<string, any> | null,
     *   SetModifying: (subject: Record<string, any> | null, mode: string) => void
     * }} 
     */
    let { trip, RideId, SetId, previousDestinationRideId, previousReturnRideId, isAdmin, modifying, SetModifying } = $props();

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
     * @param {number} id - The ID of the trip to delete.
     * @param {string} collection - The collection the trip belongs to.
     */
    function deleteTrip(id, collection) {
        const url = collection ? `/api/carpool/trip/${id}?collection=${encodeURIComponent(collection)}` : `/api/carpool/trip/${id}`
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
    $inspect(infoId);

    /**
   * @param {number} id
   */
    function selectInfoBox(id) {
        return (/** @type {Event} */ event) => {
            event.stopPropagation();
            infoId = infoId === id ? -1 : id;
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
                    deleteTrip(parseInt(item.id), trip.collection);
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
            {@const id = parseInt(item.id)}
            {@const { riders, ride: { seats, driver: drivers, name: driverName } } = ride.item}
	        {@const remaining = seats - item.riders_func.count - (RideId === id ? 1 : 0) + (previousDestinationRideId === id || previousReturnRideId === id ? 1 : 0)}
	        {@const seatDisplay = remaining > 0 ? `${remaining}/${seats} Seats Remaining` : 'Full'}
            
            {@const { driver: {} } = item.ride}

	        <div 
                style="flex-basis: 100%; display: flex; align-items: center; width: 100%; cursor: {remaining > 0 || RideId === id ? 'pointer' : 'not-allowed'}; {RideId === id ? 'outline: 2px solid #3375a6;     background-color: #3375a61f;' : ''}"
                onclick={() => {
                        if (remaining <= 0 || RideId === id) return; // User cannot select a full ride, user cannot re-select the same ride
                        SetId(id)
                }}>
		        <span style="flex: 1; text-align: left;">{driverName} – {#if RideId === id}*{/if}{remaining}/{seats}</span>
                <div class="info-button" onclick={selectInfoBox(id)}>info</div>
		        <span
                style="flex: 0 0 1rem; text-align: right; background-color: {remaining > 0 || RideId === id ? '#3375a6' : '#808080'}; border-radius: 5px; padding: 3px 5px; color: white;"
                >{RideId === id ? "Selected" : (remaining > 0 ? 'Select' : 'Full')}</span>
                <div class="info-box" hidden={infoId !== id} onclick={e => e.stopPropagation()}>
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
    height: 60px; 
    border-radius: 5px; 
    margin-bottom: 10px; 
    background-color: rgb(235, 235, 235);
    line-height: 60px; 
    text-align: center; 
    font-size: 30px; 
    color: rgb(130,130,130);
    font-weight: 600; 
    cursor: pointer;
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
    div {
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

    .info-button {
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

    .info-box {
        width: 100%;
        display: flex;
        margin-bottom: 0;
        flex-direction: column;
        cursor: initial;
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