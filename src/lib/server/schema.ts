import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const Gender = {
	male: 'male',
	female: 'female',
	other: 'other'
} as const;
export type Gender = typeof Gender[keyof typeof Gender];
export type Person = {
	id: Generated<number>;
	firstName: string;
	gender: Gender;
};
export type DB = {
	Person: Person;
};
