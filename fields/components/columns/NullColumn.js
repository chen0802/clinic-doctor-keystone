import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var NullColumn = React.createClass({
	displayName: 'nullColumn',
	propTypes: {
	},
	render () {
		return (
			<ItemsTableCell className="hidden">
				
			</ItemsTableCell>
		);
	},
});

module.exports = NullColumn;
