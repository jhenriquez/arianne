"use strict";

var InstallationSearch = angular.module('InstallationSearch');

InstallationSearch.controller('SearchController', function ($scope, $resource) {

	$scope.searchInstallations = function () {
		if(!$scope.searchValue) {
			$scope.installations = [];
			return;
		}

		var _resource = $resource('/api/installation/:search');
			var installations = _resource.query({'search' : $scope.searchValue }, function () {
				$scope.installations = installations;
			});
		/*if($scope.searchValue.length > 2) {
			
		} else {
			$scope.installations = [];
		}*/
	}
});