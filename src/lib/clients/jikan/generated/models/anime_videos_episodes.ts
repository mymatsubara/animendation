/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { common_images } from './common_images';
import type { pagination } from './pagination';

/**
 * Anime Videos Episodes Resource
 */
export type anime_videos_episodes = ({
data?: Array<{
/**
 * MyAnimeList ID or Episode Number
 */
mal_id?: number;
/**
 * Episode Title
 */
title?: string;
/**
 * Episode Subtitle
 */
episode?: string;
/**
 * Episode Page URL
 */
url?: string;
images?: common_images;
}>;
} & pagination);
