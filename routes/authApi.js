var User = require('../models/user'),
	jwt = require('jsonwebtoken');

module.exports = function (app) {

	app.post('/authenticate',  function (rq, rs) {
		User.findOne({ username: rq.body.username }, function (err, user) {
			if(err)
				return rs.json({ err : { message: 'Internal Error. Contact Adminsitrator.', inner: err } });

			if (!user)
				return rs.json({ err : { message: 'Username does not exists.' } });

			if(!user.validPassword(rq.body.password))
				return rs.json({ err : { message: 'Invalid Password.' } });

			var profile = {
				id: user.id,
				username:  user.username,
				email: user.email
			};

			var token = jwt.sign(profile, 'I\'m King!', { expiresInMinutes : 30 });

			return rs.json({ token : token });
		});
	});

	app.get('/api/me', function (rq, rs) {
		var token = rq.get('Authorization').split(' ')[1]; 
		jwt.verify(token, 'I\'m King!', {}, function (err, profile) {
			if(err)
				return rs.json({ err: { message: 'Internal Error. Contact Administrator.',  inner: err } });
			rs.json({ user: profile });
		});
	});
}