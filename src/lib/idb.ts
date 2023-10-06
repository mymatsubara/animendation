import type { ListAnime } from '$lib/trpc/routes/user';
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
}

export type IDB = IDBPDatabase<IDBSchema>;
let db: IDB;

export const indexedDb = async () => {
	if (!db) {
		db = await openDB<IDBSchema>('animendation', undefined, {
			upgrade: async (db, oldVersion, newVersion, transaction, event) => {
				console.log('upgrade triggered');
				for (let store of db.objectStoreNames) {
					db.clear(store);
				}

				switch (newVersion) {
					case 1:
						const store = db.createObjectStore('animelist', {
							keyPath: ['id', 'username']
						});
						store.createIndex('username', 'username');
						console.log('Updated to idb version 1');
				}
			}
		});
	}

	return db;
};
