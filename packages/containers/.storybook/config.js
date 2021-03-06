import 'babel-polyfill';
import { action, storiesOf, configure, setAddon } from '@storybook/react';
import cmf from 'react-storybook-cmf';
import mock from '@talend/react-cmf/lib/mock';
import { api } from '@talend/react-cmf';
import { List, Map } from 'immutable';
import '@talend/bootstrap-theme/src/theme/theme.scss';
import ObjectViewer from '../src/ObjectViewer';
import examples from '../examples';

setAddon({ addWithCMF: cmf.addWithCMF });

const actionLogger = action('dispatch');
const reducer = (state = {}, a) => {
	actionLogger(a);
	return state;
};

function objectView(event, data) {
	return {
		type: 'OBJECT_VIEW',
		...data,
	};
}

function hideDialog(event, data) {
	return {
		type: 'HIDE_DIALOG',
		...data,
	};
}

function confirmDialog(event, data) {
	return {
		type: 'CONFIRM_DIALOG',
		...data,
	};
}

function chooseItem1(event, data) {
	return {
		type: 'CHOOSE_ITEM1',
		...data,
	};
}

function chooseItem2() {
	return {
		type: 'CHOOSE_ITEM2',
	};
}

api.component.register('ObjectViewer', ObjectViewer);

const registerActionCreator = api.action.registerActionCreator;
registerActionCreator('object:view', objectView);
registerActionCreator('cancel:hide:dialog', hideDialog);
registerActionCreator('confirm:dialog', confirmDialog);
registerActionCreator('item1:action', chooseItem1);
registerActionCreator('item2:action', chooseItem2);

const isTrueExpressionAction = action('isTrueExpression');
api.expression.register('isTrueExpression', (context, first) => {
	isTrueExpressionAction(context, first);
	return !!first;
});

api.expression.register('getItems', () => [
	{
		label: 'label1',
		actionCreator: 'item1:action',
	},
	{
		label: 'label2',
		actionCreator: 'item2:action',
	},
]);

const modelHasLabelAction = action('modelHasLabel');
api.expression.register('modelHasLabel', context => {
	modelHasLabelAction(context);
	return !!context.payload.model.label;
});

function loadStories() {
	Object.keys(examples).forEach(example => {
		const state = mock.state();
		state.cmf.collections = state.cmf.collections.set(
			'myResourceType',
			List([Map({ id: 'myID', label: 'myLabel' })]),
		);
		state.cmf.collections = state.cmf.collections.set(
			'with',
			new Map({
				data: List([
					new Map({
						id: 1,
						label: 'foo',
						author: 'Jacques',
						created: '10/12/2013',
						modified: '13/02/2015',
						children: new List([new Map({ id: 11, label: 'sub foo' })]),
					}),
					new Map({
						id: 2,
						label: 'bar',
						author: 'Paul',
						created: '10/12/2013',
						modified: '13/02/2015',
						children: new List([new Map({ id: 21, label: 'sub bar' })]),
					}),
					new Map({
						id: 3,
						label: 'baz',
						author: 'Boris',
						created: '10/12/2013',
						modified: '13/02/2015',
						children: new List([new Map({ id: 31, label: 'sub baz' })]),
					}),
					new Map({
						id: 4,
						label: 'extra',
						author: 'Henri',
						created: '10/12/2013',
						modified: '13/02/2015',
						children: new List([new Map({ id: 41, label: 'sub extra' })]),
					}),
					new Map({
						id: 5,
						label: 'hello world',
						author: 'David',
						created: '10/12/2013',
						modified: '13/02/2015',
					}),
				]),
			}),
		);
		state.cmf.settings.views.appheaderbar = {
			app: 'Hello Test',
		};
		state.cmf.settings.views['HeaderBar#default'] = {
			logo: { name: 'appheaderbar:logo', isFull: true },
			brand: { label: 'DATA STREAMS' },
			notification: { name: 'appheaderbar:notification' },
		};
		const actions = state.cmf.settings.actions;
		actions['appheaderbar:logo'] = {
			icon: 'talend-logo',
		};
		actions['appheaderbar:notification'] = {
			icon: 'talend-world',
		};
		actions['menu:first'] = {
			label: 'First',
			icon: 'talend-streams',
			payload: {
				type: 'MENU_',
			},
		};
		actions['menu:second'] = {
			label: 'Second',
			icon: 'talend-dataprep',
			payload: {
				type: 'MENU_',
			},
		};
		actions['menu:third'] = {
			label: 'Configuration',
			icon: 'talend-cog',
			payload: {
				type: 'MENU_',
			},
		};
		actions['menu:fourth'] = {
			label: 'Upload',
			icon: 'talend-upload',
			displayMode: 'file',
			payload: {
				type: 'UPLOAD',
			},
		};
		actions['object:add'] = {
			label: 'Add',
			icon: 'talend-plus-circle',
			bsStyle: 'primary',
			payload: {
				type: 'APP_OBJECT_ADD',
			},
		};
		actions['object:upload'] = {
			label: 'Upload',
			icon: 'talend-upload',
			displayMode: 'file',
			payload: {
				type: 'UPLOAD',
			},
		};
		actions['object:edit'] = {
			label: 'Edit',
			icon: 'talend-pencil',
			payload: {
				type: 'APP_OBJECT_EDIT',
			},
		};
		actions['object:delete'] = {
			label: 'Delete',
			icon: 'talend-trash',
			payload: {
				type: 'APP_OBJECT_DELETE',
			},
		};
		actions['object:confirm:dialog'] = {
			label: 'Remove',
			bsStyle: 'primary',
			id: 'object:confirm:dialog',
			actionCreator: 'confirm:dialog',
		};
		actions['object:hide:dialog'] = {
			label: 'Cancel',
			id: 'object:hide:dialog',
			actionCreator: 'cancel:hide:dialog',
		};
		actions['menu:items'] = {
			id: 'menu:items',
			displayMode: 'dropdown',
			label: 'my items',
			itemsExpression: 'getItems',
			actionCreator: 'object:view',
		};
		actions['menu:items-id'] = {
			id: 'menu:items-id',
			displayMode: 'dropdown',
			label: 'my items',
			actionIds: ['menu:first', 'menu:second'],
			actionCreator: 'object:view',
		};
		actions['menu:href'] = {
			id: 'menu:href',
			label: 'Talend',
			target: '_blank',
			href: '//www.talend.com',
		};
		actions['menu:dropdown-href'] = {
			id: 'menu:dropdown-href',
			displayMode: 'dropdown',
			label: 'my items',
			actionIds: ['menu:href'],
			actionCreator: 'object:view',
		};
		actions['dialog:delete:validate'] = {
			id: 'dialog:delete:validate',
			label: 'Yes',
			bsStyle: 'danger',
			actionCreator: 'confirm:dialog',
		};
		actions['dialog:delete:cancel'] = {
			id: 'dialog:delete:cancel',
			label: 'No',
			actionCreator: 'cancel:hide:dialog',
		};

		const story = storiesOf(example);

		if (typeof examples[example] === 'function') {
			story.addWithCMF('Default', examples[example], {
				state,
				reducer,
			});
		} else {
			Object.keys(examples[example]).forEach(usecase => {
				story.addWithCMF(usecase, examples[example][usecase], {
					state,
					reducer,
				});
			});
		}
	});
}

configure(loadStories, module);
