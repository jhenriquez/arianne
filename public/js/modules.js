"use strict";

angular.module('InstallationSearch', ['ngResource', 'ngRoute'])
	.config(function($interpolateProvider, $routeProvider, $locationProvider) {
		// configure angular binding interpolation symbols
		$interpolateProvider.startSymbol('<%=');
		$interpolateProvider.endSymbol('%>');

		// configure routes
		$routeProvider
			.when('/:name', {
				templateUrl: 'installation-general.html',
				controller: 'InstallationController'
			});
		$locationProvider.html5Mode(true);
	});