/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { common_images } from './common_images';

/**
 * Club Resource
 */
export type club = {
    /**
     * MyAnimeList ID
     */
    mal_id?: number;
    /**
     * Club name
     */
    name?: string;
    /**
     * Club URL
     */
    url?: string;
    images?: common_images;
    /**
     * Number of club members
     */
    members?: number;
    /**
     * Club Category
     */
    category?: club.category;
    /**
     * Date Created ISO8601
     */
    created?: string;
    /**
     * Club access
     */
    access?: club.access;
};

export namespace club {

    /**
     * Club Category
     */
    export enum category {
        ACTORS_ARTISTS = 'actors & artists',
        ANIME = 'anime',
        CHARACTERS = 'characters',
        CITIES_NEIGHBORHOODS = 'cities & neighborhoods',
        COMPANIES = 'companies',
        CONVENTIONS = 'conventions',
        GAMES = 'games',
        JAPAN = 'japan',
        MANGA = 'manga',
        MUSIC = 'music',
        OTHERS = 'others',
        SCHOOLS = 'schools',
    }

    /**
     * Club access
     */
    export enum access {
        PUBLIC = 'public',
        PRIVATE = 'private',
        SECRET = 'secret',
    }


}
