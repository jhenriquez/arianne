var Installation = require('../models/installation'),
	databases = require('../config/databases'),
	sql = require('mssql');

var PROCESSES_QUERY =
    "DECLARE @MAXID BIGINT = (SELECT MAX(MessageID) FROM [Message].[Raw]) " +
    "SELECT ProcessName, LastID, LastActivityDate, @MAXID - LastID AS Delta " +
    "FROM [dbo].[ProcessHistory] (nolock) " +
    "WHERE ProcessName LIKE 'Engine%' ";

var UNIT_INFORMATION_QUERY = 
	"SELECT I.ItemID, I.ItemName, I.IMEI, I.[Status], H.HardwareID, H.HardwareName, H.ParserName, H.PortNumbers " +
	"FROM dbo.Item I " +
	"JOIN Config.Hardware H " +
	"ON I.HardwareID = H.HardwareID " +
	"WHERE IMEI = @IMEI;";

module.exports = function (app) {
	app.get('/api/installation/search/:search', function (rq, rs) {
		Installation.find({ name: { $regex : new RegExp(rq.params.search, 'i') } }, {}, { limit: 10 },
				function (err, installations) {
					if(err) return rs.json([{ err : err }]); 
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
				return installation ? rs.json({ installation: installation }) : rs.json({ err : { message: 'No Installation Found', notfound: true } });
			});
	});

	app.get('/api/:installation/:server/processing', function (rq, rs) {
		var cfg = { 
				user : databases.kingslanding.username,
				password: databases.kingslanding.password,
				server: rq.params.server,
				database: rq.params.installation
			},
			response = { processing: [] };

		cnn = new sql.Connection(, function (err) {
			if (err) {
				response.err = err;
				return rs.json(response);
			}

			cnn.request().query(PROCESSES_QUERY, function (err, rows) {
                if(err) {
                	response.err = err;
					return rs.json(response);
                }

                rows.forEach(function (row) {
                	response.processing.push({
					process: row.ProcessName,
					currentID: row.LastID,
					lastActivity: row.LastActivityDate,
					delta: row.Delta
					});
				});

			return rs.json(response);
		});
	});

	app.get('/api/:installation/:server/:imei', function (rq, rs) {
		var cfg = { 
				user : databases.kingslanding.username,
				password: databases.kingslanding.password, 
				server: rq.params.server, 
				database: rq.params.installation 
			},
			response = {};

		console.log(cfg);

		cnn = new sql.Connection(cfg, function (err) {
			if (err) {
				response.err = err;
				return rs.json(response);
			}
		});

		var statement = new sql.PreparedStatement(cnn);

		statement.input('IMEI', sql.NVarChar);
		statement.prepare(UNIT_INFORMATION_QUERY, function (err) {

			if (err) {
				response.err = err;
				return rs.json(response);
			}

			statement.execute({ IMEI: rq.params.imei }, function (err, rows) {

				if (err) {
					response.err = err;
					return rs.json(response);
				}

				if(rows.length === 0) {
					response.err = { message: 'No information was found associated to this IMEI.', notfound: true };
					return rs.json(response);	
				}
							
				response.items = [];

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

	app.get('/api/raw/:imei', function (rq, rs) {
	});

	app.get('/api/commands/:imei', function (rq, rs) {
	});
};