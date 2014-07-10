var goose = require('mongoose'),
	Schema = goose.Schema;

var installationSchema = Schema({
	name : String,
	site : String,
	connectionString: String,
	dbase : String,
	dbServer: String,
	serverName: String,
	mailSenderName : String,
	engines: {
		engine: String,
		geocode: String,
        reminder: String,
        alert: String
	},
	report: String
});

module.exports = goose.model('Installation', installationSchema);