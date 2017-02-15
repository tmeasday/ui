import api from '../src/api/api';

describe('CMF api', () => {
	it('provide action, route access', () => {
		expect(typeof api.action).toBe('object');
	});
});
