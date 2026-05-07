<script lang="ts">
  import RiderList from "$lib/components/RiderList.svelte";
  import type { EventCarpoolOptOut, EventType } from "$lib/server/event";
  import { onMount } from "svelte";

  let { data }: { data: { event: EventType, optout: EventCarpoolOptOut } } = $props();

  let hideContactInfo = $state('none');

  onMount(() => {
    let params = new URLSearchParams(location.search);
    if (params.has('hide-contact')) hideContactInfo = params.get('hide-contact') || 'none';
  });
</script>

<div class="rider-list-container" data-hide-contact={hideContactInfo}>
  <RiderList {...data} />
</div>

<style>

  :global {
    .rider-list {
      line-height: 1.33333em;
    }

    p, li {
      font-size: 14px;
    }
    
    [data-hide-contact=email] .contact-email {
      display: none;
    }
    [data-hide-contact=all] .contact-info {
      display: none;
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

      .contact-info a[href]::after {
        content: "";
      }
    }
  }
</style>