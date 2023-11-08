import type { AnimeInfo } from '$lib/trpc/routes/anime';
import type { ListAnime } from '$lib/trpc/routes/animelist';
import type { MangaInfo } from '$lib/trpc/routes/manga';
import type { ListManga } from '$lib/trpc/routes/mangalist';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export type AnimeFromList = ListAnime & { username: string };
export type MangaFromList = ListManga & { username: string };
export interface IDBSchema extends DBSchema {
	animelist: {
		key: string;
		value: AnimeFromList;
		indexes: {
			username: string;
		};
	};
	mangalist: {
		key: string;
		value: MangaFromList;
		indexes: {
			username: string;
		};
	};
	animes: {
		key: number;
		value: AnimeInfo;
	};
	mangas: {
		key: number;
		value: MangaInfo;
	};
}

export type IDB = IDBPDatabase<IDBSchema>;
let db: IDB;

export const indexedDb = async () => {
	if (!db) {
		db = await openDB<IDBSchema>('animendation', 4, {
			upgrade: async (db, oldVersion, newVersion, transaction, event) => {
				console.log('upgrade triggered');
				for (let store of db.objectStoreNames) {
					db.clear(store);
				}

				switch (newVersion) {
					case 4:
						const mangalistStore = db.createObjectStore('mangalist', {
							keyPath: ['id', 'username'],
						});
						mangalistStore.createIndex('username', 'username');
						console.log('Updated to idb version 4');
					case 3:
						db.createObjectStore('mangas', {
							keyPath: 'id',
						});
						console.log('Updated to idb version 3');
					case 2:
						db.createObjectStore('animes', {
							keyPath: 'id',
						});
						console.log('Updated to idb version 2');
					case 1:
						const animelistStore = db.createObjectStore('animelist', {
							keyPath: ['id', 'username'],
						});
						animelistStore.createIndex('username', 'username');
						console.log('Updated to idb version 1');
				}
			},
		});
	}

	return db;
};
