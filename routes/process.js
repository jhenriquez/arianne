var sql = require('mssql');

function ProcessingHistory (config) {

	var internalDetalQuery =
    "DECLARE @MAXID BIGINT = (SELECT MAX(MessageID) FROM [Message].[Raw]) " +
    "SELECT ProcessName, LastID, LastActivityDate, @MAXID - LastID AS Delta " +
    "FROM [dbo].[ProcessHistory] (nolock) " +
    "WHERE ProcessName LIKE 'Engine%' ";

    this.getRecentHistoryDelta = function getRecentHistoryDelta (onErr, onSucc) {
    	cnn = new sql.Connection(config, function (err) {
			if (err)
				return onErr(err);

			cnn.request().query(internalDetalQuery, function (err, rows) {
                if(err)
                	return onErr(err);
				onSucc(rows);
			});
		});
    };
}

module.exports = ProcessingHistory;