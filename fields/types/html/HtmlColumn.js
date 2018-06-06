import React from 'react';
import SanitizedHTML from 'react-sanitized-html';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

const moreIndicatorStyle = {
	color: '#bbb',
	fontSize: '.8rem',
	fontWeight: 500,
	marginLeft: 8,
};

var HtmlColumn = React.createClass({
	displayName: 'HtmlColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	
	renderValue (value) {
		if (!value) return;
		return (
			<SanitizedHTML 
				allowedAttributes={{ 'a': ['href', 'onclick'] }}
  				allowedTags={['a']}
				html={ value } />
		);
	},
	render () {
		const value = this.props.data.fields[this.props.col.path];
		return (
			<ItemsTableCell>
				{this.renderValue(value)}
			</ItemsTableCell>
		);
	},
});

module.exports = HtmlColumn;
