/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ForumTopicsCreatedBy } from './ForumTopicsCreatedBy';

export type ForumTopicsData = {
id?: number;
title?: string;
created_at?: string;
created_by?: ForumTopicsCreatedBy;
number_of_posts?: number;
last_post_created_at?: string;
last_post_created_by?: ForumTopicsCreatedBy;
is_locked?: boolean;
};
