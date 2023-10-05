/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Broadcast Details
 */
export type broadcast = {
    /**
     * Day of the week
     */
    day?: string | null;
    /**
     * Time in 24 hour format
     */
    time?: string | null;
    /**
     * Timezone (Tz Database format https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
     */
    timezone?: string | null;
    /**
     * Raw parsed broadcast string
     */
    string?: string | null;
};
