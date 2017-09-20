import React from 'react';
import { shallow } from 'enzyme';

import Drawers from './Drawers.component';

describe('Drawers', () => {
	it('should render', () => {
		const wrapper = shallow(
			<Drawers />
		);
		expect(wrapper).toMatchSnapshot();
	});
});
