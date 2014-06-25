"use strict";

angular.module('InstallationSearch')
	.factory('$installationService', function ($resource) {
		return $resource('/api/installation/:name', {},{
			get: { url: '/api/installation/:name', method: 'get', isArray: false },
			search: { url: '/api/installation/search/:for', method: 'get', isArray: true },
			stats: {url: '/api/installation/stats/processing/:name', method: 'get' }
		});
	});