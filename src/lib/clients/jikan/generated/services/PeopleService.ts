/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { people_search } from '../models/people_search';
import type { people_search_query_orderby } from '../models/people_search_query_orderby';
import type { person } from '../models/person';
import type { person_anime } from '../models/person_anime';
import type { person_full } from '../models/person_full';
import type { person_manga } from '../models/person_manga';
import type { person_pictures } from '../models/person_pictures';
import type { person_voice_acting_roles } from '../models/person_voice_acting_roles';
import type { search_query_sort } from '../models/search_query_sort';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PeopleService {

    /**
     * @param id 
     * @returns any Returns complete character resource data
     * @throws ApiError
     */
    public static getPersonFullById(
id: number,
): CancelablePromise<{
data?: person_full;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/people/{id}/full',
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
     * @returns any Returns pictures related to the entry
     * @throws ApiError
     */
    public static getPersonById(
id: number,
): CancelablePromise<{
data?: person;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/people/{id}',
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
     * @returns person_anime Returns person's anime staff positions
     * @throws ApiError
     */
    public static getPersonAnime(
id: number,
): CancelablePromise<person_anime> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/people/{id}/anime',
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
     * @returns person_voice_acting_roles Returns person's voice acting roles
     * @throws ApiError
     */
    public static getPersonVoices(
id: number,
): CancelablePromise<person_voice_acting_roles> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/people/{id}/voices',
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
     * @returns person_manga Returns person's published manga works
     * @throws ApiError
     */
    public static getPersonManga(
id: number,
): CancelablePromise<person_manga> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/people/{id}/manga',
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
     * @returns person_pictures Returns a list of pictures of the person
     * @throws ApiError
     */
    public static getPersonPictures(
id: number,
): CancelablePromise<person_pictures> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/people/{id}/pictures',
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
     * @returns people_search Returns search results for people
     * @throws ApiError
     */
    public static getPeopleSearch(
page?: number,
limit?: number,
q?: string,
orderBy?: people_search_query_orderby,
sort?: search_query_sort,
letter?: string,
): CancelablePromise<people_search> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/people',
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
