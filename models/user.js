var goose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	Schema = goose.Schema;


var userSchema = new Schema({
	username: String,
	password: String,
	recentInstallations : Array
});

userSchema.methods.setPassword = function (password) {
	this.password = bcrypt.hashSync(password);
};

userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
	return bcrypt.hashSync(password);
};

module.exports = goose.model('User', userSchema);