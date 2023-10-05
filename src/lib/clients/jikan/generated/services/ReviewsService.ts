/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ReviewsService {

    /**
     * @param page 
     * @param preliminary Any reviews left during an ongoing anime/manga, those reviews are tagged as preliminary. Preliminary reviews are not returned by default. e.g usage: `?preliminary=true`
     * @param spoiler Any reviews that are tagged as a spoiler. Spoiler reviews are not returned by default. e.g usage: `?spoiler=true`
     * @returns any Returns recent anime reviews
     * @throws ApiError
     */
    public static getRecentAnimeReviews(
page?: number,
preliminary?: boolean,
spoiler?: boolean,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reviews/anime',
            query: {
                'page': page,
                'preliminary': preliminary,
                'spoiler': spoiler,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param page 
     * @param preliminary Any reviews left during an ongoing anime/manga, those reviews are tagged as preliminary. Preliminary reviews are not returned by default. e.g usage: `?preliminary=true`
     * @param spoiler Any reviews that are tagged as a spoiler. Spoiler reviews are not returned by default. e.g usage: `?spoiler=true`
     * @returns any Returns recent manga reviews
     * @throws ApiError
     */
    public static getRecentMangaReviews(
page?: number,
preliminary?: boolean,
spoiler?: boolean,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/reviews/manga',
            query: {
                'page': page,
                'preliminary': preliminary,
                'spoiler': spoiler,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

}
