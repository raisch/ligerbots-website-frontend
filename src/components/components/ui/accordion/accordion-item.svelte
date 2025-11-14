<script>
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import { cn } from "$components/lib/utils.js";
	let className = undefined;
	export let value;
	export { className as class };
</script>

<AccordionPrimitive.Item {value} class={cn(className)} {...$$restProps}>
	<slot />
</AccordionPrimitive.Item>
