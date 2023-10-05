/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { pagination } from './pagination';
import type { user_meta } from './user_meta';

/**
 * User Friends
 */
export type user_friends = ({
data?: Array<({
user?: user_meta;
} & {
/**
 * Last Online Date ISO8601 format
 */
last_online?: string;
/**
 * Friends Since Date ISO8601 format
 */
friends_since?: string;
})>;
} & pagination);
