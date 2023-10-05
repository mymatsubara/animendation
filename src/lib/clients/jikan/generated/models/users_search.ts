/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { pagination } from './pagination';
import type { user_images } from './user_images';

/**
 * User Results
 */
export type users_search = ({
data?: Array<{
/**
 * MyAnimeList URL
 */
url?: string;
/**
 * MyAnimeList Username
 */
username?: string;
images?: user_images;
/**
 * Last Online Date ISO8601
 */
last_online?: string;
}>;
} & pagination);
