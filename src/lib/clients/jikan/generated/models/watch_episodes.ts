/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { anime_meta } from './anime_meta';
import type { pagination } from './pagination';

/**
 * Watch Episodes
 */
export type watch_episodes = ({
data?: Array<{
entry?: anime_meta;
/**
 * Recent Episodes (max 2 listed)
 */
episodes?: Array<{
/**
 * MyAnimeList ID
 */
mal_id?: string;
/**
 * MyAnimeList URL
 */
url?: string;
/**
 * Episode Title
 */
title?: string;
/**
 * For MyAnimeList Premium Users
 */
premium?: boolean;
}>;
/**
 * Region Locked Episode
 */
region_locked?: boolean;
}>;
} & pagination);
