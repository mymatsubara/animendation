/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { recommendations } from '../models/recommendations';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RecommendationsService {

    /**
     * @param page 
     * @returns recommendations Returns recent anime recommendations
     * @throws ApiError
     */
    public static getRecentAnimeRecommendations(
page?: number,
): CancelablePromise<recommendations> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recommendations/anime',
            query: {
                'page': page,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param page 
     * @returns recommendations Returns recent manga recommendations
     * @throws ApiError
     */
    public static getRecentMangaRecommendations(
page?: number,
): CancelablePromise<recommendations> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/recommendations/manga',
            query: {
                'page': page,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

}
