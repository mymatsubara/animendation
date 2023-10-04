/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnimeListStatus } from '../models/AnimeListStatus';
import type { UserAnimeList } from '../models/UserAnimeList';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserAnimelistService {

    /**
     * Update my anime list status
     * Add specified anime to my anime list.
 *
 * If specified anime already exists, update its status.
 *
 * This endpoint updates only values specified by the parameter.
 * 
     * @param animeId 
     * @param formData 
     * @returns AnimeListStatus OK
     * @throws ApiError
     */
    public static animeAnimeIdMyListStatusPut(
animeId: number,
formData?: {
/**
 * - watching
 * - completed
 * - on_hold
 * - dropped
 * - plan_to_watch
 * 
 */
status?: string;
is_rewatching?: boolean;
/**
 * 0-10
 * 
 */
score?: number;
num_watched_episodes?: number;
/**
 * 0-2
 * 
 */
priority?: number;
num_times_rewatched?: number;
/**
 * 0-5
 * 
 */
rewatch_value?: number;
tags?: string;
comments?: string;
},
): CancelablePromise<AnimeListStatus> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/anime/{anime_id}/my_list_status',
            path: {
                'anime_id': animeId,
            },
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
        });
    }

    /**
     * Delete my anime list item.
     * If the specified anime does not exist in user's anime list, this endpoint does nothing
 * and returns `404 Not Found`.
 *
 * So be careful when retrying.
 * 
     * @param animeId 
     * @returns any OK
     * @throws ApiError
     */
    public static animeAnimeIdMyListStatusDelete(
animeId: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/anime/{anime_id}/my_list_status',
            path: {
                'anime_id': animeId,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * Get user anime list
     * @param userName User name or `@me`.
 * 
     * @param status Filters returned anime list by these statuses.
 *
 * To return all anime, don't specify this field.
 *
 * Valid values:
 *
 * - watching
 * - completed
 * - on_hold
 * - dropped
 * - plan_to_watch
 * 
     * @param sort Valid values:
 *
 * | Value | Order |
 * | ---- | ---- |
 * | `list_score` | Descending |
 * | `list_updated_at` | Descending |
 * | `anime_title` | Ascending |
 * | `anime_start_date` | Descending |
 * | `anime_id` (Under Development) | Ascending |
 * 
     * @param limit The maximum value is 1000.
 * 
     * @param offset 
     * @returns UserAnimeList OK
     * @throws ApiError
     */
    public static usersUserIdAnimelistGet(
userName: string,
status?: string,
sort?: string,
limit: number = 100,
offset?: number,
): CancelablePromise<UserAnimeList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_name}/animelist',
            path: {
                'user_name': userName,
            },
            query: {
                'status': status,
                'sort': sort,
                'limit': limit,
                'offset': offset,
            },
        });
    }

}
