"use strict";

angular.module('CustomDirectives', []);

angular.module('ApplicationModule', ['ngResource', 'ngRoute', 'CustomDirectives'])
	.config(function($interpolateProvider, $routeProvider, $locationProvider, $httpProvider) {
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

		$httpProvider.interceptors.push(function ($q, $rootScope) {
			return {
				'responseError': function (re) {
					if(re.status === 401) {
						var deferred = $q.defer();
						$rootScope.$broadcast('auth:authentication-required', {rejection: re, promise: deferred});
						return deferred.promise;
					}

					return $q.reject(re);
				}
			};
		});
	});