<script lang="ts">
	import { Badge } from 'flowbite-svelte';

	type T = $$Generic<{ value: string; name?: string }>;
	export let items: T[];
	export let values: string[] = [];
	export let clearable = true;
	let valuesSet = new Set(values);
	let status = items.map((item) => valuesSet.has(item.value));

	$: values = status
		.map((checked, i) => (checked ? i : null))
		.filter((i) => i !== null)
		.map((i) => items[i as number].value);

	function clear() {
		status = items.map(() => false);
	}
</script>

<div class="flex gap-1.5 flex-wrap">
	{#each items as item, i (item.value)}
		{@const checked = status[i]}
		<label class="label-focus">
			<div class="w-0 overflow-hidden h-0">
				<input
					class="peer w-0 h-0 overflow-hidden opacity-0"
					type="checkbox"
					bind:checked={status[i]}
				/>
			</div>
			{#if $$slots.default}
				<slot {item} {checked} />
			{:else}
				<Badge
					class="cursor-pointer border-2 border-transparent {checked ? 'border-primary-700' : ''}"
					rounded
				>
					<span class="unselectable">{item.name ?? item.value}</span>
				</Badge>
			{/if}
		</label>
	{/each}
</div>

<style lang="postcss">
	.label-focus:has(input[type='checkbox']:focus) {
		@apply scale-105;
	}
</style>
