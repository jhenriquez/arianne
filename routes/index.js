module.exports = function (app, passport) {
	app.get('/:name', function (rq, rs) {
		rs.redirect('/#/' + rq.params.name);
	});
};