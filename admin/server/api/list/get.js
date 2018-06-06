var async = require('async');
var assign = require('object-assign');
var listToArray = require('list-to-array');
var debug = require('debug')('keystone:api:list:get');

module.exports = function (req, res) {

	var where = {};
	var fields = req.query.fields;
	var includeCount = req.query.count !== 'false';
	var includeResults = req.query.results !== 'false';
	if (includeResults && fields) {
		if (fields === 'false') {
			fields = false;
		}
		if (typeof fields === 'string') {
			fields = listToArray(fields);
		}
		if (fields && !Array.isArray(fields)) {
			return res.status(401).json({ error: 'fields must be undefined, a string, or an array' });
		}
	}
	var filters = req.query.filters;
	if (filters && typeof filters === 'string') {
		try { filters = JSON.parse(req.query.filters); }
		catch (e) { } // eslint-disable-line no-empty
	}
	if (typeof filters === 'object') {
		assign(where, req.list.addFiltersToQuery(filters));
	}
	var sort;
	async.waterfall([
		function(next){
			if (req.query.search) {
				req.list.addSearchToQueryEx(req, req.query.search, function(err, filter){
					console.log(filter);
					assign(where, filter );
					next()
				})
			} else {
				next();
			}
		},
		function(next){
			if (req.query._req_where) {
				assign(where, req.query._req_where);
			}
			next()
		},
		function(next){
			var query = req.list.model.find(where);
			if (req.query.populate) {
				query.populate(req.query.populate);
			}
			if (req.query.expandRelationshipFields && req.query.expandRelationshipFields !== 'false') {
				req.list.relationshipFields.forEach(function (i) {
					query.populate(i.path);
				});
			}
			sort = req.list.expandSort(req.query.sort);
			next(null, query);
		},
		//: add options parameter support, so we can search customized refernce check
		function(query, next ) {
			// if ( req.query.options  && req.query.options != '' && req.list.onQueryOptions ) {
			//  run onQueryOptions to enable extented where if no option param defined ...
			if (  req.list.onQueryOptions ) {
				req.list.onQueryOptions(req, query, function(err){
					next(null, query)
				}) 
			} else {
				next(null, query)
			}
		},
		//.
		function (query, next) {
			if (!includeCount) {
				return next(null, query, 0);
			}
			query.count(function(err,count){
				next(null, query, count);
			});
		},
		function (query, count, next) {
			if (!includeResults) {
				return next(null, count, []);
			}
			query.find();
			query.limit(Number(req.query.limit) || 100);
			query.skip(Number(req.query.skip) || 0);
			if (sort.string) {
				query.sort(sort.string);
			}
			query.exec(function (err, items) {
				next(err, count, items);
			});
		},
	], function (err, count, items) {
		if (err) {
			res.logError('admin/server/api/list/get', 'database error finding items', err);
			return res.apiError('database error', err);
		}

		return res.json({
			results: includeResults
				? items.map(function (item) {
					return req.list.getData(item, fields, req.query.expandRelationshipFields);
				})
				: undefined,
			count: includeCount
				? count
				: undefined,
		});
	});
};
