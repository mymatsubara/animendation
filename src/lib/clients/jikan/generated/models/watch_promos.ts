/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { anime_meta } from './anime_meta';
import type { pagination } from './pagination';
import type { trailer } from './trailer';

/**
 * Watch Promos
 */
export type watch_promos = (pagination & ({
/**
 * Promo Title
 */
title?: string;
} & {
data?: Array<{
entry?: anime_meta;
trailer?: Array<trailer>;
}>;
}));
