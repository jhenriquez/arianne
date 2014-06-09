var goose = require('mongoose'),
	Schema = goose.Schema;

var installationSchema = Schema({
	name : String,
	site : String,
	connectionString: String,
	dbase : String,
	engine : String,
	mailSenderName : String
});

module.exports = goose.model('Installation', installationSchema);