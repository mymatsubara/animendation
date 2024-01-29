<script lang="ts">
	import GoToTopButton from '$lib/components/buttons/GoToTopButton.svelte';
	import Feed from '$lib/components/feed/Feed.svelte';
	import UserSuggestions from '$lib/components/feed/UserSuggestions.svelte';
	import UserIcon from '$lib/components/icons/UserIcon.svelte';
	import Tabs from '$lib/components/tabs/Tabs.svelte';
	import { Button } from 'flowbite-svelte';
	import { currentHomeTab, homeTabs } from './current-tab';

	let scrollY: number;
	const tab = currentHomeTab();
</script>

<svelte:window bind:scrollY />

<div class="bg-primary-900 sm:bg-transparent">
	<div class="px-3 max-w-xl mx-auto">
		<Tabs
			class="sm:text-gray-600"
			selectedClass="sm:text-gray-800"
			underlineClass="sm:bg-gray-800"
			bind:selected={$tab}
			tabs={homeTabs}
		/>
	</div>
</div>

<div class="px-3 max-w-xl mx-auto mt-5">
	{#if $tab === 'Animes'}
		<Feed type="anime">
			<svelte:fragment slot="no-recommendations">
				<Button
					class="mt-2 flex gap-1"
					on:click={() => {
						$tab = 'Suggestions';
					}}
					label=""
					><UserIcon stroke-width="2.0" class="h-5 mr-1" /><span class="whitespace-nowrap"
						>Find people to follow</span
					></Button
				>
			</svelte:fragment>
		</Feed>
	{:else if $tab === 'Mangas'}
		<Feed type="manga">
			<svelte:fragment slot="no-recommendations">
				<Button
					class="mt-2 flex gap-1"
					on:click={() => {
						$tab = 'Suggestions';
					}}
					label=""
					><UserIcon stroke-width="2.0" class="h-5 mr-1" /><span class="whitespace-nowrap"
						>Find people to follow</span
					></Button
				>
			</svelte:fragment>
		</Feed>
	{:else if $tab === 'Suggestions'}
		<UserSuggestions />
	{/if}
</div>

{#if scrollY > 300}
	<GoToTopButton />
{/if}
