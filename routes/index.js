module.exports = function (app, passport) {
	app.get('/', Authentication, function (rq, rs) {
		rs.render('home', { user: rq.user });
	});

	app.get('/login', function (rq, rs) {
		rs.render('login', { message : rq.flash('login_message') });
	});

	app.get('/signup', function (rq, rs)  {	
		rs.render('signup', { message : rq.flash('signup_message') });
	});

	app.get('/logout', function (rq, rs) {
		rq.logOut();
		rs.redirect('/');	
	});

	app.post('/login', passport.authenticate('user-local-login', {
		successRedirect : '/',
		failureRedirect : '/login',
		failureFlash : true
	}));

	app.post('/signup', passport.authenticate('user-local-signup', {
		successRedirect : '/',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	app.get('/:name', Authentication, function (rq, rs) {
		rs.redirect('/#/' + rq.params.name);
	});

	function Authentication(rq, rs, next) {
		if(rq.isAuthenticated())
			return next();
		rs.redirect('/login');
	};
};