/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { anime_review } from './anime_review';
import type { pagination } from './pagination';
import type { user_meta } from './user_meta';

/**
 * Anime Reviews Resource
 */
export type anime_reviews = ({
data?: Array<({
user?: user_meta;
} & anime_review)>;
} & pagination);
