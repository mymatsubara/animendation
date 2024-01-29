import { isDateValid } from '$lib/utils/date';
import { describe, expect, it } from 'vitest';

describe('Date utils', () => {
	it('should check invalid correctly', () => {
		expect(isDateValid(new Date('2024-01-01'))).toBeTruthy();
		expect(isDateValid(new Date('invalid'))).toBeFalsy();
	});
});
