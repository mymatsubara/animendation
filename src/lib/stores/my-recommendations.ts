import { user } from '$lib/stores/user';
import { trpc } from '$lib/trpc/client';
import { writable } from 'svelte/store';

export type MyRecommendations = ReturnType<typeof getMyRecommendations>;
const recommendations = writable<Set<number>>();

export function getMyRecommendations() {
	async function fetchMyRecommendations() {
		const dbRecommendations = await trpc.recommendation.mine.query();

		recommendations.set(new Set(dbRecommendations));
	}

	async function add(animeId: number) {
		await trpc.recommendation.add.mutate({ animeId });
		recommendations.update((rec) => rec.add(animeId));
	}

	async function remove(animeId: number) {
		await trpc.recommendation.remove.mutate({ animeId });
		recommendations.update((rec) => {
			rec.delete(animeId);
			return rec;
		});
	}

	user.subscribe(async (user) => {
		if (!user) {
			await fetchMyRecommendations();
		}
	});

	return {
		subscribe: recommendations.subscribe,
		add,
		remove
	};
}
