"use strict"
/* Token Authenticating Tools */


angular.module('TokenAuthentication.Buffer', [])
	.service('AuthenticationBuffer', function ($injector) {

		this.requestPocket = [];

		function rejectRequest(rejection, promise) {
			promise.reject(rejection);
		};

		function retryRequest(config, promise) {
			var $http = $injector.get('$http');
			$http(config)
				.then(
					function (rs) {
						promise.resolve(rs);
					},
					function (rs) {
						promise.reject(rs);
					});
	    };

		this.addRequest = function addRequest (rejection, promise) {
			this.requestPocket.push({rejection: rejection, promise: promise});
		};

		this.retry = function retry () {
			this.requestPocket.forEach(function (request) {
				retryRequest(request.rejection.config, request.promise);
			});
			this.requestPocket = [];
		};

		this.reject = function reject () {
			this.requestPocket.forEach(function (request) {
				rejectRequest(request.rejection, request.promise);
			});
			this.requestPocket = [];
		};
	});


angular.module('TokenAuthentication', ['TokenAuthentication.Buffer'])
	// Simple interceptor that catches 401 error responses and broadcasts it.
	.constant('$handleForbidden', function ($rootScope, $q, AuthenticationBuffer) {
		return {
			'responseError': function (re) {
				if(re.status === 401) {
					var deferred = $q.defer();
					if(AuthenticationBuffer.requestPocket.length === 0)
						$rootScope.$broadcast('auth:authentication-required', {config: re.config, promise: deferred});
					AuthenticationBuffer.addRequest(re, deferred);
					return deferred.promise;
				}
				return $q.reject(re);
			}
		};
	})
	// Simple interceptor that checks the sessionStorage for a token and injects it on requests.
	.constant('$tokenInjector', function ($window) {
		return {
			'request' : function (config) {
				if($window.sessionStorage.token)
					config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
				return config;
			}
		};
	})
	.service('$authenticationService', function (AuthenticationBuffer, $rootScope) {
		this.loginSuccessful = function loginSuccessful() {
			$rootScope.$broadcast('auth:login-successful');
			AuthenticationBuffer.retry();
		};

		this.loginCancelled = function loginCancelled() {
			$rootScope.$broadcast('auth:login-cancelled');
			AuthenticationBuffer.reject();
		};
	});