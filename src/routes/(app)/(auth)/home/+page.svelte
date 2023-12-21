<script lang="ts">
	import Tabs from '$lib/components/tabs/Tabs.svelte';
	import UserSignature from '$lib/components/users/UserSignature.svelte';
	import { Button, ButtonGroup, RadioButton } from 'flowbite-svelte';
	import { feedType } from './feed-type';

	const tabs = ['Feed', 'Suggestion'] as const;

	let tab = tabs[0];
	const feed = feedType();
</script>

<div class="px-3 max-w-xl mx-auto mt-1">
	<div class="mb-5">
		<Tabs
			class="text-base font-medium text-gray-500 py-3 text-center w-full px-1"
			selectedClass="text-primary-800 font-semibold"
			fieldsetClass="grid grid-cols-3"
			bind:selected={tab}
			{tabs}
			underline
		/>
	</div>

	{#if tab === 'Feed'}
		<div class="my-6">
			<UserSignature contentClass="w-full" size="lg" username="XDmuriloXD">
				<Button outline class="mt-2 bg-primary-800 text-primary-50 hover:bg-primary-900" size="sm"
					>Recommend</Button
				>
			</UserSignature>
		</div>
		<hr class="border my-3" />

		<div class="flex justify-center mb-4">
			<ButtonGroup>
				<RadioButton class="mb-0" value="anime" bind:group={$feed}>Animes</RadioButton>
				<RadioButton class="mb-0" value="manga" bind:group={$feed}>Mangas</RadioButton>
			</ButtonGroup>
		</div>

		<div>
			<UserSignature username="XDmuriloXD">
				<div class="text-sm font-medium text-gray-600 ml-2" slot="side-signature">2h</div>
			</UserSignature>
		</div>
	{:else if tab === 'Suggestion'}
		Suggestion
	{/if}
</div>
