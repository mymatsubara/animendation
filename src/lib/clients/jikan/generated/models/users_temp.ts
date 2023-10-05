/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { entry_meta } from './entry_meta';

/**
 * Transform the resource into an array.
 */
export type users_temp = {
    data?: Array<{
/**
 * MyAnimeList ID
 */
mal_id?: number;
/**
 * MyAnimeList Username
 */
username?: string;
/**
 * MyAnimeList URL
 */
url?: string;
/**
 * Images
 */
images?: {
/**
 * Available images in JPG
 */
jpg?: {
/**
 * Image URL JPG (225x335)
 */
image_url?: string;
};
/**
 * Available images in WEBP
 */
webp?: {
/**
 * Image URL WEBP (225x335)
 */
image_url?: string;
};
};
/**
 * Last Online Date ISO8601
 */
last_online?: string;
/**
 * User Gender
 */
gender?: string;
/**
 * Birthday Date ISO8601
 */
birthday?: string;
/**
 * Location
 */
location?: string;
/**
 * Joined Date ISO8601
 */
joined?: string;
/**
 * Anime Stats
 */
anime_stats?: {
/**
 * Number of days spent watching Anime
 */
days_watched?: number;
/**
 * Mean Score
 */
mean_score?: number;
/**
 * Anime Watching
 */
watching?: number;
/**
 * Anime Completed
 */
completed?: number;
/**
 * Anime On-Hold
 */
on_hold?: number;
/**
 * Anime Dropped
 */
dropped?: number;
/**
 * Anime Planned to Watch
 */
plan_to_watch?: number;
/**
 * Total Anime entries on User list
 */
total_entries?: number;
/**
 * Anime re-watched
 */
rewatched?: number;
/**
 * Number of Anime Episodes Watched
 */
episodes_watched?: number;
};
/**
 * Manga Stats
 */
manga_stats?: {
/**
 * Number of days spent reading Manga
 */
days_read?: number;
/**
 * Mean Score
 */
mean_score?: number;
/**
 * Manga Reading
 */
reading?: number;
/**
 * Manga Completed
 */
completed?: number;
/**
 * Manga On-Hold
 */
on_hold?: number;
/**
 * Manga Dropped
 */
dropped?: number;
/**
 * Manga Planned to Read
 */
plan_to_read?: number;
/**
 * Total Manga entries on User list
 */
total_entries?: number;
/**
 * Manga re-read
 */
reread?: number;
/**
 * Number of Manga Chapters Read
 */
chapters_read?: number;
/**
 * Number of Manga Volumes Read
 */
volumes_read?: number;
};
/**
 * Favorite entries
 */
favorites?: {
/**
 * Favorite Anime
 */
anime?: Array<entry_meta>;
/**
 * Favorite Manga
 */
manga?: Array<entry_meta>;
/**
 * Favorite Characters
 */
characters?: Array<entry_meta>;
/**
 * Favorite People
 */
people?: Array<entry_meta>;
};
/**
 * User About. NOTE: About information is customizable by users through BBCode on MyAnimeList. This means users can add multimedia content, different text sizes, etc. Due to this freeform, Jikan returns parsed HTML. Validate on your end!
 */
about?: string;
}>;
};
