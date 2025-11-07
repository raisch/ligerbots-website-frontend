<script>
    /** 
     * @type {{ 
     *   trip: import('$lib/server/trip').Trip,
     *   RideId: number | null,
     *   SetId: (rideId: number | null) => void
     * }} 
     */
    let { trip, RideId, SetId} = $props();
</script>
<div>
    {#if trip}
        {@const {item} = trip}
        {@const rides = trip.item.rides}
        <span style="flex-basis: 100%;">From {item.departs_from} to {item.destination}</span>
        <span style="flex-basis: 100%;">Date: {item.departs_on}</span>
        <span>Departs at {item.departs_at}</span>
        <span>Arrives at {item.arrives_at}</span>
        {#each rides as ride}
	        {@const { item } = ride}
	        {@const driver = item.ride.name}
	        {@const { seats } = item.ride}
	        {@const remaining = seats - item.riders_func.count}
	        {@const seatDisplay = remaining > 0 ? `${remaining}/${seats} Seats Remaining` : 'Full'}
            {@const id = parseInt(item.id)}

	        <div 
                style="flex-basis: 100%; display: flex; align-items: center; width: 100%; cursor: {remaining > 0 ? 'pointer' : 'not-allowed'}; {RideId === id ? 'outline: 2px solid #3375a6;' : ''}"
                onclick={() => {
                        if (remaining <= 0) return; // User cannot select a full ride
                        SetId(id)
                }}>
		        <span style="flex: 1; text-align: left;">{driver} – {seatDisplay}</span>
		        <span
                style="flex: 0 0 1rem; text-align: right; background-color: {remaining > 0 ? '#3375a6' : '#808080'}; border-radius: 5px; padding: 3px 5px; color: white;"
                >{remaining > 0 ? (RideId === id ? 'Selected' : 'Select') : 'Full'}</span>
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