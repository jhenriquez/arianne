"use strict";

angular.module('CustomDirectives', []);

angular.module('ApplicationModule', ['ngResource', 'ngRoute', 'CustomDirectives', 'ui.bootstrap', 'ui.router', 'TokenAuthentication'])
	.config(function($routeProvider, $locationProvider, $httpProvider, $handleForbidden, $tokenInjector, $stateProvider) {

		$stateProvider
			.state('Maintenance', {
				url: '/servers',
				templateUrl: 'partials/maintenance-general.html',
				controller: 'MaintenanceController'
			})
			.state('Installation', {
				url: '/:installation',
				templateUrl: 'partials/installation-general.html',
				controller: 'InstallationController'
			})
			.state('InstallationNotFound', {
				url: '/:installation/notfound',
				templateUrl: 'partials/installation-notfound.html',
				controller: 'PartialErrorController'
			});

			$httpProvider.interceptors.push($tokenInjector);
			$httpProvider.interceptors.push($handleForbidden);
	});
