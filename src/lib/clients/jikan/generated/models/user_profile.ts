/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { user_images } from './user_images';

export type user_profile = {
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
};
