import { user } from '$lib/stores/user';
import { trpc } from '$lib/trpc/client';
import type { SerieType } from '$lib/types';
import { writable } from 'svelte/store';

type Recommendations = {
	animes: Set<number>;
	mangas: Set<number>;
};

export type MyRecommendations = ReturnType<typeof getMyRecommendations>;
const recommendations = writable<Recommendations | undefined>();

async function fetchMyRecommendations() {
	const dbRecommendations = await trpc.recommendation.mine.query();

	recommendations.set({
		animes: new Set(dbRecommendations.animes),
		mangas: new Set(dbRecommendations.mangas),
	});
}

user.subscribe(async (user) => {
	if (user) {
		await fetchMyRecommendations();
	} else {
		recommendations.set(undefined);
	}
});

export function getMyRecommendations() {
	async function add(serieId: number, type: SerieType) {
		await trpc.recommendation.add.mutate({ serieId, type });

		// Add anime as the first element of the set
		recommendations.update((rec) => {
			if (rec !== undefined) {
				return {
					...rec,
					...(type === 'Anime'
						? { animes: new Set([serieId, ...rec.animes]) }
						: { mangas: new Set([serieId, ...rec.mangas]) }),
				};
			}
		});
	}

	async function remove(animeId: number, type: SerieType) {
		await trpc.recommendation.remove.mutate({ serieId: animeId, type });

		recommendations.update((rec) => {
			const set = type === 'Anime' ? rec?.animes : rec?.mangas;
			set?.delete(animeId);

			return rec;
		});
	}

	return {
		subscribe: recommendations.subscribe,
		add,
		remove,
	};
}
