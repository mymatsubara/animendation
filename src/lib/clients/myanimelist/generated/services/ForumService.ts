/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ForumBoards } from '../models/ForumBoards';
import type { ForumTopic } from '../models/ForumTopic';
import type { ForumTopics } from '../models/ForumTopics';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ForumService {

    /**
     * Get forum boards
     * @returns ForumBoards OK
     * @throws ApiError
     */
    public static forumBoardsGet(): CancelablePromise<ForumBoards> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/forum/boards',
        });
    }

    /**
     * Get forum topic detail
     * @param topicId 
     * @param limit 
     * @param offset 
     * @returns ForumTopic OK
     * @throws ApiError
     */
    public static forumTopicGet(
topicId: number,
limit: number = 100,
offset?: number,
): CancelablePromise<ForumTopic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/forum/topic/{topic_id}',
            path: {
                'topic_id': topicId,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
        });
    }

    /**
     * Get forum topics
     * @param boardId 
     * @param subboardId 
     * @param limit 
     * @param offset 
     * @param sort Currently, only "recent" can be set.
     * @param q 
     * @param topicUserName 
     * @param userName 
     * @returns ForumTopics OK
     * @throws ApiError
     */
    public static forumTopicsGet(
boardId?: number,
subboardId?: number,
limit: number = 100,
offset?: number,
sort: string = 'recent',
q?: string,
topicUserName?: string,
userName?: string,
): CancelablePromise<ForumTopics> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/forum/topics',
            query: {
                'board_id': boardId,
                'subboard_id': subboardId,
                'limit': limit,
                'offset': offset,
                'sort': sort,
                'q': q,
                'topic_user_name': topicUserName,
                'user_name': userName,
            },
        });
    }

}
