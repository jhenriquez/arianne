"use strict";

angular.module('InstallationSearch')
	.controller('SearchController', function ($scope, $installationService) {
		$scope.searchInstallations = function () {
			if(!$scope.searchValue) {
				$scope.installations = [];
				return;
			}

			$scope.isLoading = true;

			$installationService.search({for: $scope.searchValue }, function (installations) {
				$scope.isLoading = false;
				$scope.installations = installations;
			});
		}

		$scope.selectCustomer = function () {
			$scope.installations = [];
			$scope.searchValue = '';
		}
	})
	.controller('InstallationController', function($scope, $installationService, $routeParams, $interval) {
		$installationService.get({ name: $routeParams.name }, function (installation) {
			$scope.name = installation.name;
			$scope.dbase = installation.dbase;
			$scope.connectionString = installation.connectionString;
			$scope.engine = installation.engine;
			$scope.mailSenderName = installation.mailSenderName;

			$scope.performRequest();
		});

		$scope.performRequest = function performRequest () {
			if($scope.repeatLoading === undefined) {
				$scope.isLoading = true;
				$scope.somethingWrong = false;
			}

			$installationService.stats({ name: $scope.name }, function (server) {
				if($scope.repeatLoading === undefined) {
					$scope.isLoading = false;
				} else {
					$scope.repeatLoading = false;
				}

				if(server.name === "ConnectionError") {
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
			$scope.performRequest();
		};

		$scope.showRefresh = function showRefresh () {
			if($scope.somethingWrong === undefined || !$scope.somethingWrong)
				return false;
			return !$scope.somethingWrong && !$scope.repeatLoading;
		};
	});