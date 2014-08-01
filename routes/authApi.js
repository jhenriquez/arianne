module.exports = function (app) {

	app.post('/authenticate',  function (rq, rs) {
		console.log(rq.body);
		rs.json(rq.body);
	});
}