/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * Get my user information
     * @param userId You can only specify `@me`.
 * 
     * @param fields 
     * @returns User OK
     * @throws ApiError
     */
    public static usersUserIdGet(
userId: string,
fields?: string,
): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_name}',
            path: {
                'user_id': userId,
            },
            query: {
                'fields': fields,
            },
        });
    }

}
