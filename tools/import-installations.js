var sql = require('mssql'),
	Installation = require('../models/Installation'),
	mongoose = require('mongoose'),
	db = require('../config/databases');

var config = {
	user: db.kingslanding.username,
	password: db.kingslanding.password,
	server: db.kingslanding.server
};

var cn = new sql.Connection(config, function (err) {
	if (err) throw err;	

	mongoose.connect(db.oberyn);

	cn.request().query("SELECT * FROM [PositionLogic].[dbo].[Site] WHERE [Status] = 'A'", function (err, rows) {
		if(err) throw err;
		console.log(rows.pop());
		/*
		rows.forEach(function (row) {
			var newInstallation = new Installation();
			newInstallation.name = row.SiteName;
			newInstallation.site = row.SiteName;
			newInstallation.dbase = row.DBServer;
			newInstallation.connectionString = row.ConnectionString;
			newInstallation.engine = row.MsgEngineServer;
			newInstallation.save(function (err, installation, affected) {
				if(err) throw err;
				console.log(installation.name);
			});
		});
		*/
	});
});