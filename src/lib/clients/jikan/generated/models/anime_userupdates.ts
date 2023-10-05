/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { pagination } from './pagination';
import type { user_meta } from './user_meta';

/**
 * Anime User Updates Resource
 */
export type anime_userupdates = ({
data?: Array<{
user?: user_meta;
/**
 * User Score
 */
score?: number | null;
/**
 * User list status
 */
status?: string;
/**
 * Number of episodes seen
 */
episodes_seen?: number | null;
/**
 * Total number of episodes
 */
episodes_total?: number | null;
/**
 * Last updated date ISO8601
 */
date?: string;
}>;
} & pagination);
