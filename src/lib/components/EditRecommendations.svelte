<script lang="ts">
	import { getAnimes } from '$lib/client/animes';
	import { getAnimelist } from '$lib/stores/animelist';

	export let username: string;

	// Fetch user recomendations from trpc
	$: animelist = getAnimelist(username);
	$: animeslistIds = $animelist ? (Object.keys($animelist) as any[]) : [];
</script>

Animes

{#await getAnimes(animeslistIds)}
	Loading...
{:then animes}
	{#each Object.values(animes) as anime (anime.id)}
		<img src={anime.pictureMedium} />
		<div>{anime.title}</div>
		<div>{anime.mediaType}</div>
		<div>{anime.nsfw}</div>
		<div>{anime.seasonYear} - {anime.season}</div>
		<div>{anime.genres}</div>
	{/each}
{/await}
