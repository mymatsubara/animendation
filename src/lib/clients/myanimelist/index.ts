import {
	OpenAPI,
	type AnimeForDetails,
	type AnimeForList,
	type AnimeListForRanking,
	type AnimeListStatus,
	type List,
	type MangaForDetails,
	type MangaForList,
	type MangaListForRanking,
	type User,
	type UserAnimeList,
	type UserAnimeListEdge,
	type UserMangaList,
	type UserMangaListEdge,
} from '$lib/clients/myanimelist/generated';
import type { Anime, Manga } from '$lib/server/schema';
import type { SerieType } from '$lib/types';
import { TRPCError } from '@trpc/server';
import type { Insertable } from 'kysely';

export const animeStatus = [
	'watching',
	'completed',
	'on_hold',
	'dropped',
	'plan_to_watch',
] as const;
export type AnimeStatus = typeof animeStatus[number];

export const mangaStatus = ['reading', 'completed', 'on_hold', 'dropped', 'plan_to_read'] as const;
export type MangaStatus = typeof mangaStatus[number];

type GetUserAnimelistOptions = {
	fields?: 'list_status';
	limit?: number;
	status?: AnimeStatus;
	sort?: 'list_score' | 'list_updated_at' | 'anime_title' | 'anime_start_date' | 'anime_id';
	offset?: number;
};

