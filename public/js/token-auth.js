"use strict"
/* Token Authenticating Tools */


angular.module('TokenAuthentication.Buffer', [])
	.service('AuthenticationBuffer', function ($injector) {

		var requestBuffer = [];

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
			requestBuffer.push({rejection: rejection, promise: promise});
		};

		this.retry = function retry () {
			requestBuffer.forEach(function (request) {
				retryRequest(request.rejection.config, request.promise);
			});
			requestBuffer = [];
		};

		this.reject = function reject () {
			requestBuffer.forEach(function (request) {
				rejectRequest(request.rejection, request.promise);
			});
			requestBuffer = [];
		};
	});


angular.module('TokenAuthentication', ['TokenAuthentication.Buffer'])
	// Simple interceptor that catches 401 error responses and broadcasts it.
	.constant('$forbiddenCatcher', function ($rootScope, $q, AuthenticationBuffer) {
		return {
			'responseError': function (re) {
				if(re.status === 401) {
					var deferred = $q.defer();
					AuthenticationBuffer.addRequest(re, deferred);
					$rootScope.$broadcast('auth:authentication-required', {config: re.config, promise: deferred});
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
	.service('$authenticationService', function (AuthenticationBuffer) {
		this.loginSuccessful = function loginSuccessful() {
			AuthenticationBuffer.retry();
		};

		this.loginCancelled = function loginCancelled() {
			AuthenticationBuffer.reject();
		};
	});