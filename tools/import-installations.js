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
		var total = 0;
		rows.forEach(function (row) {

			Installation.update({name: rows.SiteName},
				{ 
					$set: { name: row.SiteName },
					$set: { site: row.SiteName },
					$set: { dbase: row.DBServer },
					$set: { connectionString: row.ConnectionString },
					$set: { engine: row.MsgEngineServer }
				 }, 
				{ upsert : true }, function (err, updated) {
					if(err) throw err;
					total++;
				});	
		});

		console.log(total);
	});
	cn.close();
	return;
});