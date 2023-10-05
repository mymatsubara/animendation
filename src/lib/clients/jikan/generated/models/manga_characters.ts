/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { character_meta } from './character_meta';

/**
 * Manga Characters Resource
 */
export type manga_characters = {
    data?: Array<{
character?: character_meta;
/**
 * Character's Role
 */
role?: string;
}>;
};
