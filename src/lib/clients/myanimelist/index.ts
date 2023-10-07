import {
	OpenAPI,
	type AnimeForList,
	type AnimeListForRanking,
	type List,
	type User,
	type UserAnimeList,
	type UserAnimeListEdge
} from '$lib/clients/myanimelist/generated';
import type {
	Anime,
	AnimeMediaType,
	AnimeSource,
	AnimeStatus,
	NsfwLevel
} from '$lib/server/schema';
import { TRPCError } from '@trpc/server';
import type { Insertable } from 'kysely';

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

type GetAnimeRankingOptions = {
	type: 'all' | 'airing' | 'upcoming' | 'tv' | 'ova' | 'special' | 'bypopularity' | 'favorite';
	limit?: number;
	offset?: number;
};

type GetAnimeRankingResponse = {
	animes: AnimeDetail[];
} & List;

type MALClientOptions =
	| {
			accessToken: string;
	  }
	| { clientId: string };

type AnimeDetail = Insertable<Anime>;

const animeFields =
	'start_date,end_date,nsfw,genres,created_at,updated_at,media_type,status,num_episodes,start_season,source,rating';

export class MALClient {
	private baseUrl = OpenAPI.BASE;
	private headers!: Record<string, string>;

	constructor(options: MALClientOptions) {
		if ('accessToken' in options) {
			this.headers = {
				Authorization: `Bearer ${options.accessToken}`
			};
		}

		if ('clientId' in options) {
			this.headers = {
				'X-MAL-CLIENT-ID': options.clientId
			};
		}
	}

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

			if (newAnimes?.length !== options.limit || !page?.paging?.next) {
				break;
			}

			options.offset += options.limit;
			options.limit = 1000;
		}

		return result;
	}

	async getAnimeDetail(id: number): Promise<AnimeDetail> {
		const response = (await this.request({
			path: `/anime/${id}`,
			method: 'GET',
			searchParams: { fields: animeFields }
		})) as Required<AnimeForList>;

		return mapAnime(response);
	}

	async getAnimeRaking(options: GetAnimeRankingOptions): Promise<GetAnimeRankingResponse> {
		const response = (await this.request({
			path: `/anime/ranking`,
			method: 'GET',
			searchParams: { ...options, fields: animeFields }
		})) as AnimeListForRanking;

		return {
			animes: response.data?.map((anime) => mapAnime(anime.node as Required<AnimeForList>)) ?? [],
			paging: response.paging
		};
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
			headers: this.headers
		});

		if (response.status === 401) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		} else if (response.status === 404) {
			throw new TRPCError({ code: 'NOT_FOUND', message: await response.text() });
		} else if (response.status >= 400) {
			throw new Error(`MAL Api error [${response.status}]: ${await response.text()}`);
		}

		return response.json();
	}
}

function mapAnime(anime: Required<AnimeForList>): Insertable<Anime> {
	const startDate = anime.start_date;
	const endDate = anime.end_date;

	return {
		id: anime.id,
		createdAt: anime.created_at,
		episodes: anime.num_episodes,
		genres: anime.genres?.map((genre) => genre.name as string) ?? [],
		mediaType: anime.media_type as AnimeMediaType,
		season: anime.start_season?.season,
		seasonYear: anime.start_season?.year,
		source: anime.source === '4_koma_manga' ? 'four_koma_manga' : (anime.source as AnimeSource),
		status: anime.status as AnimeStatus,
		title: anime.title,
		updatedAt: anime.updated_at,
		endDate: endDate ? new Date(endDate).toDateString() : undefined,
		nsfw: anime.nsfw as NsfwLevel,
		pictureLarge: anime.main_picture?.large,
		pictureMedium: anime.main_picture?.medium,
		startDate: startDate ? new Date(startDate).toDateString() : undefined
	};
}
