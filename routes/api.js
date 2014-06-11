var Installation = require('../models/installation');

module.exports = function (app) {
	app.get('/api/installation/search/:search', function (rq, rs) {
		Installation.find({ name: { $regex : new RegExp(rq.params.search, 'i') } }, {}, { limit: 10 }, 
			function (err, installations) {
				if(err) return rs.json([{ Error : err }]);
				return rs.json(installations);
			});
	});

	app.get('/api/installation/:name', function (rq, rs) {
		Installation.findOne({ name: rq.params.name }, 
			function (err, installation) {
				if(err) return rs.json([{ Error : err }]);
				return rs.json(installation);
			});
	});

	app.get('/api/installation/stats/processing/:name', function (rq, rs) {
		// This is what should be called to get stat information.
		// { processing : { parser, alerts, geofence, poi...}, alertSender : { generated, not_sent } }
	});

	app.get('/api/installation/item/:id', function (rq, rs) {
	});

	app.get('/api/installation/imei/:imei', function (rq, rs) {
	});
};