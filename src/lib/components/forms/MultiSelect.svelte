<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	import { MultiSelect } from 'flowbite-svelte';

	type K = $$Generic;
	type T = $$Generic<{ value: K; name: number | string }>;
	export let items: T[];
	export let value: (string | number)[] | undefined = [];
	export let placeholder: string = '';

	$: empty = !!value?.length;
</script>

<div class="relative w-full">
	{#if $$slots.default}
		<MultiSelect
			class={twMerge('min-h-[41px]', $$restProps.class)}
			{items}
			bind:value
			let:item
			let:clear
		>
			<slot {item} {clear} />
		</MultiSelect>
	{:else}
		<MultiSelect class={twMerge('min-h-[41px]', $$restProps.class)} {items} bind:value />
	{/if}

	{#if !value?.length}
		<div class="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500">{placeholder}</div>
	{/if}
</div>
