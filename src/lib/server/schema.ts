import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const NsfwLevel = {
	white: 'white',
	gray: 'gray',
	black: 'black'
} as const;
export type NsfwLevel = typeof NsfwLevel[keyof typeof NsfwLevel];
export const AnimeMediaType = {
	unknown: 'unknown',
	tv: 'tv',
	ova: 'ova',
	movie: 'movie',
	special: 'special',
	ona: 'ona',
	music: 'music'
} as const;
export type AnimeMediaType = typeof AnimeMediaType[keyof typeof AnimeMediaType];
export const AnimeStatus = {
	finished_airing: 'finished_airing',
	currently_airing: 'currently_airing',
	not_yet_aired: 'not_yet_aired'
} as const;
export type AnimeStatus = typeof AnimeStatus[keyof typeof AnimeStatus];
export const Season = {
	winter: 'winter',
	spring: 'spring',
	summer: 'summer',
	fall: 'fall'
} as const;
export type Season = typeof Season[keyof typeof Season];
export const AnimeSource = {
	other: 'other',
	original: 'original',
	manga: 'manga',
	four_koma_manga: 'four_koma_manga',
	web_manga: 'web_manga',
	digital_manga: 'digital_manga',
	novel: 'novel',
	light_novel: 'light_novel',
	visual_novel: 'visual_novel',
	game: 'game',
	card_game: 'card_game',
	book: 'book',
	picture_book: 'picture_book',
	radio: 'radio',
	music: 'music',
	web_novel: 'web_novel',
	mixed_media: 'mixed_media'
} as const;
export type AnimeSource = typeof AnimeSource[keyof typeof AnimeSource];
export type Anime = {
	id: number;
	title: string;
	pictureMedium: string | null;
	pictureLarge: string | null;
	startDate: Timestamp | null;
	endDate: Timestamp | null;
	nsfw: NsfwLevel | null;
	genres: string[];
	createdAt: Timestamp;
	updatedAt: Timestamp;
	mediaType: AnimeMediaType;
	status: AnimeStatus;
	episodes: number;
	season: Season | null;
	seasonYear: number | null;
	source: AnimeSource | null;
};
export type DB = {
	Anime: Anime;
};
