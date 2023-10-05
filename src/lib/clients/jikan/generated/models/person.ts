/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { people_images } from './people_images';

/**
 * Person Resource
 */
export type person = {
    /**
     * MyAnimeList ID
     */
    mal_id?: number;
    /**
     * MyAnimeList URL
     */
    url?: string;
    /**
     * Person's website URL
     */
    website_url?: string | null;
    images?: people_images;
    /**
     * Name
     */
    name?: string;
    /**
     * Given Name
     */
    given_name?: string | null;
    /**
     * Family Name
     */
    family_name?: string | null;
    /**
     * Other Names
     */
    alternate_names?: Array<string>;
    /**
     * Birthday Date ISO8601
     */
    birthday?: string | null;
    /**
     * Number of users who have favorited this entry
     */
    favorites?: number;
    /**
     * Biography
     */
    about?: string | null;
};
