/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { character_images } from './character_images';
import type { people_images } from './people_images';

/**
 * Anime Characters Resource
 */
export type anime_characters = {
    data?: Array<{
/**
 * Character details
 */
character?: {
/**
 * MyAnimeList ID
 */
mal_id?: number;
/**
 * MyAnimeList URL
 */
url?: string;
images?: character_images;
/**
 * Character Name
 */
name?: string;
};
/**
 * Character's Role
 */
role?: string;
voice_actors?: Array<{
person?: {
mal_id?: number;
url?: string;
images?: people_images;
name?: string;
};
language?: string;
}>;
}>;
};
