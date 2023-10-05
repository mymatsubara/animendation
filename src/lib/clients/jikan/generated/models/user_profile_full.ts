/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { user_images } from './user_images';

/**
 * Transform the resource into an array.
 */
export type user_profile_full = {
    /**
     * MyAnimeList ID
     */
    mal_id?: number | null;
    /**
     * MyAnimeList Username
     */
    username?: string;
    /**
     * MyAnimeList URL
     */
    url?: string;
    images?: user_images;
    /**
     * Last Online Date ISO8601
     */
    last_online?: string | null;
    /**
     * User Gender
     */
    gender?: string | null;
    /**
     * Birthday Date ISO8601
     */
    birthday?: string | null;
    /**
     * Location
     */
    location?: string | null;
    /**
     * Joined Date ISO8601
     */
    joined?: string | null;
    statistics?: {
/**
 * Anime Statistics
 */
anime?: {
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
 * Manga Statistics
 */
manga?: {
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
};
    external?: Array<{
name?: string;
url?: string;
}>;
};
