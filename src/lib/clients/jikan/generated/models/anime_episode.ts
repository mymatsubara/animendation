/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Anime Episode Resource
 */
export type anime_episode = {
    /**
     * MyAnimeList ID
     */
    mal_id?: number;
    /**
     * MyAnimeList URL
     */
    url?: string;
    /**
     * Title
     */
    title?: string;
    /**
     * Title Japanese
     */
    title_japanese?: string | null;
    /**
     * title_romanji
     */
    title_romanji?: string | null;
    /**
     * Episode duration in seconds
     */
    duration?: number | null;
    /**
     * Aired Date ISO8601
     */
    aired?: string | null;
    /**
     * Filler episode
     */
    filler?: boolean;
    /**
     * Recap episode
     */
    recap?: boolean;
    /**
     * Episode Synopsis
     */
    synopsis?: string | null;
};
