var async = require('async');

module.exports = function (req, res) {
	var keystone = req.keystone;
	var counts = {};
	function counting(list, filter, next) {
		list.model.count(filter || {} , function (err, count) {
			counts[list.key] = count;
			next(err);
		});
	}

	async.each(keystone.lists, function (list, next) {
		//: Add User related filter
		if ( list.onFilter ) {
			list.onFilter(req, function(err, filter){
				counting(list, filter, next)
			})
		} else {
			counting(list, {}, next);
		}
		
	}, function (err) {
		if (err) return res.apiError('database error', err);
		return res.json({
			counts: counts,
		});
	});
};
