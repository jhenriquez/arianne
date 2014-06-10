"use strict";

angular.module('InstallationSearch')
	.controller('SearchController', function ($scope, $installationService) {
		$scope.searchInstallations = function () {
			if(!$scope.searchValue) {
				$scope.installations = [];
				return;
			}

			var installations = $installationService.query({'search' : $scope.searchValue }, function () {
				$scope.installations = installations;
			});
		}
	});