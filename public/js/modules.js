
angular.module('LoDashIntegration', [])
	.factory('$_', function() {
		return window._;
	});

angular.module('InstallationSearch', ['LoDashIntegration'])
	.config(function($interpolateProvider) {
		$interpolateProvider.startSymbol('<%=');
		$interpolateProvider.endSymbol('%>');
	});

