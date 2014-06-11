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
		});
		$scope.isLoading = true;
		$interval(function () { 
			$installationService.stats({ name: $scope.name }, function (server) {
				$scope.isLoading = false;
				if(server.name === "ConnectionError") {
					return $scope.serverStats = [{process: 'Something went wrong!'}];
				}
				$scope.serverStats = server.processing;
		})}, 10000);
	});