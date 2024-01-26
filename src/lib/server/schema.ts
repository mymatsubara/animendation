import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Anime = {
	id: number;
	title: string;
	pictureMedium: string | null;
	pictureLarge: string | null;
	startDate: string | null;
	endDate: string | null;
	nsfw: string | null;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	mediaType: string;
	status: string;
	episodes: number;
	season: string | null;
	seasonYear: number | null;
	source: string | null;
	genres: string;
	isSequel: number | null;
};
export type AnimeRecommendation = {
	id: Generated<number>;
	animeId: number;
	userId: number;
	createdAt: Generated<Timestamp>;
};
export type Follower = {
	id: Generated<number>;
	userId: number;
	followedUserId: number;
	createdAt: Generated<Timestamp>;
};
export type Manga = {
	id: number;
	title: string;
	pictureMedium: string | null;
	pictureLarge: string | null;
	startDate: string | null;
	endDate: string | null;
	nsfw: string | null;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	mediaType: string;
	status: string;
	volumes: number | null;
	chapters: number | null;
	source: string | null;
	genres: string;
};
export type MangaRecommendation = {
	id: Generated<number>;
	mangaId: number;
	userId: number;
	createdAt: Generated<Timestamp>;
	animeId: number | null;
};
export type User = {
	id: number;
	name: string;
	picture: string | null;
	followersCount: Generated<number>;
	followingCount: Generated<number>;
	createdAt: Generated<Timestamp>;
};
export type DB = {
	Anime: Anime;
	AnimeRecommendation: AnimeRecommendation;
	Follower: Follower;
	Manga: Manga;
	MangaRecommendation: MangaRecommendation;
	User: User;
};
