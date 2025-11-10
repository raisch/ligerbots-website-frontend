<script>
  import { Icon } from 'svelte-icons-pack'
  import { BsList } from 'svelte-icons-pack/bs'

  export let size;
  export let border = true;
</script>

<Icon src={BsList} size={size} className={border ? "border-1 border-white" : ""} />
