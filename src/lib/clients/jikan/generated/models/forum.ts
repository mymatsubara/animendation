/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Forum Resource
 */
export type forum = {
    data?: Array<{
/**
 * MyAnimeList ID
 */
mal_id?: number;
/**
 * MyAnimeList URL
 */
url?: string;
/**
 * Title
 */
title?: string;
/**
 * Post Date ISO8601
 */
date?: string;
/**
 * Author MyAnimeList Username
 */
author_username?: string;
/**
 * Author Profile URL
 */
author_url?: string;
/**
 * Comment count
 */
comments?: number;
/**
 * Last comment details
 */
last_comment?: {
/**
 * Last comment URL
 */
url?: string;
/**
 * Author MyAnimeList Username
 */
author_username?: string;
/**
 * Author Profile URL
 */
author_url?: string;
/**
 * Last comment date posted ISO8601
 */
date?: string | null;
};
}>;
};
