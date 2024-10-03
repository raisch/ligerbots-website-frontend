<script>
  import { Icon } from 'svelte-icons-pack'
  import { FiLogOut } from 'svelte-icons-pack/fi'

  FiLogOut.a = { ...FiLogOut.a, 'stroke-width': 4 }
</script>

<Icon src={FiLogOut} size="1em" />
