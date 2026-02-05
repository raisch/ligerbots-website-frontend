<script lang="ts">
  import type { UserType } from "$lib/server/user";

  let { rider, driver = false, printMode = false }: { rider: UserType, driver?: boolean, printMode?: boolean } = $props();

  // svelte-ignore state_referenced_locally
  const {item} = rider
  const {firstname = "null", lastname = "", email_address = "", phone_number = ""} = item || {}
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