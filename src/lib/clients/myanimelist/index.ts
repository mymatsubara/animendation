import { env } from '$env/dynamic/private';
import {
	OpenAPI,
	type UserAnimeList,
	type UserAnimeListEdge
} from '$lib/clients/myanimelist/generated';

export module MalClient {
	const baseUrl = OpenAPI.BASE;
	const clientHeader = {
		'X-MAL-CLIENT-ID': env.MAL_CLIENT_ID
	};

	interface GetUserAnimeListOptions {
		fields?: 'list_status';
		limit?: number;
		status?: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
		sort?: 'list_score' | 'list_updated_at' | 'anime_title' | 'anime_start_date' | 'anime_id';
		offset?: number;
	}

	export async function getUserFullAnimeList(
		username: string,
		options?: Omit<GetUserAnimeListOptions, 'limit' | 'offset'>
	): Promise<UserAnimeListEdge[]> {
		const limit = 1000;
		const opts = {
			...options,
			limit,
			offset: 0
		};

		let result: UserAnimeListEdge[] = [];

		while (true) {
			const page = await getUserAnimeList(username, opts);
			result = result.concat(page.data ?? []);
			opts.offset += limit;

			if (!page?.paging?.next) {
				break;
			}
		}

		return result;
	}

	export async function getUserAnimeList(
		username: string,
		options?: GetUserAnimeListOptions
	): Promise<UserAnimeList> {
		const searchParams = new URLSearchParams((options as Record<string, string>) ?? {});

		const response = await fetch(`${baseUrl}/users/${username}/animelist?${searchParams}`, {
			headers: clientHeader
		});

		if (response.status >= 400) {
			throw new Error(`MAL Api error [${response.status}]: ${await response.text()}`);
		}

		return response.json();
	}
}
