/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MangaListStatus } from '../models/MangaListStatus';
import type { UserMangaList } from '../models/UserMangaList';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserMangalistService {

    /**
     * Update my manga list status
     * Add specified manga to my manga list.
 *
 * If specified manga already exists, update its status.
 *
 * This endpoint updates only values specified by the parameter.
 * 
     * @param mangaId 
     * @param formData 
     * @returns MangaListStatus OK
     * @throws ApiError
     */
    public static mangaMangaIdMyListStatusPut(
mangaId: number,
formData?: {
/**
 * - reading
 * - completed
 * - on_hold
 * - dropped
 * - plan_to_read
 * 
 */
status?: string;
is_rereading?: boolean;
/**
 * 0-10
 */
score?: number;
num_volumes_read?: number;
num_chapters_read?: number;
/**
 * 0-2
 * 
 */
priority?: number;
num_times_reread?: number;
/**
 * 0-5
 * 
 */
reread_value?: number;
tags?: string;
comments?: string;
},
): CancelablePromise<MangaListStatus> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/manga/{manga_id}/my_list_status',
            path: {
                'manga_id': mangaId,
            },
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
        });
    }

    /**
     * Delete my manga list item.
     * If the specified manga does not exist in user's manga list, this endpoint does nothing
 * and returns `404 Not Found`.
 *
 * So be careful when retrying.
 * 
     * @param mangaId 
     * @returns any OK
     * @throws ApiError
     */
    public static mangaMangaIdMyListStatusDelete(
mangaId: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/manga/{manga_id}/my_list_status',
            path: {
                'manga_id': mangaId,
            },
            errors: {
                404: `Not Found`,
            },
        });
    }

    /**
     * Get user manga list
     * @param userName User name or `@me`.
 * 
     * @param status Filters returned manga list by these statuses.
 *
 * To return all manga, don't specify this field.
 *
 * Valid values:
 *
 * - reading
 * - completed
 * - on_hold
 * - dropped
 * - plan_to_read
 * 
     * @param sort Valid values:
 *
 * | Value | Order |
 * | ---- | ---- |
 * | `list_score` | Descending |
 * | `list_updated_at` | Descending |
 * | `manga_title` | Ascending |
 * | `manga_start_date` | Descending |
 * | `manga_id` (Under Development) | Ascending |
 * 
     * @param limit The maximum value is 1000.
 * 
     * @param offset 
     * @returns UserMangaList OK
     * @throws ApiError
     */
    public static usersUserIdMangalistGet(
userName: string,
status?: string,
sort?: string,
limit: number = 100,
offset?: number,
): CancelablePromise<UserMangaList> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_name}/mangalist',
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
