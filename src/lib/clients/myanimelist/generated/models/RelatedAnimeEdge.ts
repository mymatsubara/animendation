/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnimeForList } from './AnimeForList';

export type RelatedAnimeEdge = {
    node?: AnimeForList;
    /**
     * The type of the relationship between this work and related work.
 *
 * - sequel
 * - prequel
 * - alternative_setting
 * - alternative_version
 * - side_story
 * - parent_story
 * - summary
 * - full_story
 * 
     */
    relation_type?: string;
    /**
     * The format of relation_type for human like "Alternative version".
 * 
     */
    relation_type_formatted?: string;
};
