<script lang="ts" generics="T">
	import { twMerge } from 'tailwind-merge';

	import TabItem from '$lib/components/tabs/TabItem.svelte';

	export let tabs: readonly T[];
	export let selected: T = tabs[0];
	export let fieldsetClass: string = '';
	export let selectedClass: string = 'text-primary-50 border-b-2 border-primary-50';
	export let underline = false;
	export let underlineClass: string | undefined = undefined;
</script>

<title>Animendation - Home</title>

<fieldset class={twMerge('flex', fieldsetClass)} on:change>
	{#each tabs as name}
		<TabItem
			class={$$restProps.class}
			{selectedClass}
			{name}
			bind:group={selected}
			{underline}
			{underlineClass}
		/>
	{/each}
</fieldset>
