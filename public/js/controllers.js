"use strict";

angular.module('ApplicationModule')
	.controller('HomeController', function ($scope, $installationService, $current, $location) {

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

		$scope.redirectUnit = function redirectUnit () {
			var url = $current.installation.name + '/';
			url += $current.item ? $current.item.imei : 'unit/search';
			$location.path(url);
			return url;
		};
	})
	.controller('InstallationController', function ($scope, $installationService, $routeParams, $current, $location) {
		$scope.requestStats = function requestStats () {
			if($scope.repeatLoading === undefined) {
				$scope.isLoading = true;
				$scope.somethingWrong = false;
			}

			$installationService.stats({ name: $current.installation.name }, function (server) {
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

		$installationService.get({ name: $routeParams.installation }, function (rs) {
			if(rs.err)
				$location.path($routeParams.installation + '/notfound');
			$scope.installation = $current.installation = rs.installation;
			$scope.requestStats();
		});
	})
	.controller('PartialErrorController', function ($scope, $routeParams) {
		$scope.params = $routeParams;
	})
	.controller('UnitSearchController', function ($scope, $routeParams, $current, $location, $unitService) {
		$scope.search = function search () {
			$location.path('/' + $current.installation.name + '/' + $current.item.imei);
		};

		$unitService.search({installation: $routeParams.installation, imei: $scope.searchValue || 'None'  },
			function (response) {
				if(response.err) {
					if(response.err.installation) $location.path('/#/'+$routeParams.installation+'/notfound');
					$current.installation = response.installation;
					if(response.err.unit) $location.path('/#/'+$routeParams.installation+'/'+$routeParams.imei+'/notfound');
					// Other Errors
				}
				if (response.items.length === 1) {
					$current.item = response.items[0];
				} else {
					$scope.units = response.items;
					$location.path('/' + $current.installation.name + '/' + $current.item.imei + '/multi');
				}
			});
	});