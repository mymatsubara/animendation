/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ForumTopicPoll } from './ForumTopicPoll';
import type { ForumTopicPost } from './ForumTopicPost';

export type ForumTopicData = {
title?: string;
posts?: Array<ForumTopicPost>;
poll?: Array<ForumTopicPoll> | null;
};
