"use strict";

angular.module('InstallationSearch')
	.controller('SearchController', function ($scope, $installationService) {

		$scope.searchInstallations = function searchInstallations () {
			if(!$scope.searchValue) {
				$scope.installations = [];
				return;
			}

			$scope.isLoading = true;

			$installationService.search({for: $scope.searchValue }, function (installations) {
				$scope.isLoading = false;
				$scope.installations = installations;
			});
		};

		$scope.selectCustomer = function selectCustomer (installation) {
			$scope.installations = [];
			$scope.searchValue = '';
			$scope.installation = installation;
		};

		$scope.showNavigation = function showNavigation () {
			return $scope.installation;
		};
		
	})
	.controller('InstallationController', function ($scope, $installationService, $routeParams) {

		$scope.requestStats = function requestStats () {
			if (!$scope.installation)
				return;

			if($scope.repeatLoading === undefined) {
				$scope.isLoading = true;
				$scope.somethingWrong = false;
			}

			$installationService.stats({ name: $scope.installation.name }, function (server) {
				if($scope.repeatLoading === undefined) {
					$scope.isLoading = false;
				} else {
					$scope.repeatLoading = false;
				}

				if(server.name) {
					if($scope.refreshError === undefined) {
						return $scope.somethingWrong = true;
					} else {
						return $scope.refreshError = true;
					}
				}

				$scope.somethingWrong = false;
				$scope.serverStats = server.processing;
			});
		};

		$scope.refreshProcessing = function refreshProcessing () {
			$scope.repeatLoading = true;
			$scope.refreshError = false;
			$scope.requestStats();
		};

		$scope.showRefresh = function showRefresh () {
			return $scope.serverStats != undefined;
		};

		if($scope.$parent.installation) {
			$scope.installation = $scope.$parent.installation;
			$scope.requestStats();
		}

		if(!$scope.installation && $routeParams.name)
			$installationService.get({ name: $routeParams.name }, function (installation) {
				$scope.installation = $scope.$parent.installation = installation;
				$scope.requestStats();
			});
	});