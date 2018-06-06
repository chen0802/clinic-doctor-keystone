/**
 * The App component is the component that is rendered around all views, and
 * contains common things like navigation, footer, etc.
 */

import React from 'react';
import { Container } from './elemental';
import { Link } from 'react-router';
import { css } from 'glamor';

import MobileNavigation from './components/Navigation/Mobile';
import PrimaryNavigation from './components/Navigation/Primary';
import SecondaryNavigation from './components/Navigation/Secondary';
import Footer from './components/Footer';
import { Socket } from './shared/React-Socket';
import cookie from 'react-cookies';
import { isMobile } from "react-device-detect";
	
const options = Keystone.socket_cluster_options;



const classes = {
	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100vh',
	},
	body: {
		flexGrow: 1,
	},
};

const App = (props) => {

	// if the channel_name is empty then redirect to home 
	if (isMobile) {
        return window.location.href = Keystone.mobileSiteUrl;
    }

	var channel_name = cookie.load('channel_name');
	if ( channel_name == undefined ) {
		return window.location.href = '/';
	}

	const listsByPath = require('../utils/lists').listsByPath;
	let children = props.children;
	// If we're on either a list or an item view
	let currentList, currentSection;
	if (props.params.listId) {
		currentList = listsByPath[props.params.listId];
		// If we're on a list path that doesn't exist (e.g. /keystone/gibberishasfw34afsd) this will
		// be undefined
		if (!currentList) {
			children = (
				<Container>
					<p>List not found!</p>
					<Link to={`${Keystone.adminPath}`}>
						Go back home
					</Link>
				</Container>
			);
		} else {
			// Get the current section we're in for the navigation
			currentSection = Keystone.nav.by.list[currentList.key];
		}
	}
	// Default current section key to dashboard
	const currentSectionKey = (currentSection && currentSection.key) || 'dashboard';

	// options.onConnected = function(socket, message) {
		// subscrie a SocketChannel
		// var channel_name = cookie.load('channel_name');
		// var socket_channel = socket.subscribe(channel_name, function(channel_name){
		// 	console.log(channel_name);
		// });
	// }

	return (
		<div className={css(classes.wrapper)}>
			<header>
				<MobileNavigation
					brand={Keystone.appname}
					currentListKey={props.params.listId}
					currentSectionKey={currentSectionKey}
					sections={Keystone.nav.sections}
					signoutUrl={Keystone.signoutUrl}
				/>
				<PrimaryNavigation
					currentSectionKey={currentSectionKey}
					brand={Keystone.appname}
					sections={Keystone.nav.sections}
					signoutUrl={Keystone.signoutUrl}
				/>
				{/* If a section is open currently, show the secondary nav */}
				{(currentSection) ? (
					<SecondaryNavigation
						currentListKey={props.params.listId}
						lists={currentSection.lists}
						itemId={props.params.itemId}
					/>
				) : null}
			</header>
			<main className={css(classes.body)}>
				<Socket options={options}> 
            		{children}
				</Socket>
			</main>
			    
            <Footer
            	appname={Keystone.appname}
				appversion={Keystone.appversion}
				backUrl={Keystone.backUrl}
				brand={Keystone.brand}
				brandUrl={Keystone.brandUrl}
				version={Keystone.version}
			/>
		</div>
	);
};

module.exports = App;
