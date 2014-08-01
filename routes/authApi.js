var User = require('../models/user'),
	jwt = require('jsonwebtoken');

module.exports = function (app) {

	app.post('/authenticate',  function (rq, rs) {
		User.findOne({ username: rq.body.username }, function (err, user) {
			if(err)
				return rs.json({ err : { message: 'Internal Error. Contact Adminsitrator.' }});

			if (!user)
				return rs.json({ err : { message: 'Username does not exists.' }});

			if(!user.validPassword(rq.body.password))
				return rs.json({ err : { message: 'Invalid Password.' }});

			var profile = {
				name:  user.name,
				username: user.password
			};

			var token = jwt.sign(profile, 'I\'m King!', { expiresInMinutes : 30 });

			return rs.json({ token : token });
		});
	});
}