<script lang="ts">
  import OptOutList from "$lib/components/OptOutList.svelte";
  import UserList from "$lib/components/UserList.svelte";
  import type { EventType } from "$lib/server/event";
  import { onMount } from "svelte";

  let { data }: { data: { event: EventType } } = $props();
  let { event } = $derived(data);

  let hideContactInfo = $state('none');

  onMount(() => {
    let params = new URLSearchParams(location.search);
    if (params.has('hide-contact')) hideContactInfo = params.get('hide-contact') || 'none';
  });
</script>

<div class="attendee-list-container" data-hide-contact={hideContactInfo}>
  <UserList users={event.attendees?.map(attendee => attendee.users_id) ?? []} />
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