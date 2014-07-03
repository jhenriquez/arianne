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
			if ($current.installation != undefined && $current.installation.name != rs.installation.name)
				$current.imei = undefined;
			$current.installation = installation;
		};

		$scope.current = function current () {
			return $current.installation;
		};

		$scope.redirectUnit = function redirectUnit () {
			var url = $current.installation.name + '/';
			url += $current.imei ? $current.imei : 'units';
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
			if ($current.installation != undefined && $current.installation.name != rs.installation.name)
				$current.imei = undefined;
			$scope.installation = $current.installation = rs.installation;
			$scope.requestStats();
		});
	})
	.controller('PartialErrorController', function ($scope, $routeParams) {
		$scope.params = $routeParams;
	})
	.controller('UnitController', function ($scope, $routeParams, $current, $location, $unitService) {

		$scope.search = function search () {
			if($scope.imei)
				$location.path($routeParams.installation + '/' + $scope.imei);
		}

		$scope.requestUnitInformation = function requestUnitInformation () {
			$scope.requestLoading = true;
			$unitService.search({installation: $routeParams.installation, imei: $routeParams.imei },
				function (response) {
					$scope.requestLoading = false;
					if(response.err) {

						if(response.err.installation) 
							return $location.path($routeParams.installation+'/notfound');

						$current.installation = response.installation;

						if(response.err.unit)
							return $location.path($routeParams.installation+'/'+$routeParams.imei+'/notfound');

						return $scope.requestError = true;
					}

					$current.installation = $scope.installation = response.installation;
					$current.imei = $routeParams.imei;

					if (response.items.length === 1) {
						$scope.item = response.items[0];
					} else {
						$scope.items = response.items;
						$scope.isMultiple = true;
					}

					if ($routeParams.item) {
						$scope.items.forEach(function (i) {
							if(i.id == $routeParams.item) {
								$scope.isMultiple = false;
								$scope.item = i;
							}
						});
					}
			});
		}

		if($routeParams.imei)
			$scope.requestUnitInformation();
	});