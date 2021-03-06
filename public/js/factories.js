"use strict";

angular.module('ApplicationModule')
	.factory('$installationService', function ($resource) {
		return $resource('/api/installation/:name', {},{
			get: { url: '/api/installation/:name', method: 'get', isArray: false },
			search: { url: '/api/installation/search/:for', method: 'get', isArray: true },
			searchByServer : { url: '/api/installation/searchByServer/:for', method: 'get', isArray: true},
			stats: {url: '/api/:installation/:server/processing', method: 'get' },
			getServers : {url: '/api/installation/serversInfo', method: 'get', isArray: true}
		});
	})
	.factory('$clientService', function ($resource) {
		return $resource('/api/:installation/:server/siteUsers', {}, {
			getSiteUsers : { url : '/api/:installation/:server/siteUsers', method: 'get', isArray: false }
		});
	})
	.factory('$unitService', function ($resource) {
		return $resource('/api/:installation/:server/:imei', {}, {
			search: { method: 'get', isArray: false }
		});
	})
	.factory('$serverService', function ($resource) {
		return $resource('/api/server', {}, {
			stats: { url: '/api/server/:server', method: 'get', isArray: false }
		});
	})
	.factory('$userService', function ($resource) {
		return $resource('/api/me', {}, {
			get: { url: '/api/me', method: 'get', isArray: false },
			whoAmI: { url: '/api/me', method: 'get', isArray: false }
		});
	});