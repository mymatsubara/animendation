<script lang="ts" generics="T">
	import TabItem from '$lib/components/tabs/TabItem.svelte';

	export let tabs: T[];
	export let selected: T = tabs[0];
</script>

<fieldset class="flex" on:change>
	{#each tabs as name}
		<TabItem {name} bind:group={selected} />
	{/each}
</fieldset>
