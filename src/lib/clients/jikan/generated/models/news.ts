/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { common_images } from './common_images';

export type news = {
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
 * Forum topic URL
 */
forum_url?: string;
images?: common_images;
/**
 * Comment count
 */
comments?: number;
/**
 * Excerpt
 */
excerpt?: string;
}>;
};
