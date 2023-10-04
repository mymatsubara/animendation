/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Genre } from './Genre';
import type { WorkBase } from './WorkBase';

export type WorkForList = (WorkBase & {
/**
 * "synonyms" or ISO 639-1
 * 
 */
alternative_titles?: {
synonyms?: Array<string> | null;
en?: string | null;
ja?: string | null;
} | null;
start_date?: string | null;
end_date?: string | null;
/**
 * Synopsis.
 *
 * The API strips BBCode tags from the result.
 * 
 */
synopsis?: string | null;
/**
 * Mean score.
 *
 * When the `mean` can not be calculated, such as when the number of user scores is small, the result does not include this field.
 * 
 */
mean?: number | null;
/**
 * When the `rank` can not be calculated, such as when the number of user scores is small, the result does not include this field.
 * 
 */
rank?: number | null;
popularity?: number | null;
/**
 * Number of users who have this work in their list.
 * 
 */
num_list_users?: number;
num_scoring_users?: number;
/**
 * | Value | Description |
 * | ---- | ---- |
 * | white | This work is safe for work |
 * | gray | This work may be not safe for work |
 * | black | This work is not safe for work |
 * 
 */
nsfw?: string | null;
genres?: Array<Genre>;
created_at?: string;
updated_at?: string;
});
