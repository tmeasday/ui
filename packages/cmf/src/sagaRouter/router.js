/**
 * @module react-cmf/lib/sagaRouter
 * @example
 *	import { sagaRouter } from '@talend/react-cmf';
 *	import { browserHistory as history } from 'react-router';

 *	const CANCEL_ACTION = 'CANCEL_ACTION';
 *	// route configuration, a url fragment match with a generator
 *	const routes = {
 *		"/datasets/add": function* addDataset() {
 *			yield take(CANCEL_ACTION);
 *			yield put({
 *				type: REDIRECT_ADD_DATASET_CANCEL,
 *				cmf: {
 *					routerReplace: "/datasets"
 *				}
 *			});
 *		},
 *		"/connections/:datastoreId/edit/add-dataset": function* addDataset({
 *			datastoreId
 *		}) {
 *			yield take(CANCEL_ACTION);
 *			yield put({
 *				type: REDIRECT_CONNECTION_ADD_DATASET_CANCEL,
 *				cmf: {
 *					routerReplace: `/connections/${datastoreId}/edit`
 *				}
 *			});
 *		}
 *	};
 *	// router saga is forked and given router history, and route configuration
 *	yield fork(routerSaga, history, routes);
 */
import { spawn, take, cancel } from 'redux-saga/effects';
import isEqual from 'lodash/isEqual';

import matchPath from './matchPath';

// TODO: Maybe saga shuld be implemented as a complete Maybe Monad

/**
 * @typedef {Object} Location
 * @param {string} pathname
 */

/**
 * @typedef {Object.<string, number>} RouteParams
 */

/**
 * @typedef {Object.<string, Task>} RunningTasks
 */

/**
 * @function RouteSaga
 * @param {RouteParams} params
 */

/**
 * @typedef {Object} MaybeSaga
 * @property {Task} saga - non optionalref on a Task
 */

/**
 * @typedef {Object.<string, RouteSaga>} RoutesConfig
 */

/**
 * The Match object resulting from matching a saga route fragment and an URL
 * @typedef {Object} Match
 * @property {string} path - the path pattern used to match the saga.
 * @property {string} url - the matched portion of the application URL.
 * @property {boolean} isExact - whether or not the saga matched exactly.
 * @property {RouteParams} params - ad dictionnary of the resolved parameters.
 */

/**
 * Determine if a saga should be restarted with the following rules :
 *
 * @param {MaybeSaga} maybeSaga
 * @param {Match} match
 */
function shouldStartSaga(maybeSaga, match) {
	if (match) {
		if (!maybeSaga || (maybeSaga && maybeSaga.saga && !maybeSaga.saga.isRunning())) {
			return true;
		}
	}
	return false;
}

/**
 * Determine if a saga should be canceled with the following rules :
 *
 * @param {MaybeSaga} maybeSaga
 * @param {Match} match
 */
function shouldCancelSaga(maybeSaga, match) {
	if (maybeSaga && maybeSaga.saga.isRunning()) {
		if (!match) {
			return true;
		}
	}
	return false;
}

/**
 * Determine if a saga should be restarted with the following rules:
 *
 * @param {MaybeSaga} maybeSaga
 * @param {Match} match
 */
function shouldRestartSaga(maybeSaga, match) {
	if (match) {
		if (maybeSaga) {
			if (!isEqual(maybeSaga.match.params, match.params)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * for a route a list of running saga and current location return a
 * match object and a saga
 *
 * @param {string} routeFragments - the route fragment associated to a saga
 * @param {RunningTasks} sagas
 * @param {Location} currentLocation
 * @param {int} index
 */
function parseSagaState(routeFragment, sagas, currentLocation) {
	return {
		match: matchPath(currentLocation.pathname, { path: routeFragment }),
		maybeSaga: sagas[routeFragment],
	};
}

/**
 * responsible to start and cancel saga based on application current url,
 * restart saga if necessary
 * @param {object} history - react router history
 * @param {RoutesConfig} routes
 */
export default function* sagaRouter(history, routes) {
	const sagas = {};
	const routeFragments = Object.keys(routes);
	while (true) {  // eslint-disable-line no-constant-condition
		yield take('@@router/LOCATION_CHANGE');
		const shouldStart = [];
		const currentLocation = history.getCurrentLocation();
		for (let index = 0; index < routeFragments.length; ) {
			const routeFragment = routeFragments[index];
			const { match, maybeSaga } = parseSagaState(routeFragment, sagas, currentLocation);
			if (shouldCancelSaga(maybeSaga, match)) {
				yield cancel(maybeSaga.saga);
			} else if (shouldRestartSaga(maybeSaga, match)) {
				yield cancel(maybeSaga.saga);
				shouldStart.push({ routeFragment, match });
			} else if (shouldStartSaga(maybeSaga, match)) {
				shouldStart.push({ routeFragment, match });
			}
			index += 1;
		}
		for (let index = 0; index < shouldStart.length; ) {
			const { routeFragment, match } = shouldStart[index];
			sagas[routeFragment] = {
				saga: yield spawn(routes[routeFragment], match.params),
				match,
			};
			index += 1;
		}
	}
}
