import {
	OpenAPI,
	type AnimeForDetails,
	type AnimeForList,
	type AnimeListForRanking,
	type AnimeListStatus,
	type List,
	type User,
	type UserAnimeList,
	type UserAnimeListEdge
} from '$lib/clients/myanimelist/generated';
import type { Anime } from '$lib/server/schema';
import { TRPCError } from '@trpc/server';
import type { Insertable } from 'kysely';

export const animeStatus = [
	'watching',
	'completed',
	'on_hold',
	'dropped',
	'plan_to_watch'
] as const;
export type AnimeStatus = typeof animeStatus[number];

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
	headers?: Record<string, string>;
};

type GetAnimeRankingOptions = {
	type: 'all' | 'airing' | 'upcoming' | 'tv' | 'ova' | 'special' | 'bypopularity' | 'favorite';
	limit?: number;
	offset?: number;
};

type GetAnimeRankingResponse = {
	animes: AnimeListEntry[];
} & List;

type UpdateMyanimelistStatus = {
	animeId: number;
	status?: AnimeStatus;
	is_rewatching?: boolean;
	score?: number;
	num_watched_episodes?: number;
	priority?: number;
	num_times_rewatched?: number;
	rewatch_value?: number;
	tags?: string;
	comments?: string;
};

type MALClientOptions =
	| {
			accessToken: string;
	  }
	| { clientId: string };

export type AnimeListEntry = Omit<Insertable<Anime>, 'genres' | 'isSequel'> & { genres: string[] };
export type AnimeDetail = AnimeListEntry & { isSequel: boolean };

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
			result.push(...(page.data ?? []));
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

			result.push(...(newAnimes ?? []));

			if (newAnimes?.length !== options.limit || !page?.paging?.next) {
				break;
			}

			options.offset += options.limit;
			options.limit = 1000;
		}

		return result;
	}

	async getAnimeDetail(id: number): Promise<AnimeDetail> {
		const animes = (await this.getAnimeDetailRaw(
			id,
			`${animeFields},related_anime`
		)) as Required<AnimeForDetails>;

		return mapAnimeDetail(animes);
	}

	async getAnimeDetailRaw(id: number, fields?: string): Promise<AnimeForDetails> {
		const response = (await this.request({
			path: `/anime/${id}`,
			method: 'GET',
			searchParams: { fields }
		})) as AnimeForDetails;

		return response;
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

	updateMyanimelistStatus(input: UpdateMyanimelistStatus): Promise<AnimeListStatus> {
		const { animeId, ...body } = input;

		return this.request({
			path: `/anime/${animeId}/my_list_status`,
			method: 'PUT',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams(body as any)
		}) as Promise<AnimeListStatus>;
	}

	private async request(options: RequestOptions) {
		let url = `${this.baseUrl}${options.path}`;
		if (options.searchParams) {
			url += `?${new URLSearchParams(options.searchParams as any)}`;
		}

		const response = await fetch(url, {
			method: options.method,
			body: options?.body,
			headers: { ...this.headers, ...options.headers }
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

function mapAnime(anime: Required<AnimeForList>): AnimeListEntry {
	const startDate = anime.start_date;
	const endDate = anime.end_date;

	return {
		id: anime.id,
		createdAt: anime.created_at,
		episodes: anime.num_episodes,
		genres: anime.genres?.map((genre) => genre.name as string) ?? [],
		mediaType: anime.media_type,
		season: anime.start_season?.season ?? null,
		seasonYear: anime.start_season?.year ?? null,
		source: anime.source,
		status: anime.status,
		title: anime.title,
		updatedAt: anime.updated_at,
		endDate: endDate ? new Date(endDate).toDateString() : null,
		nsfw: anime.nsfw,
		pictureLarge: anime.main_picture?.large,
		pictureMedium: anime.main_picture?.medium,
		startDate: startDate ? new Date(startDate).toDateString() : null
	};
}

function mapAnimeDetail(anime: Required<AnimeForList>): AnimeDetail {
	return {
		...mapAnime(anime),
		isSequel: isSequel(anime)
	};
}

export function isSequel(anime: AnimeForDetails): boolean {
	const relatedAnimes = anime.related_anime;
	if (!relatedAnimes) {
		return false;
	}

	return !!relatedAnimes.find(
		({ relation_type }) =>
			relation_type === 'full_story' ||
			relation_type === 'prequel' ||
			relation_type === 'parent_story'
	);
}
