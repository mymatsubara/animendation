/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { manga_review } from './manga_review';
import type { pagination } from './pagination';
import type { user_meta } from './user_meta';

/**
 * Manga Reviews Resource
 */
export type manga_reviews = ({
data?: Array<({
user?: user_meta;
} & manga_review)>;
} & pagination);
