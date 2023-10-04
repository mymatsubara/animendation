/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AnimeListStatus = {
    /**
     * - watching
 * - completed
 * - on_hold
 * - dropped
 * - plan_to_watch
 * 
     */
    status?: string | null;
    /**
     * 0-10
 * 
     */
    score?: number;
    /**
     * 0 or the number of watched episodes.
 * 
     */
    num_episodes_watched?: number;
    /**
     * If authorized user watches an anime again after completion, this field value is true.
 *
 * In this case, MyAnimeList treats the anime as 'watching' in the user's anime list.
 * 
     */
    is_rewatching?: boolean;
    start_date?: string | null;
    finish_date?: string | null;
    priority?: number;
    num_times_rewatched?: number;
    rewatch_value?: number;
    tags?: Array<string>;
    /**
     * You cannot contain this field in a list.
 * 
     */
    comments?: string;
    updated_at?: string;
};
