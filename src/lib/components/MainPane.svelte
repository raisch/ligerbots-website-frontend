<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<div class="row page-body home-page-body" id="main-pane">
  <div class="col-md-12 col-md-offset-0 col-sm-10 col-sm-offset-1 col-xs-12">
    <div class="row top-spacer"> </div>
    {@render children?.()}
  </div>
</div>