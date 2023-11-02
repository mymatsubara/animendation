import type { AnimeInfo } from '$lib/trpc/routes/anime';
import type { ListAnime } from '$lib/trpc/routes/animelist';
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export type AnimelistAnime = ListAnime & { username: string };
export interface IDBSchema extends DBSchema {
	animelist: {
		key: string;
		value: AnimelistAnime;
		indexes: {
			username: string;
		};
	};
	animes: {
		key: number;
		value: AnimeInfo;
	};
}

export type IDB = IDBPDatabase<IDBSchema>;
let db: IDB;

export const indexedDb = async () => {
	if (!db) {
		db = await openDB<IDBSchema>('animendation', 2, {
			upgrade: async (db, oldVersion, newVersion, transaction, event) => {
				console.log('upgrade triggered');
				for (let store of db.objectStoreNames) {
					db.clear(store);
				}

				switch (newVersion) {
					case 2:
						db.createObjectStore('animes', {
							keyPath: 'id'
						});
						console.log('Updated to idb version 2');
					case 1:
						const animelistStore = db.createObjectStore('animelist', {
							keyPath: ['id', 'username']
						});
						animelistStore.createIndex('username', 'username');
						console.log('Updated to idb version 1');
				}
			}
		});
	}

	return db;
};
