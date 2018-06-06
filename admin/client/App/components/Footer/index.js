/**
 * The global Footer, displays a link to the website and the current Keystone
 * version in use
 */

import React from 'react';
import { css } from 'glamor';
import { Container } from '../../elemental';
import theme from '../../../theme';

var Footer = React.createClass({
	displayName: 'Footer',
	propTypes: {
		appname: React.PropTypes.string,
		appversion: React.PropTypes.string,
		backUrl: React.PropTypes.string,
		brandUrl: React.PropTypes.string,
		brand: React.PropTypes.string,
		version: React.PropTypes.string,
	},
	
	render () {
		const { appname, backUrl, brand, brandUrl, appversion, version } = this.props;

		return (
			<footer className={css(classes.footer)} data-keystone-footer>
				<Container>
					<a
						href={brandUrl}
						tabIndex="-1"
						className={css(classes.link)}
					>
						{ appname + (appversion ? (' (' + appversion + ' ) ') : '') + brand }
					</a>
				</Container>
			</footer>
		);
	},
});

/* eslint quote-props: ["error", "as-needed"] */
const linkHoverAndFocus = {
	color: theme.color.gray60,
	outline: 'none',
};
const classes = {
	footer: {
		boxShadow: '0 -1px 0 rgba(0, 0, 0, 0.1)',
		color: theme.color.gray40,
		fontSize: theme.font.size.small,
		paddingBottom: 30,
		paddingTop: 40,
		textAlign: 'center',
	},
	link: {
		color: theme.color.gray60,

		':hover': linkHoverAndFocus,
		':focus': linkHoverAndFocus,
	},
};

module.exports = Footer;
