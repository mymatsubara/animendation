/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnimeForList } from './AnimeForList';
import type { AnimeRecommendationAggregationEdgeBase } from './AnimeRecommendationAggregationEdgeBase';
import type { AnimeStatistics } from './AnimeStatistics';
import type { Picture } from './Picture';
import type { RelatedAnimeEdge } from './RelatedAnimeEdge';
import type { RelatedMangaEdge } from './RelatedMangaEdge';

export type AnimeForDetails = (AnimeForList & {
/**
 * You cannot contain this field in a list.
 * 
 */
pictures?: Array<Picture>;
/**
 * The API strips BBCode tags from the result.
 *
 * You cannot contain this field in a list.
 * 
 */
background?: string | null;
/**
 * You cannot contain this field in a list.
 * 
 */
related_anime?: Array<RelatedAnimeEdge>;
/**
 * You cannot contain this field in a list.
 * 
 */
related_manga?: Array<RelatedMangaEdge>;
/**
 * Summary of recommended anime for those who like this anime.
 *
 * You cannot contain this field in a list.
 * 
 */
recommendations?: Array<AnimeRecommendationAggregationEdgeBase>;
statistics?: (Record<string, any> | null & AnimeStatistics);
});
