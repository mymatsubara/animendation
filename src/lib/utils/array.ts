type Key = string | number;

export function groupBy<T>(array: T[], predicate: (e: T) => Key) {
	const result: { [k: Key]: T[] } = {};

	const len = array.length;
	for (let i = 0; i < len; i++) {
		const value = array[i];
		const key = predicate(value);
		let match = result[key];

		if (!match) {
			result[key] = [value];
		} else {
			match.push(value);
		}
	}

	return result;
}

export function toRecord<T>(array: T[], predicate: (v: T) => Key) {
	const result: { [k: Key]: T } = {};

	const len = array.length;
	for (let i = 0; i < len; i++) {
		const value = array[i];
		const key = predicate(value);
		result[key] = value;
	}

	return result;
}

export function toRecordMap<T, O>(array: T[], predicate: (v: T) => Key, map: (v: T) => O) {
	const result: { [k: Key]: O } = {};

	const len = array.length;
	for (let i = 0; i < len; i++) {
		const value = array[i];
		const key = predicate(value);
		result[key] = map(value);
	}

	return result;
}

export function toMap<K, T>(array: T[], predicate: (v: T) => K) {
	const result = new Map<K, T>();

	const len = array.length;
	for (let i = 0; i < len; i++) {
		const value = array[i];
		const key = predicate(value);
		result.set(key, value);
	}

	return result;
}

export function maxStr<T>(array: T[], predicate: (e: T) => string) {
	if (array.length === 0) {
		return undefined;
	}

	let max: T = array[0];
	let maxStr = predicate(max);

	for (let i = 1; i < array.length; i++) {
		const cur = array[i];
		const curStr = predicate(cur);

		if (curStr.localeCompare(maxStr) === 1) {
			max = cur;
			maxStr = curStr;
		}
	}

	return max;
}

export function filterDuplicates<T, K>(array: T[], predicate: (e: T) => K) {
	const seen = new Set<K>();

	return array.filter((element) => {
		const key = predicate(element);

		if (seen.has(key)) {
			return false;
		}

		seen.add(key);
		return true;
	});
}
