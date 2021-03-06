var sql = require('mssql'),
	Installation = require('../models/Installation'),
	mongoose = require('mongoose'),
	db = require('../config/databases');

var config = {
	user: db.kingslanding.username,
	password: db.kingslanding.password,
	server: db.kingslanding.server
};

mongoose.connect(db.oberyn);

var cn = new sql.Connection(config, function (err) {
	if (err) throw err;	

	cn.request().query("SELECT * FROM [PositionLogic].[dbo].[Site] WITH(nolock) WHERE [Status] = 'A'", function (err, rows) {
		if(err) throw err;
		var total = 0;

		rows.forEach(function (row) {

			Installation.update({name: row.SiteName},
				{ 
                    $set : {
                        name: row.SiteName,
                        site: row.DataBaseName,
                        dbase: row.DBIPaddress,
                        connectionString: row.ConnectionString,
                        engine: row.MsgEngineServer,
                        version: row.Version,
                        language: row.Language,
                        dbServer: row.DBServer.replace('[','').replace(']',''),
                        serverName: row.DBServer,
                        newUI: row.NewUI,
                        webPool: row.WebPool,
                        moved: row.MovedToAtlanta,
                        engines: {
                        	engine: row.MsgEngineServer,
                        	geocode: row.GeoCodeEngine,
                        	reminder: row.ReminderEngine,
                        	alert: row.AlertEngine
                        },
                        report: row.ReportServer
                    }
				},
                { upsert : true },
                function (err, updated) {
					if(err) throw err;
					total++;
                    if(total == rows.length) {
                        console.log(total);
                        mongoose.disconnect();
                        cn.close();
                    }
				});	
		});
	});
});