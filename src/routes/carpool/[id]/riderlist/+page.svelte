<script lang="ts">
  import RiderList from "$lib/components/RiderList.svelte";
  import type { TripType } from "$lib/server/trip";
  import { onMount } from "svelte";

  let { data }: { data: { trips: TripType[] } } = $props();
  let { trips } = $derived(data);

  let printMode = $state(false);

  onMount(() => {
    let params = new URLSearchParams(location.search);
    if (params.has('print')) printMode = true;
  });
</script>

<RiderList {trips} {printMode} />

<style>

  :global {
    .rider-list {
      line-height: 1.33333em;
    }

    p, li {
      font-size: 14px;
    }

    @media print {
      /* Hide layout */
      body {
        background: none;
      }
      #header-ghost, #masthead, nav, #myFooter {
        display: none;
      }
      #page-container {
        margin: 0;
        width: 100%;
        max-width: none;
      }
      #main-pane {
        background: none;
      }

      /*  */

      .contact-email {
        display: none;
      }
      .contact-info a[href]::after {
        content: "";
      }
    }
  }
</style>