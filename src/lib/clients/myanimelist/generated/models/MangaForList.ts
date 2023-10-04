/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MangaListStatus } from './MangaListStatus';
import type { PersonRoleEdge } from './PersonRoleEdge';
import type { WorkForList } from './WorkForList';

export type MangaForList = (WorkForList & {
/**
 * - unknown
 * - manga
 * - novel
 * - one_shot
 * - doujinshi
 * - manhwa
 * - manhua
 * - oel
 * 
 */
media_type?: string;
/**
 * Publishing status.
 *
 * - finished
 * - currently_publishing
 * - not_yet_published
 * 
 */
status?: string;
my_list_status?: (Record<string, any> | null & MangaListStatus);
/**
 * If unknown, it is 0.
 * 
 */
num_volumes?: number;
/**
 * If unknown, it is 0.
 * 
 */
num_chapters?: number;
authors?: Array<PersonRoleEdge>;
});
