/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { anime_meta } from './anime_meta';
import type { character_meta } from './character_meta';

/**
 * Person's voice acting roles
 */
export type person_voice_acting_roles = {
    data?: Array<{
/**
 * Person's Character's role in the anime
 */
role?: string;
anime?: anime_meta;
character?: character_meta;
}>;
};
