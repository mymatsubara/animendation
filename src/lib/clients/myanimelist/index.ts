import {
	OpenAPI,
	type User,
	type UserAnimeList,
	type UserAnimeListEdge
} from '$lib/clients/myanimelist/generated';
import { TRPCError } from '@trpc/server';

type GetUserAnimeListOptions = {
	fields?: 'list_status';
	limit?: number;
	status?: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
	sort?: 'list_score' | 'list_updated_at' | 'anime_title' | 'anime_start_date' | 'anime_id';
	offset?: number;
};

type RequestOptions = {
	path: string;
	method: 'POST' | 'GET' | 'PUT' | 'DELETE';
	searchParams?: { [p: string]: string | number | undefined };
	body?: any;
};

export class MALClient {
	private baseUrl = OpenAPI.BASE;

	constructor(private accessToken: string) {}

	async getUserFullAnimeList(
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
			const page = await this.getUserAnimeList(username, opts);
			result = result.concat(page.data ?? []);
			opts.offset += limit;

			if (!page?.paging?.next) {
				break;
			}
		}

		return result;
	}

	async getUserAnimeListSince(username: string, since: Date) {
		const options = {
			fields: 'list_status',
			limit: 10,
			offset: 0,
			sort: 'list_updated_at'
		} satisfies GetUserAnimeListOptions;

		let result: UserAnimeListEdge[] = [];
		const sinceTime = since.getTime();

		while (true) {
			const page = await this.getUserAnimeList(username, options);
			const newAnimes = page.data?.filter(
				(anime) => new Date(anime?.list_status?.updated_at ?? 0).getTime() >= sinceTime
			);

			result = result.concat(newAnimes ?? []);
			console.log({ since, page: JSON.stringify(page, null, 2), newAnimes });

			if (newAnimes?.length !== options.limit || !page?.paging?.next) {
				break;
			}

			options.offset += options.limit;
			options.limit = 1000;
		}

		return result;
	}

	getUserAnimeList(username: string, options?: GetUserAnimeListOptions): Promise<UserAnimeList> {
		return this.request({
			path: `/users/${username}/animelist`,
			method: 'GET',
			searchParams: options as any
		}) as Promise<UserAnimeList>;
	}

	getMe(): Promise<User> {
		return this.request({
			path: `/users/@me`,
			method: 'GET'
		}) as Promise<User>;
	}

	private async request(options: RequestOptions) {
		let url = `${this.baseUrl}${options.path}`;
		if (options.searchParams) {
			url += `?${new URLSearchParams(options.searchParams as any)}`;
		}

		const response = await fetch(url, {
			method: options.method,
			body: options?.body,
			headers: {
				Authorization: `Bearer ${this.accessToken}`
			}
		});

		if (response.status === 401) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		} else if (response.status >= 400) {
			throw new Error(`MAL Api error [${response.status}]: ${await response.text()}`);
		}

		return response.json();
	}
}
