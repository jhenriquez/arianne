"use strict";

angular.module('ApplicationModule')
	.controller('SearchController', function ($scope, $installationService, $current) {

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
			$current.installation = installation;
		};

		$scope.current = function current () {
			return $current.installation;
		};
	})
	.controller('InstallationController', function ($scope, $installationService, $routeParams, $current) {
		$scope.requestStats = function requestStats () {
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

		if($current.installation) {
			$scope.installation = $current.installation;
			$scope.requestStats();
		} else {
			$installationService.get({ name: $routeParams.installation }, function (installation) {
				$current.installation = installation;
				$scope.requestStats();
			});
		}
	});