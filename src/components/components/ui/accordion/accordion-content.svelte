<script>
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import { fade } from "svelte/transition";
	import { cn } from "$components/lib/utils.js";
	let className = undefined;
	export let transition = fade;
	export let transitionConfig = {
		duration: 100,
	};
	export { className as class };
</script>

<AccordionPrimitive.Content
	class={cn("overflow-hidden text-sm transition-all", className)}
	{transition}
	{transitionConfig}
	{...$$restProps}
>
	<div class="pb-4 pt-0">
		<slot />
	</div>
</AccordionPrimitive.Content>
