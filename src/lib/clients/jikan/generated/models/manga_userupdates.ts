/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { pagination } from './pagination';
import type { user_meta } from './user_meta';

/**
 * Manga User Updates Resource
 */
export type manga_userupdates = ({
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
 * Number of volumes read
 */
volumes_read?: number;
/**
 * Total number of volumes
 */
volumes_total?: number;
/**
 * Number of chapters read
 */
chapters_read?: number;
/**
 * Total number of chapters
 */
chapters_total?: number;
/**
 * Last updated date ISO8601
 */
date?: string;
}>;
} & pagination);
