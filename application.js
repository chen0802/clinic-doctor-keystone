// Load the babel-register plugin for the graphql directory
// Note this checks the regex against an absoloute path


require('dotenv').config({ silent: true });

// Initialise New Relic if an app name and license key exists
var keystone = require('index');
var pkg = require('./package.json');
var handlebars = require('express-handlebars');


keystone.init({
	'name': process.env.NAME,
	'brand': process.env.BRAND,
	// 'admin path': 'console',
	'back': '/me',

	'favicon': 'public/favicon.ico',
	'less': 'public',
	'static': 'public',

	'views': 'views',
	'views': 'templates/views',
	'view engine': '.hbs',

	'custom engine': handlebars.create({
		layoutsDir: 'templates/layouts',
		partialsDir: 'templates/partials',
		defaultLayout: 'unify',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs',
	}).engine,
	'view cache': false,

	'emails': 'templates/emails',
	'mandrill api key': process.env.MANDRILL_KEY,
	'mail options': { transpost: 'mailgun', engine: 'jade' },
	
	'auto update': true,
	'session': true,
	'session store': 'mongo',
	'auth': true,
	'user model': 'Learner',
    'cookie secret': process.env.COOKIE_SECRET || '82a6b49908b7b8d4bf89e13c699b4b8ac7222e6fedde030db6b66df150b7e13d39c43319446ce37e3933351e1967030ece6d8a35ad4ddfd1ba8b7cd5c980f7e9',


	'google api key': process.env.GOOGLE_BROWSER_KEY || '',
	'google server api key': process.env.GOOGLE_SERVER_KEY || '',
	'google server endpoint': 'https://maps.google.cn',

	'ga property': process.env.GA_PROPERTY,
	'ga domain': process.env.GA_DOMAIN,

	'basedir': __dirname,
	'language': process.env.LANGUAGE,
	// 'wysiwyg images': true,
	'wysiwyg cloudinary images': true,
	's3image config': 1,
	'wysiwyg additional options': { 'external_plugins': { 'uploadimage': '/js/uploadimage/plugin.min.js' } },

});



keystone.import('models');


// add a new custom Field Type
Object.defineProperty(
	keystone.Field.Types,
	'CreditCard',
	{ 
		get: function() {
			return require('./types/creditcard.js');
		} 
	}
);

keystone.set('routes', require('./routes-auth'));
// keystone.set('routes', require('./routes-s3uploader'));


keystone.set('locals', {
	_: require('lodash'),
	moment: require('moment'),
	js: 'javascript:;',
	env: keystone.get('env'),
	utils: keystone.utils,
	plural: keystone.utils.plural,
	editable: keystone.content.editable,
	google_api_key: keystone.get('google api key'),
	ga_property: keystone.get('ga property'),
	ga_domain: keystone.get('ga domain')
});

keystone.set('email locals', {
	utils: keystone.utils,
	host: (function() {
		if (keystone.get('env') === 'production') return 'http://html5.weplus.ca';
		return (keystone.get('host') || 'http://localhost:') + (keystone.get('port') || '3000');
	})()
});

keystone.set('nav', {
	'Website':['LearnerWebsite', 'LearnerWebpage', 'LearnerWebsiteSetting']
});


keystone.start();
