<script lang="ts">
	import { Badge } from 'flowbite-svelte';

	type T = $$Generic<{ value: string; label?: string }>;
	export let options: T[];
	export let values: Set<string> | undefined = undefined;

	$: values = values ?? new Set();
</script>

<div class="flex gap-1.5 flex-wrap">
	{#each options as option, i (option.value)}
		{@const checked = values?.has(option.value)}
		<button
			class="cursor-pointer"
			on:click={() => {
				const value = option.value;
				if (values?.has(value)) {
					values?.delete(value);
				} else {
					values?.add(value);
				}

				values = values;
			}}
		>
			<slot {option} {checked}>
				<Badge rounded class={checked ? 'outline outline-2 outline-primary-600' : ''}>
					<span class="unselectable">{option.label ?? option.value}</span>
				</Badge>
			</slot>
		</button>
	{/each}
</div>
