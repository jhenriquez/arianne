var sql = require('mssql');

function UnitDataService (config) {
	var UNIT_INFORMATION_QUERY = 
	"SELECT I.ItemID, I.ItemName, I.IMEI, I.[Status], H.HardwareID, H.HardwareName, H.ParserName, H.PortNumbers, " +
	"H.IgnitionSensor, H.BatterySensor, H.VibrationSensor, H.ReedSensor, H.SpeedSensor, H.TemperatureSensor, H.UseDeviceOdometer, " +
	"H.UseDeviceEngineHour, H.FuelSensor, H.Temperature2Sensor " +
	"FROM dbo.Item I " +
	"JOIN Config.Hardware H " +
	"ON I.HardwareID = H.HardwareID " +
	"WHERE IMEI = @IMEI;";

	this.getDetailedInformation = function getDetailedInformation (imei, onErr, onSucc) {
		cnn = new sql.Connection(config, function (err) {
			if (err)
				return onErr(err);

			var statement = new sql.PreparedStatement(cnn);

			statement.input('IMEI', sql.NVarChar);
			statement.prepare(UNIT_INFORMATION_QUERY, function (err) {

				if (err)
					return onErr(err);

				statement.execute({ IMEI: imei }, function (err, rows) {

					if (err)
						return onErr(err);

					if(rows.length === 0)
						return onErr({ message: 'No information was found associated to this IMEI.', notfound: true });	

					onSucc(rows);
				});
			});
		});		
	};
};

module.exports = UnitDataService;