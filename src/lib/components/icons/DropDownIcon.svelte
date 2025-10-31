<script>
  import { Icon } from 'svelte-icons-pack'
  import { TrFillCaretDown } from 'svelte-icons-pack/tr'

  // FiLogIn.a = { ...FiLogIn.a, 'stroke-width': 4 }
</script>

<!-- Why do I need this text-0? I have absolutely no clue. ¯\_(ツ)_/¯ -->
<div class="text-0">
  <Icon src={TrFillCaretDown} className="size-[20px]" />
</div>
