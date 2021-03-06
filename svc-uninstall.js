var Service = require('node-windows').Service;

var arg = process.argv.splice(2, process.argv.length);

if (!arg[0]) {
	console.log('Please, provide a name for the service.');
	return;
}

var svc = new Service(
{
	name: arg[0],
	script: './app.js'
});

svc.on('uninstall', function () {
  console.log('Unistall successful.');
});

console.log('Service Exists? ', svc.exists);

svc.uninstall();