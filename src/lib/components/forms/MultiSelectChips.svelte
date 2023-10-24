<script lang="ts">
	import { Badge } from 'flowbite-svelte';

	type T = $$Generic<{ value: string; name?: string }>;
	export let items: T[];
	export let values: string[] = [];
	let valuesSet = new Set(values);
	let status = items.map((item) => valuesSet.has(item.value));

	$: values = status
		.map((checked, i) => (checked ? i : null))
		.filter((i) => i !== null)
		.map((i) => items[i as number].value);

	$: {
		if (!values?.length) {
			clear();
		}
	}

	function clear() {
		status = items.map(() => false);
	}
</script>

<div class="flex gap-1.5 flex-wrap">
	{#each items as item, i (item.value)}
		{@const checked = status[i]}
		<label>
			<input class="peer hidden" type="checkbox" bind:checked={status[i]} />
			{#if $$slots.default}
				<slot {item} {checked} />
			{:else}
				<Badge class="cursor-pointer border-2 border-transparent peer-border-primary-700" rounded>
					<span class="unselectable">{item.name ?? item.value}</span>
				</Badge>
			{/if}
		</label>
	{/each}
</div>
