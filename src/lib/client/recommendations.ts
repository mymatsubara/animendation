import { getAnimes } from '$lib/client/animes';
import { getMangas } from '$lib/client/mangas';
import { trpc } from '$lib/trpc/client';

export async function getRecommendations(username: string) {
	const recommendationIds = await trpc.recommendation.list.query({ username });

	return {
		animes: await getAnimes(recommendationIds.animes),
		mangas: await getMangas(recommendationIds.mangas),
	};
}
