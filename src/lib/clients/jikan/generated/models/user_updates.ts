/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { anime_meta } from './anime_meta';
import type { manga_meta } from './manga_meta';

export type user_updates = {
    data?: {
/**
 * Last updated Anime
 */
anime?: Array<({
entry?: anime_meta;
} & {
score?: number | null;
status?: string;
episodes_seen?: number | null;
episodes_total?: number | null;
/**
 * ISO8601 format
 */
date?: string;
})>;
/**
 * Last updated Manga
 */
manga?: Array<({
entry?: manga_meta;
} & {
score?: number | null;
status?: string;
chapters_read?: number | null;
chapters_total?: number | null;
volumes_read?: number | null;
volumes_total?: number | null;
/**
 * ISO8601 format
 */
date?: string;
})>;
};
};
