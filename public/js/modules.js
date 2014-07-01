"use strict";

angular.module('ApplicationModule', ['ngResource', 'ngRoute'])
	.config(function($interpolateProvider, $routeProvider, $locationProvider) {
		// configure angular binding interpolation symbols
		$interpolateProvider.startSymbol('<%=');
		$interpolateProvider.endSymbol('%>');

		// configure routes
		$routeProvider
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
			.when('/:installation/unit/search', {
				templateUrl: 'unit-search.html',
				controller: 'UnitSearchController'
			})
			.when('/:installation/:imei/multi', {
				templateUrl: 'unit-multiple.html',
				controller: 'UnitController'
			})
			.when('/:installation/:imei/notfound', {
				templateUrl: 'unit-notfound.html',
				controller: 'PartialErrorController'
			});
	});