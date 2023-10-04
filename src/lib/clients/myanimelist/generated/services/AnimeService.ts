/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnimeForDetails } from '../models/AnimeForDetails';
import type { AnimeList } from '../models/AnimeList';
import type { AnimeListForRanking } from '../models/AnimeListForRanking';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AnimeService {

    /**
     * Get anime list
     * @param q Search.
 * 
     * @param limit The maximum value is 100.
 * 
     * @param offset 
     * @param fields 
     * @returns AnimeList OK
     * @throws ApiError
     */
    public static animeGet(
q?: string,
limit: number = 100,
offset?: number,
fields?: string,
): CancelablePromise<AnimeList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime',
            query: {
                'q': q,
                'limit': limit,
                'offset': offset,
                'fields': fields,
            },
        });
    }

    /**
     * Get anime details
     * @param animeId 
     * @param fields 
     * @returns AnimeForDetails OK
     * @throws ApiError
     */
    public static animeAnimeIdGet(
animeId: number,
fields?: string,
): CancelablePromise<AnimeForDetails> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{anime_id}',
            path: {
                'anime_id': animeId,
            },
            query: {
                'fields': fields,
            },
        });
    }

    /**
     * Get anime ranking
     * The returned anime contains the `ranking` field.
 * 
     * @param rankingType | value | |
 * | ---- | ---- |
 * | all | Top Anime Series |
 * | airing | Top Airing Anime |
 * | upcoming | Top Upcoming Anime |
 * | tv | Top Anime TV Series |
 * | ova | Top Anime OVA Series |
 * | movie | Top Anime Movies |
 * | special | Top Anime Specials |
 * | bypopularity | Top Anime by Popularity |
 * | favorite | Top Favorited Anime |
 * 
     * @param limit The maximum value is 500.
 * 
     * @param offset 
     * @param fields 
     * @returns AnimeListForRanking OK
     * @throws ApiError
     */
    public static animeRankingGet(
rankingType: string,
limit: number = 100,
offset?: number,
fields?: string,
): CancelablePromise<AnimeListForRanking> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/ranking',
            query: {
                'ranking_type': rankingType,
                'limit': limit,
                'offset': offset,
                'fields': fields,
            },
        });
    }

    /**
     * Get seasonal anime
     * Get seasonal anime.
 *
 * | Season name | Months |
 * | ---- | ---- |
 * | winter | January, February, March |
 * | spring | April, May, June |
 * | summer | July, August, September |
 * | fall | October, November, December |
 * 
     * @param year 
     * @param season 
     * @param sort Valid values:
 *
 * | Value | Order |
 * | ---- | ---- |
 * | `anime_score` | Descending |
 * | `anime_num_list_users` | Descending |
 * 
     * @param limit The maximum value is 500.
     * @param offset 
     * @param fields 
     * @returns AnimeList OK
     * @throws ApiError
     */
    public static animeSeasonYearSeasonGet(
year: number,
season: string,
sort?: string,
limit: number = 100,
offset?: number,
fields?: string,
): CancelablePromise<AnimeList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/season/{year}/{season}',
            path: {
                'year': year,
                'season': season,
            },
            query: {
                'sort': sort,
                'limit': limit,
                'offset': offset,
                'fields': fields,
            },
        });
    }

    /**
     * Get suggested anime
     * Returns suggested anime for the authorized user.
 *
 * If the user is new comer, this endpoint returns an empty list.
 * 
     * @param limit The maximum value is 100.
     * @param offset 
     * @param fields 
     * @returns AnimeList OK.
     * @throws ApiError
     */
    public static animeSuggestionsGet(
limit: number = 100,
offset?: number,
fields?: string,
): CancelablePromise<AnimeList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/suggestions',
            query: {
                'limit': limit,
                'offset': offset,
                'fields': fields,
            },
        });
    }

}
