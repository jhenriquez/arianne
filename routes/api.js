var Installation = require('../models/installation');

module.exports = function (app) {
	app.get('/api/installation/:searchValue', function (rq, rs) {
		Installation.find({ name: { $regex : new RegExp(rq.params.searchValue, 'i') } }, {}, { limit: 10 }, 
			function (err, installations) {
				if(err) return rs.json([{ Error : err }]);
				return rs.json(installations);
			});
	});

	app.get('/api/installation', function (rq, rs) {
		return rs.json([]);
	});
};