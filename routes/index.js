
/*
 * GET home page.
 */
data = require('../data');

exports.index = function(req, res){
	data.returnItems( function(data){
		res.render('index', { json: data });
	});
};