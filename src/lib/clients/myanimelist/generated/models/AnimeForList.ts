/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnimeListStatus } from './AnimeListStatus';
import type { AnimeSeason } from './AnimeSeason';
import type { AnimeStudio } from './AnimeStudio';
import type { WorkForList } from './WorkForList';

export type AnimeForList = (WorkForList & {
/**
 * - unknown
 * - tv
 * - ova
 * - movie
 * - special
 * - ona
 * - music
 * 
 */
media_type?: string;
/**
 * Airing status.
 *
 * - finished_airing
 * - currently_airing
 * - not_yet_aired
 * 
 */
status?: string;
my_list_status?: (Record<string, any> | null & AnimeListStatus);
/**
 * The total number of episodes of this series. If unknown, it is 0.
 * 
 */
num_episodes?: number;
start_season?: AnimeSeason;
/**
 * Broadcast date.
 * 
 */
broadcast?: {
/**
 * Day of the week broadcast in Japan time.
 *
 * Day of the week or `other`
 * 
 */
day_of_the_week?: string;
/**
 * for example: "01:25"
 * 
 */
start_time?: string | null;
} | null;
/**
 * Original work.
 *
 * - other
 * - original
 * - manga
 * - 4_koma_manga
 * - web_manga
 * - digital_manga
 * - novel
 * - light_novel
 * - visual_novel
 * - game
 * - card_game
 * - book
 * - picture_book
 * - radio
 * - music
 * 
 */
source?: string | null;
/**
 * Average length of episode in seconds.
 * 
 */
average_episode_duration?: number | null;
/**
 * | Value | Description |
 * | ---- | ---- |
 * | g | G - All Ages |
 * | pg | PG - Children |
 * | pg_13 | pg_13 - Teens 13 and Older |
 * | r | R - 17+ (violence & profanity) |
 * | r+ | R+ - Profanity & Mild Nudity |
 * | rx | Rx - Hentai |
 * 
 */
rating?: string | null;
studios?: Array<AnimeStudio>;
});
