<script>

    /** 
     * @type {{ 
     *   trip: import('$lib/server/trip').Trip,
     *   RideId: number | null,
     *   SetId: (rideId: number | null) => void,
     *   previousDestinationRideId: number | null,
     *   previousReturnRideId: number | null,
     *   isAdmin: boolean,
     *   modifying: Record<string, any> | null,
     *   SetModifying: (subject: Record<string, any> | null) => void
     * }} 
     */
    let { trip, RideId, SetId, previousDestinationRideId, previousReturnRideId, isAdmin, modifying, SetModifying } = $props();

    /**
     * Set the current modifying subject if none is set.
     * @param {Record<string, any> | null} newSubject
     * @returns {void}
     */
    function setSubject(newSubject) {
        // notify parent to set the modifying subject rather than mutating the prop locally
        if (typeof SetModifying === 'function') {
            SetModifying(newSubject)
        }
    }
</script>
<div style="position: relative;">
    {#if trip}
        {@const {item} = trip}
        {@const rides = trip.item.rides}
        <span style="flex-basis: 100%;">From {item.departs_from} to {item.destination}</span>
        {#if isAdmin}
            <span class="editButton" onclick={() => setSubject(trip)}>Edit</span>
        {/if}
        
        <span style="flex-basis: 100%;">Date: {item.departs_on}</span>
        <span>Departs at {item.departs_at}</span>
        <span>Arrives at {item.arrives_at}</span>
        {#each rides as ride}
            {@const { item } = ride}
            {@const id = parseInt(item.id)}
	        {@const driver = item.ride.name}
	        {@const { seats } = item.ride}
	        {@const remaining = seats - item.riders_func.count - (RideId === id ? 1 : 0) + (previousDestinationRideId === id || previousReturnRideId === id ? 1 : 0)}
	        {@const seatDisplay = remaining > 0 ? `${remaining}/${seats} Seats Remaining` : 'Full'}
            

	        <div 
                style="flex-basis: 100%; display: flex; align-items: center; width: 100%; cursor: {remaining > 0 || RideId === id ? 'pointer' : 'not-allowed'}; {RideId === id ? 'outline: 2px solid #3375a6;' : ''}"
                onclick={() => {
                        if (remaining <= 0 || RideId === id) return; // User cannot select a full ride, user cannot re-select the same ride
                        SetId(id)
                }}>
		        <span style="flex: 1; text-align: left;">{driver} – {remaining}/{seats}</span>
		        <span
                style="flex: 0 0 1rem; text-align: right; background-color: {remaining > 0 || RideId === id ? '#3375a6' : '#808080'}; border-radius: 5px; padding: 3px 5px; color: white;"
                >{RideId === id ? "Selected" : (remaining > 0 ? 'Select' : 'Full')}</span>
	        </div>
        {/each}


        
    {:else}
        <p>Opt out of this trip</p>
    {/if}
</div>
<style>
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
</style>