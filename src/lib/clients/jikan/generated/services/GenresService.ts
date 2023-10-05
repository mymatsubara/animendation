/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { genre_query_filter } from '../models/genre_query_filter';
import type { genres } from '../models/genres';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GenresService {

    /**
     * @param filter 
     * @returns genres Returns entry genres, explicit_genres, themes and demographics
     * @throws ApiError
     */
    public static getAnimeGenres(
filter?: genre_query_filter,
): CancelablePromise<genres> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/genres/anime',
            query: {
                'filter': filter,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param filter 
     * @returns genres Returns entry genres, explicit_genres, themes and demographics
     * @throws ApiError
     */
    public static getMangaGenres(
filter?: genre_query_filter,
): CancelablePromise<genres> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/genres/manga',
            query: {
                'filter': filter,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

}
