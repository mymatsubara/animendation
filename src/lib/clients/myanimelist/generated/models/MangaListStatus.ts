/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type MangaListStatus = {
    /**
     * - reading
 * - completed
 * - on_hold
 * - dropped
 * - plan_to_read
 * 
     */
    status?: string | null;
    /**
     * 0-10
 * 
     */
    score?: number;
    /**
     * 0 or the number of read volumes.
 * 
     */
    num_volumes_read?: number;
    /**
     * 0 or the number of read chapters.
 * 
     */
    num_chapters_read?: number;
    /**
     * If authorized user reads an manga again after completion, this field value is true.
 *
 * In this case, MyAnimeList treats the manga as 'reading' in the user's manga list.
 * 
     */
    is_rereading?: boolean;
    start_date?: string | null;
    finish_date?: string | null;
    priority?: number;
    num_times_reread?: number;
    reread_value?: number;
    tags?: Array<string>;
    /**
     * You cannot contain this field in a list.
 * 
     */
    comments?: string;
    updated_at?: string;
};
