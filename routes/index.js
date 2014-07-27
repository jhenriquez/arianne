module.exports = function (app, passport) {
	app.get('/', function (rq, rs) {
		rs.render('home');
	});

	app.get('/:name', function (rq, rs) {
		rs.redirect('/#/' + rq.params.name);
	});
};