import React from 'react';
import assign from 'object-assign';

import Popout from '../../../shared/Popout';
import PopoutList from '../../../shared/Popout/PopoutList';
import { FormInput } from '../../../elemental';
import ListHeaderButton from './ListHeaderButton';

import { setActiveOptions } from '../actions';

var ListOptionsForm = React.createClass({
	displayName: 'ListOptionsForm',
	getInitialState () {
		return {
			label:'Options',
			selectedOptions: {}
		};
	},
	getSelectedOptionsFromStore () {

		var selectedOptions = {};
		this.props.availableOptions.map(item => {
			selectedOptions[item.param] = false;
		});

		this.props.activeOptions.forEach(param => {
			selectedOptions[param] = true;
		});
		return selectedOptions;
	},
	togglePopout (visible) {
		this.setState({
			selectedOptions: this.getSelectedOptionsFromStore(),
			isOpen: visible
		});
	},
	toggleOption (param, value) {
		const newOptions = assign({}, this.state.selectedOptions);

		// if (value) {
			newOptions[param] = value;
		// } else {
			// delete newOptions[param];
		// }


		this.setState({
			selectedOptions: newOptions,
		});
	},
	applyOptions () {
		var active_keys = [];
		for ( var key in this.state.selectedOptions) {
			if ( this.state.selectedOptions[key] ) {
				active_keys.push(key)
			};
		}
		this.props.dispatch(setActiveOptions(active_keys));
		this.togglePopout(false);
	},
	updateSearch (e) {
		this.setState({ searchString: e.target.value });
	},
	renderOptions () {
		const availableOptions = this.props.availableOptions;
		const { searchString } = this.state;
		
		return availableOptions.map((el, i) => {

			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.content}</PopoutList.Heading>;
			}

			var param = el.param || el ;
			const selected = this.state.selectedOptions[param];

			return (
				<PopoutList.Item
					key={'option_' + el.param}
					icon={ selected ? 'check' : 'dash'}
					isSelected={ !!selected }
					label={el.label}
					onClick={() => { this.toggleOption(param, !selected); }} />
			);
		});
	},
	render () {
		const formFieldStyles = {
			borderBottom: '1px dashed rgba(0,0,0,0.1)',
			marginBottom: '1em',
			paddingBottom: '1em',
		};
		if ( this.props.availableOptions.length > 0 ) {
			return (
				<div>
					<ListHeaderButton
						active={this.state.isOpen}
						id="listHeaderOptionButton"
						glyph="list-unordered"
						label={this.state.label}
						onClick={() => this.togglePopout(!this.state.isOpen)}
					/>
					<Popout isOpen={this.state.isOpen} onCancel={() => this.togglePopout(false)} relativeToID="listHeaderOptionButton">
						<Popout.Body scrollable>
							<PopoutList>
								{this.renderOptions()}
							</PopoutList>
						</Popout.Body>
						<Popout.Footer
							primaryButtonAction={this.applyOptions}
							primaryButtonLabel="Apply"
							secondaryButtonAction={() => this.togglePopout(false)}
							secondaryButtonLabel="Cancel" />
					</Popout>
				</div>
			);	
		} else {
			return (
				<div>
				</div>
			);
		}
	},
});

module.exports = ListOptionsForm;
