"use strict";

angular.module('CustomDirectives', []);

angular.module('ApplicationModule', ['ngResource', 'ngRoute', 'CustomDirectives', 'ui.bootstrap', 'ui.router', 'TokenAuthentication'])
	.config(function($routeProvider, $locationProvider, $httpProvider, $handleForbidden, $tokenInjector) {

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
			.when('/:installation/:imei', {
				templateUrl: 'partials/unit-general.html',
				controller: 'UnitController'
			})
			.when('/:installation/:imei/notfound', {
				templateUrl: 'partials/unit-notfound.html',
				controller: 'PartialErrorController'
			})
			.when('/:installation/:imei/:item', {
				templateUrl: 'partials/unit-general.html',
				controller: 'UnitController'
			});

			$httpProvider.interceptors.push($tokenInjector);
			$httpProvider.interceptors.push($handleForbidden);
	});
