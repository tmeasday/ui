import React, { PropTypes } from 'react';
import { api } from 'react-cmf';
import { AppHeaderBar, Layout } from 'react-talend-components';
import List from '../List';
import SidePanel from '../SidePanel';

class HomePage extends React.Component {
	static propTypes = {
		appheaderbar: AppHeaderBar.propTypes,
		children: PropTypes.node,
		didMountActionCreator: PropTypes.string,
		dispatch: PropTypes.func.isRequired,
		list: List.propTypes.isRequired,
		mode: Layout.propTypes.mode,
		sidepanel: SidePanel.propTypes.isRequired,
	};

	static contextTypes = {
		registry: PropTypes.object.isRequired,
		router: PropTypes.object.isRequired,
		store: PropTypes.object.isRequired,
	};

	static defaultProps = {
		mode: 'TwoColumns',
	};

	constructor(props, context) {
		super(props, context);
		this.onBrandClick = this.onBrandClick.bind(this);
	}

	componentDidMount() {
		if (this.props.didMountActionCreator) {
			this.props.dispatch(
				api.action.getActionCreatorFunction(
					this.context, this.props.didMountActionCreator
				)()
			);
		}
	}

	onBrandClick() {
		this.props.dispatch({
			type: 'APP_HEADER_BAR_BRAND_CLICK',
			cmf: {
				routerReplace: '/',
			},
		});
	}

	render() {
		if (!this.props.sidepanel || !this.props.list) {
			return null;
		}
		const header = Object.assign({
			brandLink: {
				onClick: this.onBrandClick,
			},
		}, this.props.appheaderbar);

		return (
			<Layout
				header={header}
				mode={this.props.mode}
				one={(<SidePanel {...this.props.sidepanel} />)}
				drawers={[this.props.children]}
			>
				<List {...this.props.list} />
			</Layout>
		);
	}
}

export default HomePage;
