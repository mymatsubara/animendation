/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { magazines } from '../models/magazines';
import type { magazines_query_orderby } from '../models/magazines_query_orderby';
import type { search_query_sort } from '../models/search_query_sort';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MagazinesService {

    /**
     * @param page 
     * @param limit 
     * @param q 
     * @param orderBy 
     * @param sort 
     * @param letter Return entries starting with the given letter
     * @returns magazines Returns magazines collection
     * @throws ApiError
     */
    public static getMagazines(
page?: number,
limit?: number,
q?: string,
orderBy?: magazines_query_orderby,
sort?: search_query_sort,
letter?: string,
): CancelablePromise<magazines> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/magazines',
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
