<script>
    /** 
     * @type {{ 
     *   trip: import('$lib/server/trip').Trip,
     *   RideId: number | null,
     *   SetId: (rideId: number | null) => void
     *  previousDestinationRideId: number | null,
     *  previousReturnRideId: number | null,
     *  isAdmin: boolean,
     *  modifying: Record<string, any> | null
     * }} 
     */
    let { trip, RideId, SetId, previousDestinationRideId, previousReturnRideId, isAdmin, modifying } = $props();
</script>
<div>
    {#if trip}
        {@const {item} = trip}
        {@const rides = trip.item.rides}
        <span style="flex-basis: 100%;">
            <span>From {item.departs_from} to {item.destination}</span>
            <span>From {item.departs_from} to {item.destination}</span>
        </span>
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