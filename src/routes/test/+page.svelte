<script lang="ts">
	import MultiselectChips from '$lib/components/forms/MultiSelectChips.svelte';

	const items = [
		{
			value: 'watching',
			title: 'Watching',
			color: 'blue'
		},
		{
			value: 'plan_to_watch',
			title: 'Plan to watch',
			color: 'gray'
		}
	];

	let values: string[] = [];
</script>

<MultiselectChips bind:values {items} let:item />

{values}
