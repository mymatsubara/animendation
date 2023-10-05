/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { common_images } from './common_images';
import type { title } from './title';

/**
 * Producers Resource
 */
export type producer_full = {
    /**
     * MyAnimeList ID
     */
    mal_id?: number;
    /**
     * MyAnimeList URL
     */
    url?: string;
    /**
     * All titles
     */
    titles?: Array<title>;
    images?: common_images;
    /**
     * Producers's member favorites count
     */
    favorites?: number;
    /**
     * Producers's anime count
     */
    count?: number;
    /**
     * Established Date ISO8601
     */
    established?: string | null;
    /**
     * About the Producer
     */
    about?: string | null;
    external?: Array<{
name?: string;
url?: string;
}>;
};
