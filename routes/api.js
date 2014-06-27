var Installation = require('../models/installation'),
	databases = require('../config/databases'),
	sql = require('mssql');

var PROCESSES_QUERY =
    "DECLARE @MAXID BIGINT = (SELECT MAX(MessageID) FROM [Message].[Raw]) " +
    "SELECT ProcessName, LastID, LastActivityDate, @MAXID - LastID AS Delta " +
    "FROM [dbo].[ProcessHistory] (nolock) " +
    "WHERE ProcessName LIKE 'Engine%' ";

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
				if(err) 
					return rs.json({ 
						err: err 
					});
				if(installation) {
					rs.json({
						installation: installation
					});
				} else {
					rs.json({
						err: {
							message: 'No Installation Found'
						}
					});
				}
			});
	});

	app.get('/api/installation/stats/processing/:name', function (rq, rs) {
		Installation.findOne({ name: rq.params.name }, 
			function (err, installation) {
				if(err) return console.log(err);
				cnn = new sql.Connection({ user : databases.kingslanding.username, password: databases.kingslanding.password, server: installation.dbase, database: installation.name }, function (err) {
					if (err) return rs.json(err);

                    var server = { processing : []};

					cnn.request().query(PROCESSES_QUERY, function (err, rows) {
                        if(err) return rs.json(err);

                        rows.forEach(function (row) {
                            server.processing.push({
                                process: row.ProcessName,
                                currentID: row.LastID,
                                lastActivity: row.LastActivityDate,
                                delta: row.Delta
                            });
                        });

                        return rs.json(server);
                    });

				});
			});
	});

	app.get('/api/item/:id', function (rq, rs) {
	});

	app.get('/api/imei/:imei', function (rq, rs) {
	});
};