type GetUserMangalistOptions = {
	fields?: 'list_status';
	limit?: number;
	status?: MangaStatus;
	sort?: 'list_score' | 'list_updated_at' | 'manga_title' | 'manga_start_date' | 'manga_id';
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

type GetMangaRankingOptions = {
	type:
		| 'all'
		| 'manga'
		| 'novels'
		| 'oneshots'
		| 'doujin'
		| 'manhwa'
		| 'manhua'
		| 'bypopularity'
		| 'favorite';
	limit?: number;
	offset?: number;
};

type GetAnimeRankingResponse = {
	mangas: AnimeListEntry[];
} & List;

type GetMangaRankingResponse = {
	mangas: MangaListEntry[];
} & List;

type UpdateAnimelistStatus = {
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

type UpdateMangalistStatus = {
	mangaId: number;
	status?: MangaStatus;
	is_rereading?: boolean;
	score?: number;
	num_volumes_read?: number;
	num_chapters_read?: number;
	prpriority?: number;
	num_times_reread?: number;
	reread_value?: number;
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
export type MangaListEntry = Omit<Insertable<Manga>, 'genres'> & { genres: string[] };
export type MangaDetail = MangaListEntry;

const serieFields =
	'start_date,end_date,nsfw,genres,created_at,updated_at,media_type,status,num_episodes,start_season,source,rating,num_volumes,num_chapters';

export class MALClient {
	private baseUrl = OpenAPI.BASE;
	private headers!: Record<string, string>;

	constructor(options: MALClientOptions) {
		if ('accessToken' in options) {
			this.headers = {
				Authorization: `Bearer ${options.accessToken}`,
			};
		}

		if ('clientId' in options) {
			this.headers = {
				'X-MAL-CLIENT-ID': options.clientId,
			};
		}
	}

	async getUserFullAnimelist(
		username: string,
		options?: Omit<GetUserAnimelistOptions, 'limit' | 'offset'>
	): Promise<UserAnimeListEdge[]> {
		const limit = 1000;
		const opts = {
			...options,
			limit,
			offset: 0,
		};

		return this.getAllPagedResults(async () => {
			const page = await this.getUserAnimeList(username, opts);
			opts.offset += limit;

			return page;
		});
	}

	async getUserFullMangalist(
		username: string,
		options?: Omit<GetUserMangalistOptions, 'limit' | 'offset'>
	): Promise<UserAnimeListEdge[]> {
		const limit = 1000;
		const opts = {
			...options,
			limit,
			offset: 0,
		};

		return this.getAllPagedResults(async () => {
			const page = await this.getUserMangalist(username, opts);
			opts.offset += limit;

			return page;
		});
	}

	private async getAllPagedResults<T, P extends List & { data?: T[] }>(fetch: () => Promise<P>) {
		let result: T[] = [];

		while (true) {
			const page = await fetch();

			result.push(...(page.data ?? []));

			if (!page?.paging?.next) {
				break;
			}
		}

		return result;
	}

	async getUserMangalistSince(username: string, since: Date) {
		return this.getUserListSince(username, since, 'Manga') as Promise<UserMangaListEdge[]>;
	}

	async getUserAnimelistSince(username: string, since: Date) {
		return this.getUserListSince(username, since, 'Anime') as Promise<UserAnimeListEdge[]>;
	}

	private async getUserListSince(username: string, since: Date, type: SerieType) {
		const options = {
			fields: 'list_status',
			limit: 10,
			offset: 0,
			sort: 'list_updated_at',
		} satisfies GetUserAnimelistOptions | GetUserMangalistOptions;

		let result: (UserAnimeListEdge | UserMangaListEdge)[] = [];
		const sinceTime = since.getTime();

		while (true) {
			const page =
				type === 'Anime'
					? await this.getUserAnimeList(username, options)
					: await this.getUserMangalist(username, options);

			const newSeries = page.data?.filter(
				(anime) => new Date(anime?.list_status?.updated_at ?? 0).getTime() >= sinceTime
			);

			result.push(...(newSeries ?? []));

			if (newSeries?.length !== options.limit || !page?.paging?.next) {
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
			`${serieFields},related_anime`
		)) as Required<AnimeForDetails>;

		return mapAnimeDetail(animes);
	}

	async getAnimeDetailRaw(id: number, fields?: string): Promise<AnimeForDetails> {
		const response = (await this.request({
			path: `/anime/${id}`,
			method: 'GET',
			searchParams: { fields },
		})) as AnimeForDetails;

		return response;
	}

	async getAnimeRaking(options: GetAnimeRankingOptions): Promise<GetAnimeRankingResponse> {
		const response = (await this.request({
			path: `/anime/ranking`,
			method: 'GET',
			searchParams: { ...options, fields: serieFields },
		})) as AnimeListForRanking;

		return {
			mangas: response.data?.map((anime) => mapAnime(anime.node as Required<AnimeForList>)) ?? [],
			paging: response.paging,
		};
	}

	async getMangaDetail(id: number): Promise<MangaDetail> {
		const mangas = (await this.getMangaDetailRaw(id, serieFields)) as Required<MangaForDetails>;

		return mapManga(mangas);
	}

	async getMangaDetailRaw(id: number, fields?: string): Promise<MangaForDetails> {
		const response = (await this.request({
			path: `/anime/${id}`,
			method: 'GET',
			searchParams: { fields },
		})) as AnimeForDetails;

		return response;
	}

	async getMangaRanking(options: GetAnimeRankingOptions): Promise<GetMangaRankingResponse> {
		const response = (await this.request({
			path: `/manga/ranking`,
			method: 'GET',
			searchParams: { ...options, fields: serieFields },
		})) as MangaListForRanking;

		return {
			mangas: response.data?.map((manga) => mapManga(manga.node as Required<MangaForList>)) ?? [],
			paging: response.paging,
		};
	}

	getUserAnimeList(username: string, options?: GetUserAnimelistOptions): Promise<UserAnimeList> {
		return this.request({
			path: `/users/${username}/animelist`,
			method: 'GET',
			searchParams: options as any,
		}) as Promise<UserAnimeList>;
	}

	getUserMangalist(username: string, options?: GetUserMangalistOptions): Promise<UserMangaList> {
		return this.request({
			path: `/users/${username}/mangalist`,
			method: 'GET',
			searchParams: options as any,
		}) as Promise<UserMangaList>;
	}

	getMe(): Promise<User> {
		return this.request({
			path: `/users/@me`,
			method: 'GET',
		}) as Promise<User>;
	}

	updateAnimeStatusOnList(input: UpdateAnimelistStatus): Promise<AnimeListStatus> {
		const { animeId, ...body } = input;

		return this.request({
			path: `/anime/${animeId}/my_list_status`,
			method: 'PUT',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams(body as any),
		}) as Promise<AnimeListStatus>;
	}

	updateMangaStatusOnList(input: UpdateMangalistStatus): Promise<AnimeListStatus> {
		const { mangaId, ...body } = input;

		return this.request({
			path: `/manga/${mangaId}/my_list_status`,
			method: 'PUT',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams(body as any),
		}) as Promise<AnimeListStatus>;
	}

	removeAnimeFromList(animeId: number) {
		return this.request({
			path: `/anime/${animeId}/my_list_status`,
			method: 'DELETE',
		});
	}

	removeMangaFromList(mangaId: number) {
		return this.request({
			path: `/manga/${mangaId}/my_list_status`,
			method: 'DELETE',
		});
	}

	private async request(options: RequestOptions) {
		let url = `${this.baseUrl}${options.path}`;
		if (options.searchParams) {
			url += `?${new URLSearchParams(options.searchParams as any)}`;
		}

		const response = await fetch(url, {
			method: options.method,
			body: options?.body,
			headers: { ...this.headers, ...options.headers },
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
		startDate: startDate ? new Date(startDate).toDateString() : null,
	};
}

function mapManga(manga: Required<MangaForList>): MangaDetail {
	const startDate = manga.start_date;
	const endDate = manga.end_date;
	const createdAt = manga.created_at;
	const updatedAt = manga.updated_at;

	return {
		id: manga.id,
		createdAt: createdAt === '1970-01-01T00:00:00+00:00' ? '1970-01-01T00:00:00' : createdAt,
		updatedAt: updatedAt === '1970-01-01T00:00:00+00:00' ? '1970-01-01T00:00:00' : updatedAt,
		genres: manga.genres?.map((genre) => genre.name as string) ?? [],
		mediaType: manga.media_type,
		status: manga.status,
		title: manga.title,
		endDate: endDate ? new Date(endDate).toDateString() : null,
		nsfw: manga.nsfw,
		pictureLarge: manga.main_picture?.large,
		pictureMedium: manga.main_picture?.medium,
		startDate: startDate ? new Date(startDate).toDateString() : null,
		chapters: manga.num_chapters,
		volumes: manga.num_volumes,
	};
}

function mapAnimeDetail(anime: Required<AnimeForList>): AnimeDetail {
	return {
		...mapAnime(anime),
		isSequel: isSequel(anime),
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
