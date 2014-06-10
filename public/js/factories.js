angular.module('InstallationSearch')
	.factory('$installationService', function ($resource) {
		return $resource('/api/installation/:search');
	});