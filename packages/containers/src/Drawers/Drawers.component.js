import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-css-transition';


class Drawers extends React.Component {
	static propTypes = {
	};

	constructor(props) {
		super(props);
	}

	render() {
		const { drawers } = this.props;
		return (
			<CSSTransitionGroup transitionAppear>
				{drawers && drawers.map((drawer, key) => (
					<Drawer.Animation
						key={(drawer.props.route && drawer.props.route.path) || key}
						className="tc-with-drawer-wrapper"
					>
						{drawer}
					</Drawer.Animation>
				))}
			</CSSTransitionGroup>
		);
	}
}

export default Drawers;
