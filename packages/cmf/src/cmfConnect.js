import React, { PropTypes, createElement } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { connect } from 'react-redux';
import api from './api';

import {
	statePropTypes,
	initState,
	getStateAccessors,
	getStateProps,
} from './componentState';

export function getComponentName(WrappedComponent) {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function getComponentId(componentId, props) {
	if (typeof componentId === 'function') {
		return componentId(props) || 'default';
	} else if (typeof componentId === 'string') {
		return componentId;
	} else if (props.componentId) {
		return props.componentId;
	}
	return 'default';
}

export function getStateToProps({
	componentId,
	ownProps,
	state,
	mapStateToProps,
	WrappedComponent,
}) {
	const cmfProps = getStateProps(
		state,
		getComponentName(WrappedComponent),
		getComponentId(componentId, ownProps),
	);
	cmfProps.getCollection = function getCollection(id) {
		return state.cmf.collections.get(id);
	};

	let userProps = {};
	if (mapStateToProps) {
		userProps = mapStateToProps(state, ownProps, cmfProps);
	}

	return { ...cmfProps, ...userProps };
}

export function getDispatchToProps({
	defaultState,
	dispatch,
	componentId,
	mapDispatchToProps,
	ownProps,
	WrappedComponent,
}) {
	const cmfProps = getStateAccessors(
		dispatch,
		getComponentName(WrappedComponent),
		getComponentId(componentId, ownProps),
		defaultState,
	);
	cmfProps.dispatch = dispatch;
	cmfProps.dispatchActionCreator = (actionId, event, data, context) => {
		dispatch(
			api.action.getActionCreatorFunction(
				context,
				actionId,
			)(event, data, context)
		);
	};

	let userProps = {};
	if (mapDispatchToProps) {
		userProps = mapDispatchToProps(dispatch, ownProps, cmfProps);
	}

	return { ...cmfProps, ...userProps };
}

/**
 * this function wrap your component to inject the following:
 * - props.state
 * - props.updateState
 * - props.initState (call it un didMount)
 * - props.getCollection
 * - dispatch(action)
 * - dispatchActionCreator(id, event, data, [context])
 *
 * support for the following props
 * - initialState (called by props.initState)
 * - didMountActionCreator (id or array of id)
 * - willUnMountActionCreator (id or array of id)
 * - componentId (or will use uuid)
 * - keepComponentState (boolean, overrides the keepComponentState defined in container)
 * @return {ReactComponent}
 */
export default function cmfConnect({
		componentId,
		defaultState,
		keepComponentState,
		mapStateToProps,
		mapDispatchToProps,
		mergeProps,
		...rest,
	}) {
	return function wrapWithCMF(WrappedComponent) {
		class CMFContainer extends React.Component {
			static displayName = `CMF(${WrappedComponent.displayName})`;
			static propTypes = Object.assign(
				{},
				...WrappedComponent.propTypes || {},
				...statePropTypes
			);
			static contextTypes = {
				store: PropTypes.object,
				registry: PropTypes.object,
				router: PropTypes.object,
			};
			static WrappedComponent = WrappedComponent;

			constructor(props, context) {
				super(props, context);
				this.dispatchActionCreator = this.dispatchActionCreator.bind(this);
			}

			componentDidMount() {
				initState(this.props);
				if (this.props.didMountActionCreator) {
					this.dispatchActionCreator(
						this.props.didMountActionCreator,
						null,
						this.props,
					);
				}
			}

			componentWillUnmount() {
				if (this.props.willUnmountActionCreator) {
					this.dispatchActionCreator(
						this.props.willUnmountActionCreator,
						null,
						this.props,
					);
				}
				// if the props.keepComponentState is present we have to stick to it
				if (this.props.keepComponentState === false ||
					(this.props.keepComponentState === undefined && !keepComponentState)) {
					this.props.deleteState();
				}
			}

			dispatchActionCreator(actionCreatorId, event, data, context) {
				const extendedContext = Object.assign({}, this.context, context);
				this.props.dispatchActionCreator(actionCreatorId, event, data, extendedContext);
			}

			render() {
				const props = Object.assign({
					state: defaultState,
					dispatchActionCreator: this.dispatchActionCreator,
				}, this.props);
				return createElement(
					WrappedComponent,
					props,
				);
			}
		}
		const Connected = connect(
			(state, ownProps) => getStateToProps({
				componentId,
				ownProps,
				state,
				mapStateToProps,
				WrappedComponent,
			}),
			(dispatch, ownProps) => getDispatchToProps({
				defaultState,
				dispatch,
				componentId,
				mapDispatchToProps,
				ownProps,
				WrappedComponent,
			}),
			mergeProps,
			{ ...rest },
		)(hoistStatics(CMFContainer, WrappedComponent));
		Connected.CMFContainer = CMFContainer;
		return Connected;
	};
}
