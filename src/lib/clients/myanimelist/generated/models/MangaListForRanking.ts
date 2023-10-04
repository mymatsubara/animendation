/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { List } from './List';
import type { MangaForList } from './MangaForList';
import type { RankingInfo } from './RankingInfo';

export type MangaListForRanking = ({
data?: Array<{
node?: MangaForList;
ranking?: RankingInfo;
}>;
} & List);
