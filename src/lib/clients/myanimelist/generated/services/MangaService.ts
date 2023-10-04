/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MangaForDetails } from '../models/MangaForDetails';
import type { MangaList } from '../models/MangaList';
import type { MangaListForRanking } from '../models/MangaListForRanking';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MangaService {

    /**
     * Get manga list
     * @param q Search.
 * 
     * @param limit The maximum value is 100.
 * 
     * @param offset 
     * @param fields 
     * @returns MangaList OK
     * @throws ApiError
     */
    public static mangaGet(
q?: string,
limit: number = 100,
offset?: number,
fields?: string,
): CancelablePromise<MangaList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/manga',
            query: {
                'q': q,
                'limit': limit,
                'offset': offset,
                'fields': fields,
            },
        });
    }

    /**
     * Get manga details
     * @param mangaId 
     * @param fields 
     * @returns MangaForDetails OK
     * @throws ApiError
     */
    public static mangaMangaIdGet(
mangaId: number,
fields?: string,
): CancelablePromise<MangaForDetails> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/manga/{manga_id}',
            path: {
                'manga_id': mangaId,
            },
            query: {
                'fields': fields,
            },
        });
    }

    /**
     * Get manga ranking
     * The returned manga contains the `ranking` field.
 * 
     * @param rankingType | value | |
 * | ---- | ---- |
 * | all | All |
 * | manga | Top Manga |
 * | novels | Top Novels |
 * | oneshots | Top One-shots |
 * | doujin | Top Doujinshi |
 * | manhwa | Top Manhwa |
 * | manhua | Top Manhua |
 * | bypopularity | Most Popular |
 * | favorite | Most Favorited |
 * 
     * @param limit The maximum value is 500.
 * 
     * @param offset 
     * @param fields 
     * @returns MangaListForRanking OK
     * @throws ApiError
     */
    public static mangaRankingGet(
rankingType: string,
limit: number = 100,
offset?: number,
fields?: string,
): CancelablePromise<MangaListForRanking> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/manga/ranking',
            query: {
                'ranking_type': rankingType,
                'limit': limit,
                'offset': offset,
                'fields': fields,
            },
        });
    }

}
