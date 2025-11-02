<script>
    export let optout = false;

    /** @type {import('$lib/server/trip').Trip} */
    export let trip;

    console.log(trip);

    //@ts-ignore
    export let rides = trip.item.rides

    
</script>
<div>
    {#if trip}
        {@const {item} = trip}
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

	        <div style="flex-basis: 100%; display: flex; align-items: center; width: 100%;">
		        <span style="flex: 1; text-align: left;">{driver} – {seatDisplay}</span>
		        <span style="flex: 0 0 1rem; text-align: right;">select</span>
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