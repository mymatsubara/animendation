import { groupBy, maxStr, toRecord } from '$lib/utils/array';
import { describe, expect, it } from 'vitest';

describe('Array utils', () => {
	it('should group by correctly', () => {
		const person1 = { gender: 'male', name: 'Tony' };
		const person2 = { gender: 'female', name: 'Alice' };
		const person3 = { gender: 'female', name: 'Jaice' };
		const person4 = { gender: 'male', name: 'Murilo' };

		const array = [person1, person2, person3, person4];

		const result = groupBy(array, (person) => person.gender);

		expect(result).toStrictEqual({
			male: [person1, person4],
			female: [person2, person3]
		});
	});

	it('should convert to record correctly', () => {
		const person1 = { gender: 'male', name: 'Tony' };
		const person2 = { gender: 'female', name: 'Alice' };
		const person3 = { gender: 'female', name: 'Jaice' };
		const person4 = { gender: 'male', name: 'Murilo' };

		const array = [person1, person2, person3, person4];

		const result = toRecord(array, (person) => person.gender);

		expect(result).toStrictEqual({
			male: person4,
			female: person3
		});
	});

	it('should find max array string', () => {
		const a = { name: 'a' };
		const b = { name: 'b' };
		const c = { name: 'c' };
		const array = [a, c, b];

		const result = maxStr(array, (e) => e.name);

		expect(result).toBe(c);
	});
});
