var Installation = require('../models/installation'),
	databases = require('../config/databases'),
	sql = require('mssql');

var PROCESSES_QUERY =
    "DECLARE @MAXID BIGINT = (SELECT MAX(MessageID) FROM [Message].[Raw]) " +
    "SELECT ProcessName, LastID, LastActivityDate, @MAXID - LastID AS Delta " +
    "FROM [dbo].[ProcessHistory] (nolock) " +
    "WHERE ProcessName LIKE 'Engine%' ";

var UNIT_LATEST_MESSAGES_QUERY = 
	"SELECT I.ItemID, I.ItemName, I.IMEI, I.[Status], H.HardwareID, H.HardwareName, H.ParserName, H.PortNumbers " +
	"FROM dbo.Item I " +
	"JOIN Config.Hardware H " +
	"ON I.HardwareID = H.HardwareID " +
	"WHERE IMEI = @IMEI;";

module.exports = function (app) {
	app.get('/api/installation/search/:search', function (rq, rs) {
		Installation.find({ name: { $regex : new RegExp(rq.params.search, 'i') } }, {}, { limit: 10 },
				function (err, installations) {
					if(err) return rs.json([{ Error : err }]); 
					rs.json(installations);
				});     
	});

	app.get('/api/installation/:name', function (rq, rs) {
		Installation.findOne({ name: rq.params.name }, 
			function (err, installation) {
				if(err) 
					return rs.json({ 
						err: err 
					});
				return installation ? rs.json({ installation: installation }) : rs.json({ err : { message: 'No Installation Found' } });
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


	app.get('/api/:installation/:imei', function (rq, rs) {
		Installation.findOne({ name: rq.params.installation }, 
			function (err, installation) {
				if(err) 
					return rs.json({ err: err });
				if(!installation) 
					return rs.json({ err: { message: 'Installation not found.', installation: true } });
				cnn = new sql.Connection({ user : databases.kingslanding.username, password: databases.kingslanding.password, server: installation.dbase, database: installation.name }, function (err) {
					if (err) return rs.json({ err: err, installation: installation });
				});

				var statement = new sql.PreparedStatement(cnn);
				statement.prepare(UNIT_LATEST_MESSAGES_QUERY, function (err) {
					if (err) return rs.json({ err: err, installation: installation });
					statement.execute({ IMEI: rq.params.imei }, function (err, rows) {
						if (err) return rs.json({ err: err, installation: installation });
						if(rows.length === 0) return rs.json({ err: { message: 'No information was found associated to this IMEI.', unit: true }, installation: installation });
						var response = {
							installation: installation,
							items: []	
						};
						rows.forEach(function (row) {
							response.items.push({
								id: row.ItemID,
								name: row.ItemName,
								status: row.Status,
								imei: row.IMEI,
								hardware: {
									id: row.HardwareID,
									name: row.HardwareName,
									parser: row.ParserName,
									ports: row.PortNumbers
								}
							});
						});
						rs.json(response);
					});
				});
			});
	});

	app.get('/api/raw/:imei', function (rq, rs) {
	});

	app.get('/api/commands/:imei', function (rq, rs) {
	});
};