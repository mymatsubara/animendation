import type { AnimeInfo } from '$lib/trpc/routes/anime';
import type { MangaInfo } from '$lib/trpc/routes/manga';

export type Serie = AnimeInfo | MangaInfo;
