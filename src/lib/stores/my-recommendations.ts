import { user } from '$lib/stores/user';
import { trpc } from '$lib/trpc/client';
import { writable } from 'svelte/store';

export type MyRecommendations = ReturnType<typeof getMyRecommendations>;
const recommendations = writable<Set<number> | undefined>();

async function fetchMyRecommendations() {
	const dbRecommendations = await trpc.recommendation.mine.query();

	recommendations.set(new Set(dbRecommendations));
}

user.subscribe(async (user) => {
	if (user) {
		await fetchMyRecommendations();
	} else {
		recommendations.set(undefined);
	}
});

export function getMyRecommendations() {
	async function add(animeId: number) {
		await trpc.recommendation.add.mutate({ animeId });

		// Add anime as the first element of the set
		recommendations.update((rec) => (rec !== undefined ? new Set([animeId, ...rec]) : undefined));
	}

	async function remove(animeId: number) {
		await trpc.recommendation.remove.mutate({ animeId });
		recommendations.update((rec) => {
			rec?.delete(animeId);
			return rec;
		});
	}

	return {
		subscribe: recommendations.subscribe,
		add,
		remove,
	};
}
