/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserBase } from './UserBase';

export type User = (UserBase & {
gender?: string | null;
birthday?: string | null;
location?: string | null;
joined_at?: string;
anime_statistics?: {
num_items_watching?: number;
num_items_completed?: number;
num_items_on_hold?: number;
num_items_dropped?: number;
num_items_plan_to_watch?: number;
num_items?: number;
num_days_watched?: number;
num_days_watching?: number;
num_days_completed?: number;
num_days_on_hold?: number;
num_days_dropped?: number;
/**
 * num_watching_days + num_completed_days + num_on_hold_days + num_dropped_days
 * 
 */
num_days?: number;
num_episodes?: number;
num_times_rewatched?: number;
mean_score?: number;
} | null;
/**
 * for example: "America/Los_Angeles"
 * 
 */
time_zone?: string | null;
is_supporter?: boolean | null;
});
