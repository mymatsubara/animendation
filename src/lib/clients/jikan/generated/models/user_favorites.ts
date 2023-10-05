/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { anime_meta } from './anime_meta';
import type { character_meta } from './character_meta';
import type { mal_url_2 } from './mal_url_2';
import type { manga_meta } from './manga_meta';

export type user_favorites = {
    /**
     * Favorite Anime
     */
    anime?: Array<({
type?: string;
start_year?: number;
} & anime_meta)>;
    /**
     * Favorite Manga
     */
    manga?: Array<({
type?: string;
start_year?: number;
} & manga_meta)>;
    /**
     * Favorite Characters
     */
    characters?: Array<(character_meta & mal_url_2)>;
    /**
     * Favorite People
     */
    people?: Array<character_meta>;
};
