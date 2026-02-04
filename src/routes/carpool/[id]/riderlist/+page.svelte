<script lang="ts">
  import RiderList from "$lib/components/RiderList.svelte";
  import type { TripType } from "$lib/server/trip";

  let { data }: { data: { trips: TripType[] } } = $props();
  let { trips } = $derived(data);
</script>

<RiderList {trips} />