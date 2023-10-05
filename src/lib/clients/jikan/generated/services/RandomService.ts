/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { anime } from '../models/anime';
import type { character } from '../models/character';
import type { manga } from '../models/manga';
import type { person } from '../models/person';
import type { user_profile } from '../models/user_profile';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RandomService {

    /**
     * @returns any Returns a random anime resource
     * @throws ApiError
     */
    public static getRandomAnime(): CancelablePromise<{
data?: anime;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/random/anime',
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @returns any Returns a random manga resource
     * @throws ApiError
     */
    public static getRandomManga(): CancelablePromise<{
data?: manga;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/random/manga',
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @returns any Returns a random character resource
     * @throws ApiError
     */
    public static getRandomCharacters(): CancelablePromise<{
data?: character;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/random/characters',
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @returns any Returns a random person resource
     * @throws ApiError
     */
    public static getRandomPeople(): CancelablePromise<{
data?: person;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/random/people',
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @returns any Returns a random user profile resource
     * @throws ApiError
     */
    public static getRandomUsers(): CancelablePromise<{
data?: user_profile;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/random/users',
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

}
