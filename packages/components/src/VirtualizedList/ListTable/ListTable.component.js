import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {
	Table as VirtualizedTable,
	defaultTableRowRenderer as DefaultTableRowRenderer,
} from 'react-virtualized';
import RowSelectionRenderer from '../RowSelection';
import NoRows from '../NoRows';
import { toColumns } from '../utils/tablerow';

import theme from './ListTable.scss';
import rowThemes from './RowThemes';

/**
 * List renderer that renders a react-virtualized Table
 */
function ListTable(props) {
	const {
		children,
		collection,
		height,
		id,
		isActive,
		isSelected,
		onRowClick,
		onRowDoubleClick,
		sort,
		sortBy,
		sortDirection,
		width,
	} = props;

	let RowTableRenderer = DefaultTableRowRenderer;
	if (isActive || isSelected) {
		// eslint-disable-next-line new-cap
		RowTableRenderer = RowSelectionRenderer(DefaultTableRowRenderer, {
			isSelected,
			isActive,
			getRowData: rowProps => rowProps.rowData,
		});
	}

	let onRowClickCallback;
	let onRowDoubleClickCallback;

	if (onRowClick) {
		onRowClickCallback = ({ event, rowData }) => onRowClick(event, rowData);
	}

	if (onRowDoubleClick) {
		onRowDoubleClickCallback = ({ event, rowData }) => onRowDoubleClick(event, rowData);
	}

	return (
		<VirtualizedTable
			className={`tc-list-table ${theme['tc-list-table']}`}
			gridClassName={theme.grid}
			headerHeight={35}
			height={height}
			id={id}
			onRowDoubleClick={onRowDoubleClickCallback}
			onRowClick={onRowClickCallback}
			noRowsRenderer={NoRows}
			rowClassName={classNames(rowThemes)}
			rowCount={collection.length}
			rowGetter={({ index }) => collection[index]}
			rowHeight={50}
			rowRenderer={RowTableRenderer}
			sort={sort}
			sortBy={sortBy}
			sortDirection={sortDirection}
			width={width}
		>
			{toColumns(id, theme, children)}
		</VirtualizedTable>
	);
}
ListTable.displayName = 'VirtualizedList(ListTable)';
ListTable.propTypes = {
	children: PropTypes.arrayOf(PropTypes.element),
	collection: PropTypes.arrayOf(PropTypes.object),
	height: PropTypes.number,
	id: PropTypes.string,
	isActive: PropTypes.func,
	isSelected: PropTypes.func,
	onRowClick: PropTypes.func,
	onRowDoubleClick: PropTypes.func,
	sort: PropTypes.func,
	sortBy: PropTypes.string,
	sortDirection: PropTypes.string,
	width: PropTypes.number,
};

export default ListTable;
