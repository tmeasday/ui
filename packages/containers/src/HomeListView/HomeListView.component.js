import PropTypes from 'prop-types';
import React from 'react';
import { Layout } from 'react-talend-components';

import AppHeaderBar from '../AppHeaderBar';
import Drawers from './Drawers';
import List from '../List';
import SidePanel from '../SidePanel';

function getContent(Component, props) {
	if (React.isValidElement(props)) {
		return props;
	}
	return (<Component {...props} />);
}

function HomeListView({ sidepanel, list, header, children }) {
	if (!sidepanel || !list) {
		return null;
	}

	return (
		<Layout
			mode="TwoColumns"
			header={getContent(AppHeaderBar, header)}
			one={getContent(SidePanel, sidepanel)}
		>
			{getContent(List, list)}
			<Drawers view="drawers" />
		</Layout>
	);
}

HomeListView.displayName = 'HomeListView';
HomeListView.propTypes = {
	header: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.object,
	]),
	sidepanel: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.object,
	]).isRequired,
	list: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.object,
	]).isRequired,
	children: PropTypes.node,
};

export default HomeListView;
