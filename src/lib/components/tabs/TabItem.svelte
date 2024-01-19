<script lang="ts" generics="T">
	import { twMerge } from 'tailwind-merge';

	export let name: T;
	export let group: T;
	export let selectedClass: string;
	export let underline: boolean = false;
	export let underlineClass: string | undefined = undefined;

	$: selected = name === group;
</script>

<div class="relative">
	<label
		class={twMerge(
			'relative font-medium text-primary-200 px-5 pb-2 pt-3 m-0 cursor-pointer',
			$$restProps.class,
			selected ? selectedClass : ''
		)}
	>
		{name}
		<input
			name={`${name}`}
			class="absolute inset-0 opacity-0"
			type="radio"
			value={name}
			bind:group
		/>
	</label>

	{#if underline && selected}
		<div
			class={twMerge(
				'absolute bottom-0.5 -translate-x-1/2 left-1/2 h-0.5 w-8 rounded-full bg-primary-50',
				underlineClass
			)}
		/>
	{/if}
</div>
