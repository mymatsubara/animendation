/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { anime } from '../models/anime';
import type { anime_characters } from '../models/anime_characters';
import type { anime_episode } from '../models/anime_episode';
import type { anime_episodes } from '../models/anime_episodes';
import type { anime_full } from '../models/anime_full';
import type { anime_news } from '../models/anime_news';
import type { anime_reviews } from '../models/anime_reviews';
import type { anime_search } from '../models/anime_search';
import type { anime_search_query_orderby } from '../models/anime_search_query_orderby';
import type { anime_search_query_rating } from '../models/anime_search_query_rating';
import type { anime_search_query_status } from '../models/anime_search_query_status';
import type { anime_search_query_type } from '../models/anime_search_query_type';
import type { anime_staff } from '../models/anime_staff';
import type { anime_statistics } from '../models/anime_statistics';
import type { anime_themes } from '../models/anime_themes';
import type { anime_userupdates } from '../models/anime_userupdates';
import type { anime_videos } from '../models/anime_videos';
import type { anime_videos_episodes } from '../models/anime_videos_episodes';
import type { entry_recommendations } from '../models/entry_recommendations';
import type { external_links } from '../models/external_links';
import type { forum } from '../models/forum';
import type { moreinfo } from '../models/moreinfo';
import type { pictures_variants } from '../models/pictures_variants';
import type { relation } from '../models/relation';
import type { search_query_sort } from '../models/search_query_sort';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AnimeService {

    /**
     * @param id 
     * @returns any Returns complete anime resource data
     * @throws ApiError
     */
    public static getAnimeFullById(
id: number,
): CancelablePromise<{
data?: anime_full;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/full',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns any Returns anime resource
     * @throws ApiError
     */
    public static getAnimeById(
id: number,
): CancelablePromise<{
data?: anime;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns anime_characters Returns anime characters resource
     * @throws ApiError
     */
    public static getAnimeCharacters(
id: number,
): CancelablePromise<anime_characters> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/characters',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns anime_staff Returns anime staff resource
     * @throws ApiError
     */
    public static getAnimeStaff(
id: number,
): CancelablePromise<anime_staff> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/staff',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @param page 
     * @returns anime_episodes Returns a list of anime episodes
     * @throws ApiError
     */
    public static getAnimeEpisodes(
id: number,
page?: number,
): CancelablePromise<anime_episodes> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/episodes',
            path: {
                'id': id,
            },
            query: {
                'page': page,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @param episode 
     * @returns any Returns a single anime episode resource
     * @throws ApiError
     */
    public static getAnimeEpisodeById(
id: number,
episode: number,
): CancelablePromise<{
data?: anime_episode;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/episodes/{episode}',
            path: {
                'id': id,
                'episode': episode,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @param page 
     * @returns anime_news Returns a list of news articles related to the entry
     * @throws ApiError
     */
    public static getAnimeNews(
id: number,
page?: number,
): CancelablePromise<anime_news> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/news',
            path: {
                'id': id,
            },
            query: {
                'page': page,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @param filter Filter topics
     * @returns forum Returns a list of forum topics related to the entry
     * @throws ApiError
     */
    public static getAnimeForum(
id: number,
filter?: 'all' | 'episode' | 'other',
): CancelablePromise<forum> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/forum',
            path: {
                'id': id,
            },
            query: {
                'filter': filter,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns anime_videos Returns videos related to the entry
     * @throws ApiError
     */
    public static getAnimeVideos(
id: number,
): CancelablePromise<anime_videos> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/videos',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @param page 
     * @returns anime_videos_episodes Returns episode videos related to the entry
     * @throws ApiError
     */
    public static getAnimeVideosEpisodes(
id: number,
page?: number,
): CancelablePromise<anime_videos_episodes> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/videos/episodes',
            path: {
                'id': id,
            },
            query: {
                'page': page,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns pictures_variants Returns pictures related to the entry
     * @throws ApiError
     */
    public static getAnimePictures(
id: number,
): CancelablePromise<pictures_variants> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/pictures',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns anime_statistics Returns anime statistics
     * @throws ApiError
     */
    public static getAnimeStatistics(
id: number,
): CancelablePromise<anime_statistics> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/statistics',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns moreinfo Returns anime statistics
     * @throws ApiError
     */
    public static getAnimeMoreInfo(
id: number,
): CancelablePromise<moreinfo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/moreinfo',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns entry_recommendations Returns anime recommendations
     * @throws ApiError
     */
    public static getAnimeRecommendations(
id: number,
): CancelablePromise<entry_recommendations> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/recommendations',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @param page 
     * @returns anime_userupdates Returns a list of users who have added/updated/removed the entry on their list
     * @throws ApiError
     */
    public static getAnimeUserUpdates(
id: number,
page?: number,
): CancelablePromise<anime_userupdates> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/userupdates',
            path: {
                'id': id,
            },
            query: {
                'page': page,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @param page 
     * @param preliminary Any reviews left during an ongoing anime/manga, those reviews are tagged as preliminary. Preliminary reviews are not returned by default. e.g usage: `?preliminary=true`
     * @param spoiler Any reviews that are tagged as a spoiler. Spoiler reviews are not returned by default. e.g usage: `?spoiler=true`
     * @returns anime_reviews Returns anime reviews
     * @throws ApiError
     */
    public static getAnimeReviews(
id: number,
page?: number,
preliminary?: boolean,
spoiler?: boolean,
): CancelablePromise<anime_reviews> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/reviews',
            path: {
                'id': id,
            },
            query: {
                'page': page,
                'preliminary': preliminary,
                'spoiler': spoiler,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns any Returns anime relations
     * @throws ApiError
     */
    public static getAnimeRelations(
id: number,
): CancelablePromise<{
data?: Array<relation>;
}> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/relations',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id 
     * @returns anime_themes Returns anime themes
     * @throws ApiError
     */
    public static getAnimeThemes(
id: number,
): CancelablePromise<anime_themes> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/themes',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns external_links Returns anime external links
     * @throws ApiError
     */
    public static getAnimeExternal(
id: number,
): CancelablePromise<external_links> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/external',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param id 
     * @returns external_links Returns anime streaming links
     * @throws ApiError
     */
    public static getAnimeStreaming(
id: number,
): CancelablePromise<external_links> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime/{id}/streaming',
            path: {
                'id': id,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

    /**
     * @param unapproved This is a flag. When supplied it will include entries which are unapproved. Unapproved entries on MyAnimeList are those that are user submitted and have not yet been approved by MAL to show up on other pages. They will have their own specifc pages and are often removed resulting in a 404 error. You do not need to pass a value to it. e.g usage: `?unapproved`
     * @param page 
     * @param limit 
     * @param q 
     * @param type 
     * @param score 
     * @param minScore Set a minimum score for results.
     * @param maxScore Set a maximum score for results
     * @param status 
     * @param rating 
     * @param sfw Filter out Adult entries
     * @param genres Filter by genre(s) IDs. Can pass multiple with a comma as a delimiter. e.g 1,2,3
     * @param genresExclude Exclude genre(s) IDs. Can pass multiple with a comma as a delimiter. e.g 1,2,3
     * @param orderBy 
     * @param sort 
     * @param letter Return entries starting with the given letter
     * @param producers Filter by producer(s) IDs. Can pass multiple with a comma as a delimiter. e.g 1,2,3
     * @param startDate Filter by starting date. Format: YYYY-MM-DD. e.g `2022`, `2005-05`, `2005-01-01`
     * @param endDate Filter by ending date. Format: YYYY-MM-DD. e.g `2022`, `2005-05`, `2005-01-01`
     * @returns anime_search Returns search results for anime
     * @throws ApiError
     */
    public static getAnimeSearch(
unapproved?: boolean,
page?: number,
limit?: number,
q?: string,
type?: anime_search_query_type,
score?: number,
minScore?: number,
maxScore?: number,
status?: anime_search_query_status,
rating?: anime_search_query_rating,
sfw?: boolean,
genres?: string,
genresExclude?: string,
orderBy?: anime_search_query_orderby,
sort?: search_query_sort,
letter?: string,
producers?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<anime_search> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/anime',
            query: {
                'unapproved': unapproved,
                'page': page,
                'limit': limit,
                'q': q,
                'type': type,
                'score': score,
                'min_score': minScore,
                'max_score': maxScore,
                'status': status,
                'rating': rating,
                'sfw': sfw,
                'genres': genres,
                'genres_exclude': genresExclude,
                'order_by': orderBy,
                'sort': sort,
                'letter': letter,
                'producers': producers,
                'start_date': startDate,
                'end_date': endDate,
            },
            errors: {
                400: `Error: Bad request. When required parameters were not supplied.`,
            },
        });
    }

}
