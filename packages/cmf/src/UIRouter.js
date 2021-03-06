/**
 * Internal. It contains the wrapper to make react-router run with the CMF
 * settings
 * @module react-cmf/lib/UIRouter
 * @see react-cmf/lib/route
 * @see react-cmf/lib/settings
 */
import PropTypes from 'prop-types';
import React from 'react';
import { Router as BaseRouter } from 'react-router';
import { connect } from 'react-redux';

import api from './api';


 /**
 * @typedef {Object} Router
 */

/**
 * pure arrow function that render the router component.
 * You should never need to use this, it's an internal component
 * @param  {object} props   The waited props (history and routes)
 * @param  {object} context The react context with the registry
 * @return {object} ReactElement
 */
const UIRouter = (props, context) => {
	const routes = api.route.getRoutesFromSettings(context, props.routes);
	if (routes.path === '/' && !!routes.component) {
		return (<BaseRouter routes={routes} history={props.history} />);
	}
	return (
		<div className="is-loading">loading</div>
	);
};

UIRouter.propTypes = {
	history: PropTypes.object,
	routes: PropTypes.object,
};
UIRouter.contextTypes = {
	registry: PropTypes.object,
};
const mapStateToProps = state => ({ routes: state.cmf.settings.routes });
export default connect(
	mapStateToProps
)(UIRouter);
