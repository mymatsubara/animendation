/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { people_images } from './people_images';

/**
 * Anime Staff Resource
 */
export type anime_staff = {
    data?: Array<{
/**
 * Person details
 */
person?: {
/**
 * MyAnimeList ID
 */
mal_id?: number;
/**
 * MyAnimeList URL
 */
url?: string;
images?: people_images;
/**
 * Name
 */
name?: string;
};
/**
 * Staff Positions
 */
positions?: Array<string>;
}>;
};
