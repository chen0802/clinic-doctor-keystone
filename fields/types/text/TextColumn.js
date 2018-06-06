import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';
import SanitizedHTML from 'react-sanitized-html';

var TextColumn = React.createClass({
	displayName: 'TextColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
		linkTo: React.PropTypes.string,
	},
	getValue () {
		// cropping text is important for textarea, which uses this column
		const value = this.props.data.fields[this.props.col.path];
		return value ? value.substr(0, 300) : null;
	},
	render () {
		const value = this.getValue();
		const empty = !value && this.props.linkTo ? true : false;
		const className = this.props.col.field.monospace ? 'ItemList__value--monospace' : undefined;
		//Check if value starts with URL

		if ( value!= null && value.substring(0, 3 ) == 'URL') {
			var link_values = value.split('|');
			var html_link = '<a href="' + link_values[2] + '">' + link_values[1] + '</a>';
			return (
				<ItemsTableCell>
					<ItemsTableValue className={className} to={this.props.linkTo} empty={empty} padded interior field={this.props.col.type}>
						<SanitizedHTML html={ html_link } />
					</ItemsTableValue>
				</ItemsTableCell>
			);
		}  else {
			return (
				<ItemsTableCell>
					<ItemsTableValue className={className} to={this.props.linkTo} empty={empty} padded interior field={this.props.col.type}>
						{value}
					</ItemsTableValue>
				</ItemsTableCell>
			);
		}
		
	},
});

module.exports = TextColumn;
