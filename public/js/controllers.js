"use strict";

angular.module('InstallationSearch')
	.controller('SearchController', function ($scope, $installationService) {
		$scope.searchInstallations = function () {
			if(!$scope.searchValue) {
				$scope.installations = [];
				return;
			}

			var installations = $installationService.search({for: $scope.searchValue }, function () {
				$scope.installations = installations;
			});
		}
	})
	.controller('InstallationController', function($scope, $installationService, $routeParams) {
		$scope.isLoading = true;
		var installation = $installationService.get({ name: $routeParams.name }, function () {
			$scope.isLoading = false;
			$scope.name = installation.name;
		});
	});