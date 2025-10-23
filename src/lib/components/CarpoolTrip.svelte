<script>
    export let optout = false;

    /** @type {import('$lib/server/trip').Trip} */
    export let trip;
</script>
<div>
    {#if trip}
        {@const {item} = trip}
        <span style="flex-basis: 100%;">From {item.departs_from} to {item.destination}</span>
        <span style="flex-basis: 100%;">Date: {item.departs_on}</span>
        <span>Departs at {item.departs_at}</span>
        <span>Arrives at {item.arrives_at}</span>
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