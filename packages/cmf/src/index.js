/**
 * @module react-cmf
 */

import App from './components/App';
import ConnectedDispatcher from './components/Dispatcher';
import RegistryProvider from './components/RegistryProvider';
import UIRouter from './components/UIRouter';
import api from './core/api';
import history from './core/history';
import store from './core/store';
import actions from './redux/actions/';
import reducers from './redux/reducers/';
import getErrorMiddleware from './redux/middlewares/error';

const Dispatcher = ConnectedDispatcher;

/**
 * API exported
 * @type {Object}
 * @example
import { api } from 'react-cmf';
api.registry; api.route; api.action;
 * @example
import { App } from 'react-cmf';
 * @example
import { Dispatcher, Icon } from 'react-cmf';
 * @see module:react-cmf/lib/api
 */
export {
	actions,
	api,
	App,
	Dispatcher,
	history,
	store,
	reducers,
	RegistryProvider,
	UIRouter,
	getErrorMiddleware, // (slug) => middleware to post error
};
