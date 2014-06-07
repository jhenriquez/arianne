var goose = require('mongoose'),
	Schema = goose.Schema;

var installationSchema = new Schema({
	name : String,
	site : String,
	db : String,
	engine : String,
	mailSenderName : String,
	mailSenderServer : String
});

module.exports = goose.model('Installation', installationSchema);