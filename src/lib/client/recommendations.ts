import { getAnimes } from '$lib/client/animes';
import { trpc } from '$lib/trpc/client';

export async function getRecommendations(username: string) {
	const recommendationIds = await trpc.recommendation.list.query({ username });
	return getAnimes(recommendationIds);
}
