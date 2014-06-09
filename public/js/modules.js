
angular.module('LoDashIntegration', [])
	.factory('$_', function() {
		return window._;
	});

angular.module('InstallationSearch', ['ngResource'])
	.config(function($interpolateProvider) {
		$interpolateProvider.startSymbol('<%=');
		$interpolateProvider.endSymbol('%>');
	});