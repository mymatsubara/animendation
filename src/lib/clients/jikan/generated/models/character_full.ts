/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { anime_meta } from './anime_meta';
import type { character_images } from './character_images';
import type { manga_meta } from './manga_meta';
import type { person_meta } from './person_meta';

/**
 * Character Resource
 */
export type character_full = {
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
    anime?: Array<{
/**
 * Character's Role
 */
role?: string;
anime?: anime_meta;
}>;
    manga?: Array<{
/**
 * Character's Role
 */
role?: string;
manga?: manga_meta;
}>;
    voices?: Array<{
/**
 * Character's Role
 */
language?: string;
person?: person_meta;
}>;
};
