<script lang="ts">
	import FollowButton from '$lib/components/buttons/FollowButton.svelte';
	import UserSignature from '$lib/components/users/UserSignature.svelte';
	import { trpc } from '$lib/trpc/client';
	import type { inferAsyncReturnType } from '@trpc/server';
	import { Spinner } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

	type RecommendedUser = inferAsyncReturnType<
		typeof trpc.user.randomWithRecommendation.query
	>[number];

	let users: RecommendedUser[];
	trpc.user.randomWithRecommendation.query({ limit: 10 }).then((result) => {
		users = result;
	});
</script>

<h2 class="text-xl tracking-tight font-medium">Suggestions</h2>
<div class="text-sm text-gray-600">Users to follow to get recommendations</div>

<div class="mt-3 w-full">
	{#if !users}
		<div class="flex justify-center">
			<Spinner class="mt-5" />
		</div>
	{:else if users.length === 0}
		<div in:fade={{ duration: 150 }} class="mt-10 flex flex-col items-center justify-center gap-2">
			<div class="font-bold text-3xl">(╥_╥)</div>
			<div class="text-gray-600">No suggested users yet</div>
		</div>
	{:else}
		{#each users as user, i (user.id)}
			<div class="py-4">
				<UserSignature size="md" username={user.name}>
					<svelte:fragment slot="side-signature">
						<div class="grow" />
						<FollowButton class="mt-0.5" size="sm" imFollowing={false} username={user.name} />
					</svelte:fragment>
				</UserSignature>
			</div>
			<hr />
		{/each}
	{/if}
</div>
