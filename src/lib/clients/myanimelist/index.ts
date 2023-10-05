import {
	OpenAPI,
	type User,
	type UserAnimeList,
	type UserAnimeListEdge
} from '$lib/clients/myanimelist/generated';

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
			// TODO: refresh token
		} else if (response.status >= 400) {
			throw new Error(`MAL Api error [${response.status}]: ${await response.text()}`);
		}

		return response.json();
	}
}
