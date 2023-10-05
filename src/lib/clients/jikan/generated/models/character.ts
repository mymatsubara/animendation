/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { character_images } from './character_images';

/**
 * Character Resource
 */
export type character = {
    /**
     * MyAnimeList ID
     */
    mal_id?: number;
    /**
     * MyAnimeList URL
     */
    url?: string;
    images?: character_images;
    /**
     * Name
     */
    name?: string;
    /**
     * Name
     */
    name_kanji?: string | null;
    /**
     * Other Names
     */
    nicknames?: Array<string>;
    /**
     * Number of users who have favorited this entry
     */
    favorites?: number;
    /**
     * Biography
     */
    about?: string | null;
};
