<script lang="ts">
  import type { EventUserRecord } from "$lib/server/event";

  let { user, driver = false }: { user: EventUserRecord, driver?: boolean } = $props();

  // svelte-ignore state_referenced_locally
  const {firstname = "null", lastname = "", email_address = "", phone_number = ""} = user || {}
</script>


<!-- TODO add more specific information -->
<li>{#if driver}<i>Driver:</i>{/if}
  {firstname} {lastname}
  <span class="contact-info">
    (<span class="contact-email"><a href="mailto:{email_address}">{email_address}</a>&nbsp;|&nbsp;</span><a href="tel:{phone_number}">{phone_number}</a>)
  </span>
</li>

<style>
  .contact-info {
    white-space: nowrap;
  }
</style>