var goose = require('mongoose'),
	bcrypt = require('bcrypt'),
	Schema = goose.Schema;


var userSchema = new Schema({
	username: String,
	password: String,
	recentInstallations : Array
});

userSchema.methods.setPassword = function (password) {
	this.password = bcrypt.hashSync(password, 20);
};

userSchema.methods.validPassword = function (password) {
	bcrypt.compareSync(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
	return bcryptSync(password, 20);
};

module.exports = goose.model('User', userSchema);