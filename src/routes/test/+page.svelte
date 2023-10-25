<script lang="ts">
	import Autocomplete from '$lib/components/forms/Autocomplete.svelte';
	import {
		autoUpdate,
		computePosition,
		flip,
		offset,
		type ReferenceElement
	} from '@floating-ui/dom';
	let input: HTMLElement;
	let tooltip: HTMLElement;

	function updatePosition() {
		computePosition(input as ReferenceElement, tooltip, {
			placement: 'top',
			middleware: [offset(6), flip()]
		}).then(({ x, y }) => {
			Object.assign(tooltip.style, {
				left: `${x}px`,
				top: `${y}px`
			});
		});
	}

	let cleanup: () => void;

	function showTooltip() {
		tooltip.style.display = 'block';
		cleanup = autoUpdate(input, tooltip, updatePosition);
	}

	function hideTooltip() {
		tooltip.style.display = 'none';
		cleanup?.();
	}
</script>

<div class="h-16" />
<Autocomplete
	placeholder="Genre"
	options={new Array(100).fill(0).map((_, i) => ({ value: `Genre ${i}` }))}
/>
<select>
	<option>Test1</option>
	<option>Test2</option>
	<option>Test3</option>
	<option>Test4</option>
	<option>Test5</option>
</select>
<div class="h-[1000px]" />
