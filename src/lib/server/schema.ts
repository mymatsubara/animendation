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
	createdAt: string;
	updatedAt: string;
	mediaType: string;
	status: string;
	episodes: number;
	season: string | null;
	seasonYear: number | null;
	source: string | null;
	genres: string;
};
export type DB = {
	Anime: Anime;
};
