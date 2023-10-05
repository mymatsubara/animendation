/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { mal_url } from './mal_url';

/**
 * Transform the resource into an array.
 */
export type history = {
    entry?: mal_url;
    /**
     * Number of episodes/chapters watched/read
     */
    increment?: number;
    /**
     * Date ISO8601
     */
    date?: string;
};
