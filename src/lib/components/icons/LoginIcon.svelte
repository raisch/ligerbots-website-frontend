<script>
  import { Icon } from 'svelte-icons-pack'
  import { FiLogIn } from 'svelte-icons-pack/fi'

  FiLogIn.a = { ...FiLogIn.a, 'stroke-width': 4 }
</script>

<Icon src={FiLogIn} size="1em" />
