<script lang="ts">
	import { onVisible } from '$lib/actions/on-visible';
	import AnimeDisplay from '$lib/components/AnimeDisplay.svelte';
	import UserPortrait from '$lib/components/feed/UserPortrait.svelte';
	import UserSignature from '$lib/components/users/UserSignature.svelte';
	import { getMyanimelist } from '$lib/stores/animelist';
	import { toast } from '$lib/stores/toast';
	import { user } from '$lib/stores/user';
	import { trpc } from '$lib/trpc/client';
	import { getMyanimelistSeriesUrl } from '$lib/utils/myanimelist';
	import { formatPostDate, formatTimeElapsed } from '$lib/utils/time';
	import type { inferAsyncReturnType } from '@trpc/server';
	import { Spinner } from 'flowbite-svelte';

	type FeedPage = inferAsyncReturnType<typeof trpc.anime.feed.query>;
	type FeedEntry = FeedPage['data'][number];

	export let type: 'anime' | 'manga';

	let loading = false;
	let data: FeedPage;
	const limit = 10;
	let entries: FeedEntry[];

	$: username = $user?.username;
	$: entryType = type === 'anime' ? ('Anime' as const) : ('Manga' as const);

	const myanimelist = getMyanimelist();

	loadNextPage();

	async function loadNextPage() {
		loading = true;
		try {
			data =
				type === 'anime'
					? await trpc.anime.feed.query({ limit, nextPageToken: data?.nextPageToken })
					: await trpc.manga.feed.query({ limit, nextPageToken: data?.nextPageToken });

			entries = [...(entries ?? []), ...data.data];
		} catch (err) {
			$toast = {
				level: 'error',
				message: 'Error while loading feed. Please refresh the page.',
			};
		} finally {
			loading = false;
		}
	}
</script>

<div class="mt-5">
	<UserPortrait {type} username={username ?? ''} />
</div>

<hr class="border mt-5" />

<div class="mt-3 mb-2">
	{#if entries}
		<div>
			{#each entries as entry, i (entry.id)}
				<div class="py-3 {i !== entries.length - 1 ? 'border-b' : ''}">
					<UserSignature username={entry.username}>
						<svelte:fragment slot="side-signature">
							<div class="text-sm text-gray-500 ml-1 mt-[1.5px]">
								· <span title={formatPostDate(new Date(entry.createdAt))}
									>{formatTimeElapsed(new Date(entry.createdAt))}</span
								>
							</div>
						</svelte:fragment>

						<p class="text-sm mb-2">
							Recommended: <a
								class="font-semibold"
								title="MyAnimelist link"
								href={getMyanimelistSeriesUrl(entry.serieId, entryType)}
								target="_blank">{entry.title}</a
							>
						</p>
						<div class="max-w-[250px]">
							<AnimeDisplay
								title={entry.title}
								pictureUrl={entry.pictureLarge}
								statusHandler={{
									animelist: myanimelist,
									serieId: entry.serieId,
									type: entryType,
								}}
							/>
						</div>
					</UserSignature>
				</div>
			{/each}
		</div>
	{/if}
</div>

{#if data?.hasNextPage}
	<div
		class="py-3 flex justify-center"
		use:onVisible={{
			callback: (elements) => {
				const target = elements[0];
				target.isIntersecting && !loading && data.hasNextPage && loadNextPage();
			},
			options: {
				threshold: 0.1,
				rootMargin: '250px',
			},
		}}
	>
		<Spinner />
	</div>
{/if}
