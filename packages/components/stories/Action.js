import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import talendIcons from 'talend-icons/dist/react';

import { Action, IconsProvider } from '../src/index';

const icons = {
	'talend-dataprep': talendIcons['talend-dataprep'],
};

const myAction = {
	label: 'Click me',
	icon: 'talend-dataprep',
	onClick: action('You clicked me'),
};

storiesOf('Action', module)
	.addDecorator(story => (
		<div className="col-lg-offset-2 col-lg-8">
			<IconsProvider defaultIcons={icons} />
			{story()}
		</div>
	))
	.addWithInfo('default', () => (
		<div>
			<p>By default :</p>
			<Action id="default" {...myAction} />
			<p>With hideLabel option</p>
			<Action
				id="hidelabel"
				{...myAction}
				hideLabel
			/>
			<p>In progress</p>
			<Action
				id="inprogress"
				{...myAction}
				inProgress
			/>
			<p>Disabled</p>
			<Action
				id="disabled"
				{...myAction}
				disabled
			/>
			<p>Reverse display</p>
			<Action
				id="reverseDisplay"
				{...myAction}
				iconPosition="right"
			/>
			<p>Transform icon</p>
			<Action
				id="reverseDisplay"
				{...myAction}
				iconTransform={'rotate-180'}
			/>
		</div>
	))
	.addWithPropsCombinations('combinations', Action, {
		label: ['Click me'],
		icon: ['talend-dataprep'],
		onClick: [action('You clicked me')],
		hideLabel: [false, true],
		inProgress: [true, false],
		disabled: [false, true],
	});
