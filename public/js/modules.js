"use strict";

angular.module('CustomDirectives', []);

angular.module('ApplicationModule', ['ngResource', 'ngRoute', 'CustomDirectives'])
	.config(function($interpolateProvider, $routeProvider, $locationProvider) {
		// configure angular binding interpolation symbols
		$interpolateProvider.startSymbol('<%=');
		$interpolateProvider.endSymbol('%>');

		// configure routes
		$routeProvider
			.when('/servers', {
				templateUrl: 'partials/maintenance-general.html',
				controller: 'MaintenanceController'
			})
			.when('/:installation', {
				templateUrl: 'partials/installation-general.html',
				controller: 'InstallationController'
			})
			.when('/:installation/notfound', {
				templateUrl: 'partials/installation-notfound.html',
				controller: 'PartialErrorController'	
			})
			.when('/:installation/units', {
				templateUrl: 'partials/unit-search.html',
				controller: 'UnitController'
			})
			.when('/:installation/:imei', {
				templateUrl: 'partials/unit-general.html',
				controller: 'UnitController'
			})
			.when('/:installation/:imei/:item', {
				templateUrl: 'partials/unit-general.html',
				controller: 'UnitController'
			})
			.when('/:installation/:imei/notfound', {
				templateUrl: 'partials/unit-notfound.html',
				controller: 'PartialErrorController'
			});
	});