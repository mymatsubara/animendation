/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { character } from '../models/character';
import type { character_anime } from '../models/character_anime';
import type { character_full } from '../models/character_full';
import type { character_manga } from '../models/character_manga';
import type { character_pictures } from '../models/character_pictures';
import type { character_voice_actors } from '../models/character_voice_actors';
import type { characters_search } from '../models/characters_search';
import type { characters_search_query_orderby } from '../models/characters_search_query_orderby';
import type { search_query_sort } from '../models/search_query_sort';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CharactersService {

    /**
     * @param id 
     * @returns any Returns complete character resource data
     * @throws ApiError
     */
    public static getCharacterFullById(
id: number,
): CancelablePromise<{
data?: character_full;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/characters/{id}/full',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns any Returns character resource
     * @throws ApiError
     */
    public static getCharacterById(
id: number,
): CancelablePromise<{
data?: character;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/characters/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns character_anime Returns anime that character is in
     * @throws ApiError
     */
    public static getCharacterAnime(
id: number,
): CancelablePromise<character_anime> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/characters/{id}/anime',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns character_manga Returns manga that character is in
     * @throws ApiError
     */
    public static getCharacterManga(
id: number,
): CancelablePromise<character_manga> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/characters/{id}/manga',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns character_voice_actors Returns the character's voice actors
     * @throws ApiError
     */
    public static getCharacterVoiceActors(
id: number,
): CancelablePromise<character_voice_actors> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/characters/{id}/voices',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns character_pictures Returns pictures related to the entry
     * @throws ApiError
     */
    public static getCharacterPictures(
id: number,
): CancelablePromise<character_pictures> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/characters/{id}/pictures',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param page 
     * @param limit 
     * @param q 
     * @param orderBy 
     * @param sort 
     * @param letter Return entries starting with the given letter
     * @returns characters_search Returns search results for characters
     * @throws ApiError
     */
    public static getCharactersSearch(
page?: number,
limit?: number,
q?: string,
orderBy?: characters_search_query_orderby,
sort?: search_query_sort,
letter?: string,
): CancelablePromise<characters_search> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/characters',
            query: {
                'page': page,
                'limit': limit,
                'q': q,
                'order_by': orderBy,
                'sort': sort,
                'letter': letter,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

}
