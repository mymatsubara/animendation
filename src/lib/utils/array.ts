type Key = string | number;

export function groupBy<T>(array: T[], predicate: (e: T) => Key) {
	const result: { [k: Key]: T[] } = {};

	const len = array.length;
	for (let i = 0; i < len; i++) {
		const element = array[i];
		const key = predicate(element);
		let match = result[key];

		if (!match) {
			result[key] = [element];
		} else {
			match.push(element);
		}
	}

	return result;
}

export function toRecord<T>(array: T[], predicate: (e: T) => Key) {
	const result: { [k: Key]: T } = {};

	const len = array.length;
	for (let i = 0; i < len; i++) {
		const element = array[i];
		const key = predicate(element);
		result[key] = element;
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
