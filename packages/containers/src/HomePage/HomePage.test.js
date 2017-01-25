import React from 'react';
import renderer from 'react-test-renderer';

import HomePage from './HomePage.component';

describe('HomePage', () => {
	it('should render', () => {
		const wrapper = renderer.create(
			<HomePage />
		).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
});
