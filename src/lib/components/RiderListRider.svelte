<script lang="ts">
  import type { UserType } from "$lib/server/user";

  let {rider, driver = false}: { rider: UserType, driver?: boolean } = $props();

  // svelte-ignore state_referenced_locally
  const {item} = rider
  const {firstname = "null", lastname = "", email_address = "", phone_number = ""} = item || {}
</script>


<!-- TODO add more specific information -->
<li>{#if driver}<b>Driver:</b>{/if}
  {firstname} {lastname} (<a href="mailto:{email_address}">{email_address}</a> | <a href="tel:{phone_number}">{phone_number}</a>)
</li>