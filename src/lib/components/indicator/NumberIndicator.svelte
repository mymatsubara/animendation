<script lang="ts">
	import { Indicator, type IndicatorPlacementType } from 'flowbite-svelte';
	import { twMerge } from 'tailwind-merge';

	export let placement: IndicatorPlacementType = undefined;
</script>

<Indicator class={twMerge('p-2', $$restProps.class)} color="blue" {placement} border size="lg"
	><span class="text-white text-xs font-bold"><slot /></span></Indicator
>
