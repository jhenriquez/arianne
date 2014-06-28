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
			});
	});