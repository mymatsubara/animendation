import { getAnimes } from '$lib/client/animes';
import { trpc } from '$lib/trpc/client';
import { toRecord } from '$lib/utils/array';

export async function getRecommendations(username: string) {
	const recommendationIds = await trpc.recommendation.list.query({ username });
	const ids = new Set(recommendationIds);

	const animes = await getAnimes(recommendationIds);
	return toRecord(
		Object.values(animes).filter((anime) => ids.has(Number(anime.id))),
		(anime) => anime.id
	);
}
