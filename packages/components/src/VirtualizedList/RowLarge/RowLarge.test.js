import React from 'react';
import { shallow } from 'enzyme';

import RowLarge from './RowLarge.component';
import VirtualizedList from '../VirtualizedList.component';
import CellTitle from '../CellTitle';

const onRowDoubleClick = jest.fn();
const onRowClick = jest.fn();

const titleProps = {
	actionsKey: 'titleActions',
	displayModeKey: 'display',
	iconKey: 'icon',
};

const titleActions = [
	{
		label: 'edit',
		icon: 'talend-pencil',
		onClick: jest.fn(),
	},
	{
		label: 'delete',
		icon: 'talend-trash',
		onClick: jest.fn(),
	},
];

const collection = [
	{
		id: 0,
		name: 'Title from first item',
		description: 'This comes from first element in collection',
		titleActions,
	},
	{
		id: 1,
		name: 'Title from second item',
		description: 'This comes from second element in collection',
		titleActions,
	},
];

const parent = {
	props: {
		id: 'my-list',
		collection,
		rowGetter: index => collection[index],
		onRowClick,
		onRowDoubleClick,
		children: [
			<VirtualizedList.Content label="Id" dataKey="id" width={50} flexShrink={0} flexGrow={0} />,
			<VirtualizedList.Content
				label="Name"
				dataKey="name"
				width={350}
				flexShrink={0}
				flexGrow={0}
				columnData={titleProps}
				{...CellTitle}
			/>,
			<VirtualizedList.Content
				label="Description"
				dataKey="name"
				width={350}
				flexShrink={0}
				flexGrow={0}
			/>,
		],
	},
};

describe('RowLarge', () => {
	it('should render large row', () => {
		// when
		const wrapper = shallow(
			<RowLarge
				className={'my-class-names'}
				index={1}
				key={18}
				parent={parent}
				style={{ background: 'red' }}
			/>,
		);

		// then
		expect(wrapper.node).toMatchSnapshot();
	});

	it('should trigger an event when user click on a row or double click', () => {
		// when
		const wrapper = shallow(
			<RowLarge
				className={'my-class-names'}
				index={1}
				key={18}
				parent={parent}
				onRowClick={onRowClick}
				onRowDoubleClick={onRowDoubleClick}
				style={{ background: 'red' }}
			/>,
		);

		wrapper.find('.tc-list-large').simulate('click');
		wrapper.find('.tc-list-large').simulate('doubleclick');

		// then
		expect(onRowClick.mock.calls[0][1]).toEqual(collection[1]);
		expect(onRowDoubleClick.mock.calls[0][1]).toEqual(collection[1]);
	});
});
