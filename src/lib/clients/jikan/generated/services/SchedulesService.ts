/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { schedules } from '../models/schedules';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SchedulesService {

    /**
     * @param page 
     * @param filter Filter by day
     * @param kids When supplied, it will filter entries with the `Kids` Genre Demographic. When supplied as `kids=true`, it will return only Kid entries and when supplied as `kids=false`, it will filter out any Kid entries. Defaults to `false`.
     * @param sfw 'Safe For Work'. When supplied, it will filter entries with the `Hentai` Genre. When supplied as `sfw=true`, it will return only SFW entries and when supplied as `sfw=false`, it will filter out any Hentai entries. Defaults to `false`.
     * @param unapproved This is a flag. When supplied it will include entries which are unapproved. Unapproved entries on MyAnimeList are those that are user submitted and have not yet been approved by MAL to show up on other pages. They will have their own specifc pages and are often removed resulting in a 404 error. You do not need to pass a value to it. e.g usage: `?unapproved`
     * @param limit 
     * @returns schedules Returns weekly schedule
     * @throws ApiError
     */
    public static getSchedules(
page?: number,
filter?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'unknown' | 'other',
kids?: 'true' | 'false',
sfw?: 'true' | 'false',
unapproved?: boolean,
limit?: number,
): CancelablePromise<schedules> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/schedules',
            query: {
                'page': page,
                'filter': filter,
                'kids': kids,
                'sfw': sfw,
                'unapproved': unapproved,
                'limit': limit,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

}
