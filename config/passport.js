var passport = require('passport'),
	User = require('../models/user');


passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	User.findById(user._id, function(err, user) {
		done(err,user);
	});
});

passport.use('user-local-signup', new LocalStrategy(
	function(rq, username, password, done) {
		User.findOne({'username': username}, function(err, author) {
			if(err)
				return done(err);

			if(user)
				return done(null,false,rq.flash('signup_message','This username is already in use.'));
		});

		var newUser = new User();

		newUser.username = email;
		newUser.setPassword(password);

		newAuthor.save(function (err) {
			if(err) 
				return done(err);
			return done(null,newAuthor);
		});
	})	
);

passport.use('user-local-login', new LocalStrategy(
function (rq, username, password, done) {
	Author.findOne({ 'username' : username }, function (err, user) {
		if(err)
			return done(err);
		if(!user)
			return done(null, false, rq.flash('login_message', 'This username/email does not exist.'));
		if(!user.validPassword(password))
			return done(null, false, rq.flash('login_message', 'Invalid password.'));
		done(null, user);
	});
}));

module.exports = passport;