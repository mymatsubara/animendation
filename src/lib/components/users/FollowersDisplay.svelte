<script lang="ts">
	import { onVisible } from '$lib/actions/on-visible';
	import Placeholder from '$lib/components/Placeholder.svelte';
	import ArrowTopRightIcon from '$lib/components/icons/ArrowTopRightIcon.svelte';
	import MyanimelistLogoIcon from '$lib/components/icons/MyanimelistLogoIcon.svelte';
	import ProfilePicture from '$lib/components/users/ProfilePicture.svelte';
	import { toast } from '$lib/stores/toast';
	import { trpc } from '$lib/trpc/client';
	import { titleCase } from '$lib/utils/string';
	import type { inferAsyncReturnType } from '@trpc/server';
	import { Card, Spinner } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

	type FollowersPage = inferAsyncReturnType<typeof trpc.user.followers.query>;
	type Follower = FollowersPage['data'][number];
	export let username: string;
	export let type: 'following' | 'followers' = 'followers';

	let loading = true;
	let curPage: FollowersPage;
	const limit = 18;

	let followers: Follower[];

	loadMoreFollowers();

	async function loadMoreFollowers() {
		loading = true;
		try {
			curPage =
				type === 'followers'
					? await trpc.user.followers.query({
							username,
							limit,
							nextPageToken: curPage?.nextPageToken,
					  })
					: await trpc.user.following.query({
							username,
							limit,
							nextPageToken: curPage?.nextPageToken,
					  });

			followers = [...(followers ?? []), ...curPage.data];
		} catch (e) {
			$toast = {
				level: 'error',
				message: `Could not fetch more ${type}`,
			};
		} finally {
			loading = false;
		}
	}
</script>

<div>
	<h1 class="text-xl tracking-tight font-medium pt-1 pb-3">{titleCase(type)}</h1>

	<div class="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 pb-4">
		{#if followers !== undefined}
			{#each followers as follower (follower.id)}
				{@const href = `/profile/${follower.name}`}

				<Card padding="sm">
					<div class="flex flex-col justify-center items-center">
						<a {href}>
							<ProfilePicture size="lg" pictureUrl={follower.picture ?? undefined} />
						</a>
						<a
							class="w-full text-center mt-1 whitespace-nowrap overflow-hidden overflow-ellipsis font-medium text-gray-700 hover:text-gray-900"
							title={follower.name}
							{href}>{follower.name}</a
						>
						<a
							class="flex gap-1 items-center py-1 text-primary-600 hover:text-primary-700"
							href="https://myanimelist.net/profile/{follower.name}"
							target="_blank"
							><MyanimelistLogoIcon class="h-3" /><ArrowTopRightIcon class="h-3 mb-[3px]" /></a
						>
					</div>
				</Card>
			{/each}
		{/if}

		{#if loading}
			{#each new Array(limit).fill(0) as _}
				<div class="p-4">
					<Placeholder class="rounded h-[115px] w-full" />
				</div>
			{/each}
		{/if}
	</div>

	{#if curPage?.hasNextPage}
		<div
			class="py-4 flex justify-center"
			use:onVisible={{
				callback: ([spinner]) => {
					if (spinner.isIntersecting && !loading && curPage.hasNextPage) {
						loadMoreFollowers();
					}
				},
				options: {
					threshold: 0.1,
					rootMargin: '150px',
				},
			}}
		>
			<Spinner />
		</div>
	{/if}

	{#if followers?.length === 0}
		<div in:fade={{ duration: 150 }} class="flex flex-col items-center justify-center gap-2">
			<div class="font-bold text-3xl">(╥_╥)</div>
			<div class="text-gray-600">No {type} yet.</div>
		</div>
	{/if}
</div>
