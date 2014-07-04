"use strict";

angular.module('ApplicationModule', ['ngResource', 'ngRoute'])
	.config(function($interpolateProvider, $routeProvider, $locationProvider) {
		// configure angular binding interpolation symbols
		$interpolateProvider.startSymbol('<%=');
		$interpolateProvider.endSymbol('%>');

		// configure routes
		$routeProvider
			.when('/servers', {
				templateUrl: 'maintenance-general.html',
				controller: 'MaintenanceController'
			})
			.when('/:installation', {
				templateUrl: 'installation-general.html',
				controller: 'InstallationController'
			})
			.when('/:installation/notfound', {
				templateUrl: 'installation-notfound.html',
				controller: 'PartialErrorController'	
			})
			.when('/:installation/units', {
				templateUrl: 'unit-search.html',
				controller: 'UnitController'
			})
			.when('/:installation/:imei', {
				templateUrl: 'unit-general.html',
				controller: 'UnitController'
			})
			.when('/:installation/:imei/:item', {
				templateUrl: 'unit-general.html',
				controller: 'UnitController'
			})
			.when('/:installation/:imei/notfound', {
				templateUrl: 'unit-notfound.html',
				controller: 'PartialErrorController'
			});
	});