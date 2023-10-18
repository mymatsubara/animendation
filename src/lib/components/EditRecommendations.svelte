<script lang="ts">
	import { getAnimes } from '$lib/client/animes';
	import { getAnimelist } from '$lib/stores/animelist';
	import { getMyRecommendations } from '$lib/stores/my-recommendations';

	export let username: string;

	// Fetch user recomendations from trpc
	$: animelist = getAnimelist(username);
	$: animeslistIds = $animelist ? (Object.keys($animelist) as any[]) : [];
	const recommendations = getMyRecommendations();
</script>

Animes

{#await getAnimes(animeslistIds)}
	Loading...
{:then animes}
	{#each Object.values(animes) as anime (anime.id)}
		{@const isRecommended = $recommendations.has(anime.id)}
		<button
			on:click={() =>
				isRecommended ? recommendations.remove(anime.id) : recommendations.add(anime.id)}
		>
			<img src={anime.pictureMedium} alt="{anime.title} picture" />
		</button>
		<div>
			{anime.title} ({isRecommended ? 'Recommended' : 'Not recommended'})
		</div>
		<div>{anime.mediaType}</div>
		<div>{anime.nsfw}</div>
		<div>{anime.seasonYear} - {anime.season}</div>
		<div>{anime.genres}</div>
	{/each}
{/await}
