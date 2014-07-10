var Installation = require('../models/installation'),
	databases = require('../config/databases'),
	sql = require('mssql');

var PROCESSES_QUERY =
    "DECLARE @MAXID BIGINT = (SELECT MAX(MessageID) FROM [Message].[Raw]) " +
    "SELECT ProcessName, LastID, LastActivityDate, @MAXID - LastID AS Delta " +
    "FROM [dbo].[ProcessHistory] (nolock) " +
    "WHERE ProcessName LIKE 'Engine%' ";

var UNIT_INFORMATION_QUERY = 
	"SELECT I.ItemID, I.ItemName, I.IMEI, I.[Status], H.HardwareID, H.HardwareName, H.ParserName, H.PortNumbers, " +
	"H.IgnitionSensor, H.BatterySensor, H.VibrationSensor, H.ReedSensor, H.SpeedSensor, H.TemperatureSensor, H.UseDeviceOdometer, " +
	"H.UseDeviceEngineHour, H.FuelSensor, H.Temperature2Sensor " +
	"FROM dbo.Item I " +
	"JOIN Config.Hardware H " +
	"ON I.HardwareID = H.HardwareID " +
	"WHERE IMEI = @IMEI;";

var SERVER_STATS_QUERY = "SELECT TOP 10 * FROM [192.168.7.80\\MSSQLBeta].positionlogic.dbo.templogsize WHERE ServerName = @server ORDER BY Created DESC " +
" CREATE TABLE #OpenTranStatus ( ActiveTransaction varchar(25),Details sql_variant) " +
"INSERT INTO #OpenTranStatus " +
"EXEC ('DBCC OPENTRAN (''tempdb'') WITH TABLERESULTS, NO_INFOMSGS'); " +
"DECLARE @_SPID int " +
"SELECT @_SPID=convert(int,Details) FROM #OpenTranStatus WHERE activetransaction ='OLDACT_SPID' " +
"DBCC INPUTBUFFER(@_SPID) " +
"SELECT @_SPID AS 'SPID' " +
"DROP TABLE #OpenTranStatus";

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

	app.get('/api/server', function (rq, rs) {
		Installation.aggregate({ $group: { _id: { dbServer: '$dbServer', serverName: '$serverName' } } }, function (err, rows) {
			var response = {};
			
			if(err) {
				response.err = err;
				return rs.json(response);
			}

			if (rows.length > 0)
				response.servers = [];

			rows.forEach(function(row) {
				response.servers.push({
					address: row._id.dbServer,
					name: row._id.serverName
				});
			})

			rs.json(response);
		});
	});

	app.get('/api/server/:server', function (rq, rs) {
		var cfg = { 
				user : databases.kingslanding.username,
				password: databases.kingslanding.password, 
				server: rq.params.server, 
				database: 'master'
			},
			response = {};

			cnn = new sql.Connection(cfg, function (err) {
				if (err) {
					response.err = err;
					console.log(err);
					return rs.json(response);
				}

				var statement = new sql.PreparedStatement(cnn);

				statement.input('server', sql.NVarChar);
				statement.multiple = true;
				statement.prepare(SERVER_STATS_QUERY, function (err) {
					if(err) {
						response.err = err;
						console.log(err);1
						return rs.json(response);
					}

					statement.execute({ server: rq.params.server }, function (err, rows) {
						if(err) {
							response.err = err;
							console.log(err);1
							return rs.json(response);
						}

						response.tempLogSize = rows[0];
						response.processDetail = rows[1];
						response.processId = rows[2];

						rs.json(response);
					});
				});
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

		cnn = new sql.Connection(cfg, function (err) {
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
	});

	app.get('/api/:installation/:server/:imei', function (rq, rs) {
		var cfg = { 
				user : databases.kingslanding.username,
				password: databases.kingslanding.password, 
				server: rq.params.server, 
				database: rq.params.installation 
			},
			response = {};

		cnn = new sql.Connection(cfg, function (err) {
			if (err) {
				response.err = err;
				return rs.json(response);
			}

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
								ports: row.PortNumbers,
								deviceOdometer: row.UseDeviceOdometer,
								deviceEngineHours: row.UseDeviceEngineHour
								},
							sensors: {
								ignition: row.IgnitionSensor,
								battery: row.BatterySensor,
								vibration: row.VibrationSensor,
								reed: row.ReedSensor,
								speed: row.SpeedSensor,
								temperature: {
									one: row.TemperatureSensor,
									two: row.Temperature2Sensor
									},
								fuel: row.FuelSensor
								}
							});
						});
					rs.json(response);
				});
			});
		});
	});
};