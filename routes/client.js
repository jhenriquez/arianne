var sql = require('mssql');

function ClientDataService(config){
	var SITE_USERS_QUERY = 
	"SELECT username, firstname, lastname, activationDate, deactivationDate, " +
	"CASE WHEN IsSiteAdmin = 1 THEN 'SiteAdmin' " +
	     "WHEN IsSiteMonitor = 1 THEN 'Monitor' " +
	     "WHEN IsSiteSupport = 1 THEN 'Support' " +
	"END AS userType " +
	"FROM Security.[User] with(nolock) " + 
	"WHERE (IsSiteAdmin = 1 or IsSiteMonitor = 1 or IsSiteSupport = 1) AND STATUS = 'A' " +
	"ORDER BY IsSiteAdmin DESC, firstname ASC, lastname ASC";

	this.getSiteUsers = function getSiteUsers(onErr, onSucc){
		cnn = new sql.Connection(config, function (err) {
			if (err)
				return onErr(err);

			cnn.request().query(SITE_USERS_QUERY, function (err, rows) {
                if(err)
                	return onErr(err);
				onSucc(rows);
			});
		});
	};
};

module.exports = ClientDataService;