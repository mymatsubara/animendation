/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AnimeForList } from './AnimeForList';
import type { List } from './List';
import type { RankingInfo } from './RankingInfo';

export type AnimeListForRanking = ({
data?: Array<{
node?: AnimeForList;
ranking?: RankingInfo;
}>;
} & List);
